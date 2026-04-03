type JwtPayload = {
	userId?: string;
	email?: string;
	[key: string]: unknown;
};

function base64UrlDecode(input: string) {
	const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
	return atob(padded);
}

export function decodeJwt(token: string): JwtPayload | null {
	try {
		const [, payload] = token.split(".");
		if (!payload) return null;
		const json = base64UrlDecode(payload);
		const parsed = JSON.parse(json) as unknown;
		if (!parsed || typeof parsed !== "object") return null;
		return parsed as JwtPayload;
	} catch {
		return null;
	}
}

export function getAuthToken() {
	return localStorage.getItem("authToken") ?? sessionStorage.getItem("authToken");
}

export function clearAuthToken() {
	localStorage.removeItem("authToken");
	sessionStorage.removeItem("authToken");
}
