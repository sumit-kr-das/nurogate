import cors from "@elysiajs/cors";
import "dotenv/config";
import { app } from "./app";

app
	.use(
		cors({
			origin: "http://localhost:3001",
			credentials: true,
		}),
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
