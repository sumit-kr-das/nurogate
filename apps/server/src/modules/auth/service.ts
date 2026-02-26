import { AuthModelType } from "./model";

export abstract class AuthService {
	static async signup(
		data: AuthModelType["signUpBody"],
	): Promise<AuthModelType["signUpResponse"] | AuthModelType["signUpInvalid"]> {
		const { email, password } = data;

		if (!email || !password) {
			return "Invalid username or password";
		}

		return {
			token: "fake-jwt-token",
		};
	}
	static async signin(
		data: AuthModelType["signUpBody"],
	): Promise<AuthModelType["signUpResponse"] | AuthModelType["signUpInvalid"]> {
		const { email, password } = data;

		if (!email || !password) {
			return "Invalid username or password";
		}

		return {
			token: "fake-jwt-token",
		};
	}
}
