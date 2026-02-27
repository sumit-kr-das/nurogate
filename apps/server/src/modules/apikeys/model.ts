import { t, type UnwrapSchema } from "elysia";

export const ApiKeyModel = {
	/* Create Api Key */
	createApiKeyBody: t.Object({
		name: t.String(),
	}),
	createApiKeyResponse: t.Object({
		id: t.Number(),
		apiKey: t.String(),
	}),
	createApiKeySuccess: t.Object({
		message: t.Literal("Api Key Created Successfully"),
	}),
	/* Get Api Keys */
	getApiKeysBody: t.Object({
		userId: t.Number(),
	}),
	getApiKeysResponse: t.Object({
		apiKeys: t.Array(
			t.Object({
				id: t.String(),
				apiKey: t.String(),
				name: t.String(),
				credisConsumed: t.Number(),
				lastUsed: t.Nullable(t.Date()),
				disabled: t.Boolean(),
			}),
		),
	}),
	/* Disable Status */
	disableApiKeysBody: t.Object({
		id: t.Number(),
		// userId: t.Number(),
		disabled: t.Boolean(),
	}),
	disableApiKeyResponse: t.Object({
		message: t.Literal("Api key status updated"),
	}),
	disableApiKeyFailedResponse: t.Object({
		message: t.Literal("Api key status update failed"),
	}),
} as const;

export type ApiKeyModelType = {
	[k in keyof typeof ApiKeyModel]: UnwrapSchema<(typeof ApiKeyModel)[k]>;
};
