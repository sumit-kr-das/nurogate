export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
	role: ChatRole;
	content: string;
	name?: string;
};

export type ChatCompletionRequest = {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	top_p?: number;
	max_tokens?: number;
	stream?: boolean;
	stop?: string | string[];
};

export type OpenAIChatCompletionResponse = {
	id: string;
	object: "chat.completion";
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: { role: "assistant"; content: string };
		finish_reason: "stop" | "length" | "content_filter" | "tool_calls" | null;
	}>;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
};

export type OpenAIErrorResponse = {
	error: {
		message: string;
		type?: string;
		param?: string | null;
		code?: string | null;
	};
};

export type ProviderId = "gemini" | "openai" | "claude" | "groq";

export type ParsedModelId = {
	provider: ProviderId;
	model: string;
	original: string;
};
