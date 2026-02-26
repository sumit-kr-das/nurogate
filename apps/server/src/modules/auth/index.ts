import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";

export const app = new Elysia({
	prefix: "auth",
})
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	.post(
		"sign-up",
		async ({ body, status }) => {
			try {
				const response = await AuthService.signup(body);
				return response;
			} catch (err) {
				return status(400, "Invalid username or password");
			}
		},
		{
			body: AuthModel.signUpBody,
			response: {
				200: AuthModel.signUpResponse,
				400: AuthModel.signUpInvalid,
			},
		},
	)
	.post(
		"sign-in",
		async ({ body, jwt, status, cookie: { auth } }) => {
			try {
				const response = await AuthService.signin(body);
				if (typeof response === "string") {
					return status(400, response);
				}
				const { userId, email } = response;
				const token = await jwt.sign({
					userId,
					email,
				});
				auth.set({
					value: token,
					httpOnly: true,
					maxAge: 7 * 86400,
					// path: "/profile",
				});

				return { token };
			} catch (err) {
				return status(400, "Invalid username or password");
			}
		},
		{
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid,
			},
		},
	);
