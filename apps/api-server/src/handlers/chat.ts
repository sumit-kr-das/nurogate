import { prisma } from "db";
import type { ChatCompletionRequest, ProviderId } from "../types";
import { buildProviders } from "../llm/registry";
import { jsonError, getBearerToken } from "../utils/http";
import { chooseRandom } from "../utils/random";
import { creditsUsedFromUsage } from "../utils/credits";

const providers = buildProviders();

export async function handleChatCompletions(args: {
	req: ChatCompletionRequest;
	request: Request;
	set: { status?: number | string };
}) {
	const { req, request, set } = args;

	if (!req?.model || !Array.isArray(req.messages)) {
		set.status = 400;
		return jsonError("Invalid request body. Expected { model, messages }.", 400)
			.body;
	}

	if (req.stream) {
		set.status = 400;
		return jsonError(
			"stream=true is not supported for billed requests yet.",
			400,
		).body;
	}

	const apiKey = getBearerToken(request);
	if (!apiKey) {
		set.status = 401;
		return jsonError("Missing Bearer API key", 401).body;
	}

	const apiKeyDb = await prisma.apiKey.findFirst({
		where: {
			apiKey,
			disabled: false,
			deleted: false,
		},
		select: {
			id: true,
			user: {
				select: {
					id: true,
					credits: true,
				},
			},
		},
	});

	if (!apiKeyDb) {
		set.status = 403;
		return jsonError("Invalid api key", 403).body;
	}

	if (apiKeyDb.user.credits <= 0) {
		set.status = 403;
		return jsonError("You dont have enough credits in your db", 403).body;
	}

	const modelDb = await prisma.model.findUnique({
		where: { slug: req.model },
		include: {
			modelProviderMapping: {
				where: { enabled: true },
				include: { provider: true },
			},
		},
	});

	if (!modelDb) {
		set.status = 403;
		return jsonError("This is an invalid model we dont support", 403).body;
	}

	const candidates = modelDb.modelProviderMapping.filter((m) => {
		const providerKey = m.provider.providerKey as ProviderId;
		const provider = providers[providerKey];
		return Boolean(provider && provider.isConfigured());
	});

	const mapping = chooseRandom(candidates);
	if (!mapping) {
		set.status = 403;
		return jsonError("No provider found for this model", 403).body;
	}

	const providerKey = mapping.provider.providerKey as ProviderId;
	const provider = providers[providerKey];
	if (!provider) {
		set.status = 403;
		return jsonError("No provider found for this model", 403).body;
	}

	let response;
	try {
		response = await provider.chat({
			...req,
			parsedModel: {
				provider: providerKey,
				model: mapping.upstreamModel,
				original: req.model,
			},
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		const status =
			typeof message === "string" && message.includes(" is not set")
				? 400
				: typeof message === "string" && message.startsWith("{")
					? 502
					: 500;
		set.status = status;
		return jsonError(message, status).body;
	}

	const promptTokens = response.usage?.prompt_tokens ?? 0;
	const completionTokens = response.usage?.completion_tokens ?? 0;

	const creditsUsed = creditsUsedFromUsage({
		promptTokens,
		completionTokens,
		inputTokenCost: mapping.inputTokenCost,
		outputTokenCost: mapping.outputTokenCost,
	});

	try {
		await prisma.$transaction(async (tx) => {
			const decremented = await tx.user.updateMany({
				where: {
					id: apiKeyDb.user.id,
					credits: { gte: creditsUsed },
				},
				data: {
					credits: {
						decrement: creditsUsed,
					},
				},
			});

			if (decremented.count === 0) {
				throw new Error("INSUFFICIENT_CREDITS");
			}

			await tx.apiKey.update({
				where: {
					id: apiKeyDb.id,
				},
				data: {
					lastUsed: new Date(),
					creditsConsumed: {
						increment: creditsUsed,
					},
				},
			});

			await tx.conversation.create({
				data: {
					userId: apiKeyDb.user.id,
					apiKeyId: apiKeyDb.id,
					modelProviderMappingId: mapping.id,
					input: JSON.stringify(req.messages),
					output: response.choices[0]?.message.content ?? "",
					inputTokenCount: promptTokens,
					outputTokenCount: completionTokens,
				},
			});
		});
	} catch (err) {
		if (err instanceof Error && err.message === "INSUFFICIENT_CREDITS") {
			set.status = 403;
			return jsonError("You dont have enough credits in your db", 403).body;
		}

		const message = err instanceof Error ? err.message : "Unknown error";
		set.status = 500;
		return jsonError(message, 500).body;
	}

	return response;
}
