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
	createApiKeySuccess: t.Literal("Api Key Created Successfully"),
	/* Get Api Keys */
} as const;

export type ApiKeyModelType = {
	[k in keyof typeof ApiKeyModel]: UnwrapSchema<(typeof ApiKeyModel)[k]>;
};
