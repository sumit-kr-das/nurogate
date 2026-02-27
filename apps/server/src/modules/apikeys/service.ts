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
	static async getApiKeys(
		data: ApiKeyModelType["getApiKeysBody"],
	): Promise<ApiKeyModelType["getApiKeysResponse"]> {
		const apiKeys = await prisma.apiKey.findMany({
			where: {
				userId: data.userId,
				deleted: false,
			},
		});
		return {
			apiKeys: apiKeys.map((apiKey) => ({
				id: apiKey.id.toString(),
				apiKey: apiKey.apiKey,
				name: apiKey.name,
				credisConsumed: apiKey.creditsConsumed,
				lastUsed: apiKey.lastUsed,
				disabled: apiKey.disabled,
			})),
		};
	}
}
