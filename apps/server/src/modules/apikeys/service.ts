import { prisma } from "db";
import { ApiKeyModelType } from "./model";

export abstract class ApiKeyService {
	static generateApiKey() {
		return `skd-or-v1-${crypto.randomUUID().replace(/-/g, "")}`;
	}
	static async createApiKey(
		name: string,
		userId: number,
	): Promise<ApiKeyModelType["createApiKeyResponse"]> {
		const newApiKey = await prisma.apiKey.create({
			data: {
				userId,
				name,
				apiKey: this.generateApiKey(),
			},
		});
		return {
			id: newApiKey.id,
			apiKey: newApiKey.apiKey,
		};
	}
}
