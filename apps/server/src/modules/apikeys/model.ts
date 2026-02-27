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
} as const;

export type ApiKeyModelType = {
	[k in keyof typeof ApiKeyModel]: UnwrapSchema<(typeof ApiKeyModel)[k]>;
};
