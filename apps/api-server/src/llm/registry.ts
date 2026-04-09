import type { ParsedModelId, ProviderId } from "../types";
import type { LlmProvider } from "./Base";
import { ClaudeProvider } from "./Claude";
import { GeminiProvider } from "./Gemini";
import { OpenAICompatibleProvider } from "./OpenAICompatible";

export function parseModelId(
	model: string,
	fallbackProvider?: ProviderId,
): ParsedModelId {
	const trimmed = model.trim();
	const slash = trimmed.indexOf("/");
	const colon = trimmed.indexOf(":");
	const splitIndex =
		slash === -1 ? colon : colon === -1 ? slash : Math.min(slash, colon);

	if (splitIndex !== -1) {
		const rawProvider = trimmed.slice(0, splitIndex).toLowerCase();
		const provider = (
			rawProvider === "anthropic"
				? "claude"
				: rawProvider === "google"
					? "gemini"
					: rawProvider
		) as ProviderId;
		const innerModel = trimmed.slice(splitIndex + 1);
		if (
			provider === "gemini" ||
			provider === "openai" ||
			provider === "claude" ||
			provider === "groq"
		) {
			return { provider, model: innerModel, original: trimmed };
		}
	}

	const provider = (fallbackProvider ?? "gemini") as ProviderId;
	return { provider, model: trimmed, original: trimmed };
}

export function buildProviders(): Record<ProviderId, LlmProvider> {
	const openai = new OpenAICompatibleProvider({
		id: "openai",
		baseUrl: "https://api.openai.com/v1",
		apiKeyEnv: "OPENAI_API_KEY",
		suggestedModels: ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"],
	});

	const groq = new OpenAICompatibleProvider({
		id: "groq",
		baseUrl: "https://api.groq.com/openai/v1",
		apiKeyEnv: "GROQ_API_KEY",
		suggestedModels: [
			"llama-3.1-70b-versatile",
			"llama-3.1-8b-instant",
			"mixtral-8x7b-32768",
		],
	});

	return {
		gemini: new GeminiProvider(),
		openai,
		claude: new ClaudeProvider(),
		groq,
	};
}
