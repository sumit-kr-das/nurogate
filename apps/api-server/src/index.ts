import { Elysia } from "elysia";
import type {
	ChatCompletionRequest,
	OpenAIErrorResponse,
	ProviderId,
} from "./types";
import { buildProviders, parseModelId } from "./llm/registry";

const providers = buildProviders();
const defaultProvider =
	(process.env.DEFAULT_PROVIDER as ProviderId | undefined) ?? "gemini";
const port = Number(process.env.PORT ?? 3000);

function jsonError(
	message: string,
	status: number,
): { body: OpenAIErrorResponse; status: number } {
	return {
		status,
		body: {
			error: {
				message,
			},
		},
	};
}

function isAuthorized(request: Request): boolean {
	const serverKey = process.env.API_SERVER_KEY;
	if (!serverKey) return true;
	const auth = request.headers.get("authorization") ?? "";
	return auth === `Bearer ${serverKey}`;
}

const app = new Elysia()
	.onAfterHandle(({ set }) => {
		set.headers["access-control-allow-origin"] = "*";
		set.headers["access-control-allow-headers"] = "authorization, content-type";
		set.headers["access-control-allow-methods"] = "GET,POST,OPTIONS";
	})
	.options("*", ({ set }) => {
		set.status = 204;
		return "";
	})
	.onBeforeHandle(({ request, set, path }) => {
		if (path === "/" || path === "/health") return;
		if (!isAuthorized(request)) {
			set.status = 401;
			return jsonError("Unauthorized", 401).body;
		}
	})
	.get("/", () => ({ name: "NeuroGate API Server", status: "ok" }))
	.get("/health", () => ({ status: "ok" }))
	.get("/v1/providers", () => {
		const data = (Object.keys(providers) as ProviderId[]).map((id) => {
			const provider = providers[id];
			return {
				id,
				configured: provider.isConfigured(),
				suggested_models: provider.suggestedModels().map((m) => `${id}/${m}`),
			};
		});
		return { object: "list", data };
	})
	.get("/v1/models", () => {
		const data = (Object.keys(providers) as ProviderId[])
			.flatMap((id) =>
				providers[id]
					.suggestedModels()
					.map((m) => ({ id: `${id}/${m}`, owned_by: id })),
			)
			.map((m) => ({ id: m.id, object: "model", owned_by: m.owned_by }));

		return { object: "list", data };
	})
	.post("/v1/chat/completions", async ({ body, set }) => {
		const req = body as ChatCompletionRequest;

		if (!req?.model || !Array.isArray(req.messages)) {
			set.status = 400;
			return jsonError(
				"Invalid request body. Expected { model, messages }.",
				400,
			).body;
		}

		const parsed = parseModelId(req.model, defaultProvider);
		const provider = providers[parsed.provider];
		if (!provider) {
			set.status = 400;
			return jsonError(`Unsupported provider: ${parsed.provider}`, 400).body;
		}

		try {
			if (req.stream) {
				if (!provider.chatStream) {
					set.status = 400;
					return jsonError(
						`Streaming is not supported for provider: ${provider.id}`,
						400,
					).body;
				}
				return await provider.chatStream({
					...req,
					model: parsed.model,
					stream: true,
				});
			}

			const response = await provider.chat({
				...req,
				parsedModel: parsed,
			});

			return response;
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
	})
	.listen(port);

console.log(
	`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
