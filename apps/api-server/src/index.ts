import { Elysia } from "elysia";
import type { ChatCompletionRequest } from "./types";
import { handleChatCompletions } from "./handlers/chat";

const port = Number(process.env.PORT ?? 3000);

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
	.get("/", () => ({ name: "NeuroGate API Server", status: "ok" }))
	.get("/health", () => ({ status: "ok" }))
	.post("/v1/chat/completions", async ({ body, request, set }) => {
		return handleChatCompletions({
			req: body as ChatCompletionRequest,
			request,
			set,
		});
	})
	.post("/api/v1/chat/completions", async ({ body, request, set }) => {
		return handleChatCompletions({
			req: body as ChatCompletionRequest,
			request,
			set,
		});
	})
	.listen(port);

console.log(
	`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
