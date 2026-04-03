export function getApiBaseUrl() {
	return (
		(import.meta as unknown as { env?: Record<string, string | undefined> }).env
			?.BUN_PUBLIC_API_URL ?? "http://localhost:3000"
	);
}

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${getApiBaseUrl()}${path}`, {
		...init,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
	});

	if (!res.ok) {
		const contentType = res.headers.get("content-type") ?? "";
		let message: string | null = null;

		if (contentType.includes("application/json")) {
			const json = await res.json().catch(() => null);
			if (typeof json === "string") message = json;
			if (json && typeof json === "object" && "message" in json) {
				const maybeMessage = (json as { message?: unknown }).message;
				if (typeof maybeMessage === "string") message = maybeMessage;
			}
		}

		if (!message) {
			message = (await res.text().catch(() => "")) || null;
		}

		throw new Error(message ?? `Request failed: ${res.status}`);
	}

	return (await res.json()) as T;
}
