import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";

export const app = new Elysia({
	prefix: "auth",
})
	.post(
		"sign-up",
		async ({ body }) => {
			const response = await AuthService.signup(body);
			return response;
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
		async ({ body }) => {
			const response = await AuthService.signin(body);
			return response;
		},
		{
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid,
			},
		},
	);
