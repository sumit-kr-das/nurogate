import { prisma } from "db";
import { AuthModelType } from "./model";

export abstract class AuthService {
	static async signup(
		data: AuthModelType["signUpBody"],
	): Promise<AuthModelType["signUpResponse"] | AuthModelType["signUpInvalid"]> {
		const { email, password } = data;

		if (!email || !password) {
			return "Invalid username or password";
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: await Bun.password.hash(password),
			},
		});

		return {
			user: user.id.toString(),
		};
	}
	static async signin(
		data: AuthModelType["signInBody"],
	): Promise<
		AuthModelType["signInServiceResponse"] | AuthModelType["signInInvalid"]
	> {
		const { email, password } = data;

		if (!email || !password) {
			return "Invalid username or password";
		}

		const isUserExist = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!isUserExist) {
			return "Invalid username or password";
		}

		const matchPassword = await Bun.password.verify(
			password,
			isUserExist.password,
		);

		if (!matchPassword) {
			return "Invalid username or password";
		}

		return {
			userId: isUserExist.id.toString(),
			email: isUserExist.email,
		};
	}
}
