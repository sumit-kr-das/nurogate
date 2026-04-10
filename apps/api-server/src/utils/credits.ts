export function creditsUsedFromUsage(args: {
	promptTokens: number;
	completionTokens: number;
	inputTokenCost: number;
	outputTokenCost: number;
}): number {
	const promptTokens = Math.max(0, Math.floor(args.promptTokens));
	const completionTokens = Math.max(0, Math.floor(args.completionTokens));
	const inputTokenCost = Math.max(0, Math.floor(args.inputTokenCost));
	const outputTokenCost = Math.max(0, Math.floor(args.outputTokenCost));

	const totalTenths =
		BigInt(promptTokens) * BigInt(inputTokenCost) +
		BigInt(completionTokens) * BigInt(outputTokenCost);

	if (totalTenths <= 0n) return 0;
	return Number((totalTenths + 9n) / 10n);
}
