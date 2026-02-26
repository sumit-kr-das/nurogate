import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
	/* Sign In */
	signInBody: t.Object({
		email: t.String(),
		password: t.String(),
	}),
	signInResponse: t.Object({
		token: t.String(),
	}),
	signInServiceResponse: t.Object({
		userId: t.String(),
		email: t.String(),
	}),
	signInInvalid: t.Literal("Invalid username or password"),

	/* Sign Up */
	signUpBody: t.Object({
		email: t.String(),
		password: t.String(),
	}),
	signUpResponse: t.Object({
		user: t.String(),
	}),
	signUpInvalid: t.Literal("Invalid username or password"),
};

export type AuthModelType = {
	[k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
