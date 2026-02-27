import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./model";

export const app = new Elysia({ prefix: "api-key" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	.resolve(async ({ cookie: { auth }, status, jwt }) => {
		if (!auth) return status(401, "Unauthorized");
		const decoded = await jwt.verify(auth.value as string);
		if (!decoded || !decoded.userId) {
			return status(401);
		}
		return {
			userId: decoded.userId as string,
		};
	})
	.post(
		"/",
		async ({ userId, body }) => {
			const { id, apiKey } = await ApiKeyService.createApiKey(
				body.name,
				Number(userId),
			);
			return {
				id,
				apiKey,
			};
		},
		{
			body: ApiKeyModel.createApiKeyBody,
			response: {
				200: ApiKeyModel.createApiKeyResponse,
			},
		},
	)
	.get(
		"/",
		async ({ userId }) => {
			const apiKeys = await ApiKeyService.getApiKeys({
				userId: Number(userId),
			});
			return apiKeys;
		},
		{
			body: ApiKeyModel.getApiKeysBody,
			response: {
				200: ApiKeyModel.getApiKeysResponse,
			},
		},
	)
	.put(
		"/disable-status",
		async ({ userId, body, status }) => {
			try {
				await ApiKeyService.disableStatus(Number(userId), body);

				return {
					message: "Api key status updated",
				};
			} catch (err) {
				return status(411, {
					message: "Api key status update failed",
				});
			}
		},
		{
			body: ApiKeyModel.disableApiKeysBody,
			respnse: {
				200: ApiKeyModel.disableApiKeyResponse,
				411: ApiKeyModel.disableApiKeyFailedResponse,
			},
		},
	);
