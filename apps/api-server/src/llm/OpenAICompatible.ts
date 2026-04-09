import type {
	ChatCompletionRequest,
	OpenAIChatCompletionResponse,
} from "../types";
import type { LlmChatInput, LlmProvider } from "./Base";

type OpenAICompatibleConfig = {
	id: "openai" | "groq";
	baseUrl: string;
	apiKeyEnv: string;
	suggestedModels: string[];
};

export class OpenAICompatibleProvider implements LlmProvider {
	readonly id: string;

	private readonly baseUrl: string;
	private readonly apiKeyEnv: string;
	private readonly modelSuggestions: string[];

	constructor(config: OpenAICompatibleConfig) {
		this.id = config.id;
		this.baseUrl = config.baseUrl.replace(/\/+$/, "");
		this.apiKeyEnv = config.apiKeyEnv;
		this.modelSuggestions = config.suggestedModels;
	}

	isConfigured(): boolean {
		return Boolean(process.env[this.apiKeyEnv]);
	}

	suggestedModels(): string[] {
		return this.modelSuggestions;
	}

	async chat(input: LlmChatInput): Promise<OpenAIChatCompletionResponse> {
		const apiKey = process.env[this.apiKeyEnv];
		if (!apiKey) throw new Error(`${this.apiKeyEnv} is not set`);

		const res = await fetch(`${this.baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${apiKey}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				model: input.parsedModel.model,
				messages: input.messages,
				temperature: input.temperature,
				top_p: input.top_p,
				max_tokens: input.max_tokens,
				stop: input.stop,
			}),
		});

		const text = await res.text();
		if (!res.ok) {
			throw new Error(text || `Upstream error (${res.status})`);
		}
		return JSON.parse(text) as OpenAIChatCompletionResponse;
	}

	async chatStream(request: ChatCompletionRequest): Promise<Response> {
		const apiKey = process.env[this.apiKeyEnv];
		if (!apiKey) throw new Error(`${this.apiKeyEnv} is not set`);

		const res = await fetch(`${this.baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${apiKey}`,
				"content-type": "application/json",
				accept: "text/event-stream",
			},
			body: JSON.stringify({ ...request, stream: true }),
		});

		if (!res.ok || !res.body) {
			const text = await res.text();
			throw new Error(text || `Upstream error (${res.status})`);
		}

		return new Response(res.body, {
			status: 200,
			headers: {
				"content-type": res.headers.get("content-type") ?? "text/event-stream",
				"cache-control": "no-cache",
				connection: "keep-alive",
			},
		});
	}
}
