import { Elysia } from "elysia";
import { app as authRouter } from "./modules/auth";

const app = new Elysia().use(authRouter).listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
