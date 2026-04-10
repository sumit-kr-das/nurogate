import type { OpenAIErrorResponse } from "../types";

export function jsonError(
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

export function getBearerToken(request: Request): string | null {
	const auth = request.headers.get("authorization") ?? "";
	const match = auth.match(/^Bearer\s+(.+)$/i);
	return match?.[1]?.trim() ? match[1].trim() : null;
}
