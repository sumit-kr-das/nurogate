import { Elysia } from "elysia";

export const app = new Elysia({
	prefix: "auth",
}).post("sign-up", () => {});
