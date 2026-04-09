import type { ChatCompletionRequest, OpenAIChatCompletionResponse } from "../types";

export type LlmChatInput = Omit<ChatCompletionRequest, "stream"> & {
  parsedModel: { provider: string; model: string; original: string };
};

export type LlmChatOutput = OpenAIChatCompletionResponse;

export interface LlmProvider {
  id: string;
  isConfigured(): boolean;
  chat(input: LlmChatInput): Promise<LlmChatOutput>;
  chatStream?(request: ChatCompletionRequest): Promise<Response>;
  suggestedModels(): string[];
}
