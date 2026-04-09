import type { ChatMessage, OpenAIChatCompletionResponse } from "../types";
import type { LlmChatInput, LlmProvider } from "./Base";

function extractSystem(messages: ChatMessage[]): string | undefined {
  const parts = messages.filter((m) => m.role === "system").map((m) => m.content.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.join("\n");
}

function stripSystem(messages: ChatMessage[]): Array<{ role: "user" | "assistant"; content: string }> {
  return messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }))
    .filter((m) => m.role === "user" || m.role === "assistant");
}

type AnthropicMessageResponse = {
  id: string;
  model: string;
  content: Array<{ type: string; text?: string }>;
  usage?: { input_tokens?: number; output_tokens?: number };
};

export class ClaudeProvider implements LlmProvider {
  readonly id = "claude";

  isConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }

  suggestedModels(): string[] {
    return ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-latest"];
  }

  async chat(input: LlmChatInput): Promise<OpenAIChatCompletionResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

    const system = extractSystem(input.messages);
    const messages = stripSystem(input.messages);
    const maxTokens = input.max_tokens ?? 1024;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: input.parsedModel.model,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || `Upstream error (${res.status})`);
    }

    const data = JSON.parse(text) as AnthropicMessageResponse;
    const content = data.content.map((c) => (c.type === "text" ? c.text ?? "" : "")).join("");

    const promptTokens = data.usage?.input_tokens ?? 0;
    const completionTokens = data.usage?.output_tokens ?? 0;
    const totalTokens = promptTokens + completionTokens;

    return {
      id: `chatcmpl_${crypto.randomUUID()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: input.parsedModel.original,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
      },
    };
  }
}

