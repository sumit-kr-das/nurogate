import { Elysia } from "elysia";
import { app as authRouter } from "./modules/auth";
import { app as apiKeyRouter } from "./modules/apikeys";
import { app as modelsRouter } from "./modules/models";
import { app as paymentsRouter } from "./modules/payments";
import "dotenv/config";

export const app = new Elysia()
	.use(authRouter)
	.use(apiKeyRouter)
	.use(modelsRouter)
	.use(paymentsRouter);

export type App = typeof app;
