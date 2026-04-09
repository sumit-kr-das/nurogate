import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, OpenAIChatCompletionResponse } from "../types";
import type { LlmChatInput, LlmProvider } from "./Base";

function toGeminiRole(role: ChatMessage["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

function extractSystemPrompt(messages: ChatMessage[]): string | undefined {
  const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content.trim()).filter(Boolean);
  if (systemParts.length === 0) return undefined;
  return systemParts.join("\n");
}

function stripSystem(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((m) => m.role !== "system");
}

export class GeminiProvider implements LlmProvider {
  readonly id = "gemini";

  private getAi(): GoogleGenAI {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");
    return new GoogleGenAI({ apiKey });
  }

  isConfigured(): boolean {
    return Boolean(process.env.GOOGLE_API_KEY);
  }

  suggestedModels(): string[] {
    return ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  }

  async chat(input: LlmChatInput): Promise<OpenAIChatCompletionResponse> {
    const systemInstruction = extractSystemPrompt(input.messages);
    const contents = stripSystem(input.messages).map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    }));

    const response = await this.getAi().models.generateContent({
      model: input.parsedModel.model,
      contents,
      ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    });

    const created = Math.floor(Date.now() / 1000);
    const content = response.text ?? "";
    const promptTokens = response.usageMetadata?.promptTokenCount ?? 0;
    const completionTokens = response.usageMetadata?.candidatesTokenCount ?? 0;
    const totalTokens = promptTokens + completionTokens;

    return {
      id: `chatcmpl_${crypto.randomUUID()}`,
      object: "chat.completion",
      created,
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
