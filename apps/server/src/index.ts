import { Elysia } from "elysia";
import { app as authRouter } from "./modules/auth";
import { app as apiKeyRouter } from "./modules/apikeys";
import "dotenv/config";

const app = new Elysia().use(authRouter).use(apiKeyRouter).listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
