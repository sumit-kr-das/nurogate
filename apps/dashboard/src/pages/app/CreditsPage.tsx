import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Plus, Sparkles, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

type ApiKeyRow = {
	id: string;
	apiKey: string;
	name: string;
	credisConsumed: number;
	lastUsed: string | null;
	disabled: boolean;
};

type ApiKeysResponse = { apiKeys: ApiKeyRow[] };

type OnrampResponse = { message: "Onramp successful"; credits: number };
type BalanceResponse = { credits: number };

export default function CreditsPage() {
	const queryClient = useQueryClient();
	const [success, setSuccess] = useState<string | null>(null);

	const balanceQuery = useQuery<BalanceResponse>({
		queryKey: ["balance"],
		queryFn: () => apiFetch<BalanceResponse>("/payments/balance"),
	});

	const apiKeysQuery = useQuery<ApiKeysResponse>({
		queryKey: ["api-keys"],
		queryFn: () => apiFetch<ApiKeysResponse>("/api-key/"),
	});

	const rows = useMemo(
		() => apiKeysQuery.data?.apiKeys ?? [],
		[apiKeysQuery.data],
	);
	const totalCreditsUsed = rows.reduce(
		(sum, k) => sum + (k.credisConsumed ?? 0),
		0,
	);

	const onrampMutation = useMutation<OnrampResponse, Error, void>({
		mutationFn: () =>
			apiFetch<OnrampResponse>("/payments/onramp", {
				method: "POST",
			}),
		onSuccess: async (data) => {
			queryClient.setQueryData<BalanceResponse>(["balance"], {
				credits: data.credits,
			});
			setSuccess("Credits added successfully.");
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	return (
		<DashboardShell
			title="Credits"
			description="Manage your account balance and add credits."
		>
			<div className="grid gap-4 lg:grid-cols-12">
				<div className="lg:col-span-12">
					<div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur">
						<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)]" />
						<div className="relative flex items-start justify-between gap-4">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/20 px-3 py-1 text-xs text-muted-foreground">
									<Sparkles className="size-3.5 text-primary" />
									Current Balance
								</div>
								<div className="mt-3 text-3xl font-semibold tracking-tight">
							{balanceQuery.isLoading ? (
								<Skeleton className="h-9 w-44" />
							) : balanceQuery.error ? (
								"—"
							) : (
								`${(balanceQuery.data?.credits ?? 0).toLocaleString()} credits`
							)}
								</div>
								<div className="mt-1 text-sm text-muted-foreground">
									Balance updates after top-ups.
								</div>
							</div>
							<div className="rounded-xl border border-border/70 bg-background/20 p-3 text-muted-foreground">
								<Wallet className="size-5" />
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-6">
					<StatCard
						title="Total Credits Used"
						value={
							apiKeysQuery.isLoading ? (
								<Skeleton className="h-9 w-24" />
							) : (
								totalCreditsUsed
							)
						}
						subtitle={
							apiKeysQuery.isLoading ? (
								<Skeleton className="mt-2 h-4 w-36" />
							) : (
								`across ${rows.length} API key${rows.length === 1 ? "" : "s"}`
							)
						}
						right={<CreditCard className="size-4 text-muted-foreground" />}
					/>
				</div>

				<div className="lg:col-span-6">
					<div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur">
						<div className="flex items-start justify-between gap-4">
							<div>
								<div className="text-sm font-medium">Per-key Breakdown</div>
								<div className="mt-1 text-sm text-muted-foreground">
									See usage by key name.
								</div>
							</div>
							<div className="rounded-xl border border-border/70 bg-background/20 p-2 text-muted-foreground">
								<CreditCard className="size-4" />
							</div>
						</div>
						<div className="mt-4">
							<DataTable<ApiKeyRow>
								columns={[
									{
										key: "name",
										header: "Key",
										cell: (r) => <div className="font-medium">{r.name}</div>,
									},
									{
										key: "usage",
										header: "Credits Used",
										cell: (r) => (
											<div className="text-right tabular-nums">
												{r.credisConsumed ?? 0}
											</div>
										),
										className: "text-right",
										headerClassName: "text-right",
									},
								]}
								rows={rows}
								rowKey={(r) => r.id}
								empty={
									apiKeysQuery.isLoading ? (
										<div className="flex justify-center">
											<Skeleton className="h-6 w-40" />
										</div>
									) : (
										"No keys yet"
									)
								}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-sm font-medium">Add Credits</div>
						<div className="mt-1 text-sm text-muted-foreground">
							Top up your account with 1,000 credits per transaction.
						</div>
					</div>
					<Button
						onClick={() => {
							setSuccess(null);
							onrampMutation.mutate();
						}}
						disabled={onrampMutation.isPending}
					>
						<Plus className="size-4" />
						{onrampMutation.isPending ? "Adding..." : "Add credits"}
					</Button>
				</div>

				{onrampMutation.error ? (
					<div className="mt-4 rounded-lg border border-red-200/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
						{onrampMutation.error.message}
					</div>
				) : null}

				{success ? (
					<div className="mt-4 rounded-lg border border-emerald-200/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
						{success}
					</div>
				) : null}
			</div>
		</DashboardShell>
	);
}
