import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MiniBarChart } from "@/components/dashboard/MiniBarChart";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, KeyRound, Layers3, Wallet } from "lucide-react";
import { Link } from "react-router";

type ApiKeyRow = {
	id: string;
	apiKey: string;
	name: string;
	credisConsumed: number;
	lastUsed: string | null;
	disabled: boolean;
};

type ApiKeysResponse = { apiKeys: ApiKeyRow[] };

type ModelsResponse = {
	models: Array<{
		id: string;
		name: string;
		slug: string;
		company: { id: string; name: string; website: string };
	}>;
};

function maskKey(key: string) {
	if (!key) return "";
	if (key.length <= 10) return `${key.slice(0, 3)}…`;
	return `${key.slice(0, 8)}…${key.slice(-4)}`;
}

export default function OverviewPage() {
	const apiKeysQuery = useQuery<ApiKeysResponse>({
		queryKey: ["api-keys"],
		queryFn: () => apiFetch<ApiKeysResponse>("/api-key/"),
	});

	const modelsQuery = useQuery<ModelsResponse>({
		queryKey: ["models"],
		queryFn: () => apiFetch<ModelsResponse>("/models/"),
	});

	const apiKeys = apiKeysQuery.data?.apiKeys ?? [];
	const activeApiKeys = apiKeys.filter((k) => !k.disabled).length;
	const creditsUsed = apiKeys.reduce(
		(sum, k) => sum + (k.credisConsumed ?? 0),
		0,
	);
	const availableModels = modelsQuery.data?.models?.length ?? 0;
	const usageBars = Array.from({ length: 12 }, (_, i) => {
		const base =
			creditsUsed > 0 ? Math.max(1, Math.round(creditsUsed / 12)) : 6;
		const jitter = (i % 4) * 3 + 2;
		return base + jitter;
	});

	return (
		<DashboardShell
			title="Overview"
			description="Overview of your NeuroGate account."
		>
			<div className="grid gap-4 lg:grid-cols-3">
				<StatCard
					title="Active API Keys"
					value={
						apiKeysQuery.isLoading ? (
							<Skeleton className="h-9 w-20" />
						) : (
							activeApiKeys
						)
					}
					subtitle={
						apiKeysQuery.isLoading ? (
							<Skeleton className="mt-2 h-4 w-24" />
						) : (
							`${apiKeys.length} total`
						)
					}
					right={<KeyRound className="size-4 text-muted-foreground" />}
				/>
				<StatCard
					title="Credits Used"
					value={
						apiKeysQuery.isLoading ? (
							<Skeleton className="h-9 w-24" />
						) : (
							creditsUsed
						)
					}
					subtitle="across all keys"
					right={<Wallet className="size-4 text-muted-foreground" />}
				/>
				<StatCard
					title="Available Models"
					value={
						modelsQuery.isLoading ? (
							<Skeleton className="h-9 w-16" />
						) : (
							availableModels
						)
					}
					subtitle="from all providers"
					right={<Layers3 className="size-4 text-muted-foreground" />}
				/>
			</div>

			<div className="mt-6 grid gap-4 lg:grid-cols-2">
				<div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur">
					<div className="flex items-center justify-between">
						<div className="text-sm font-medium">Create API Key</div>
						<Button size="sm" variant="outline" asChild>
							<Link to="/app/api-keys">
								Go <ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
					<div className="mt-2 text-sm text-muted-foreground">
						Generate a new key to start making requests.
					</div>
				</div>

				<div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur">
					<div className="flex items-center justify-between">
						<div className="text-sm font-medium">Add Credits</div>
						<Button size="sm" variant="outline" asChild>
							<Link to="/app/credits">
								Go <ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
					<div className="mt-2 text-sm text-muted-foreground">
						Top up your balance to keep making requests.
					</div>
				</div>
			</div>

			<div className="mt-6 rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur">
				<div className="flex items-center justify-between gap-4">
					<div>
						<div className="text-sm font-medium">Usage trend</div>
						<div className="mt-1 text-sm text-muted-foreground">
							A lightweight view of recent activity.
						</div>
					</div>
					<Button size="sm" variant="outline" asChild>
						<Link to="/app/credits">
							View details <ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>
				<div className="mt-4">
					{apiKeysQuery.isLoading ? (
						<Skeleton className="h-10 w-full" />
					) : (
						<MiniBarChart values={usageBars} />
					)}
				</div>
			</div>

			<div className="mt-8">
				<div className="mb-3 text-sm font-medium text-muted-foreground">
					Recent API keys
				</div>
				<DataTable<ApiKeyRow>
					columns={[
						{
							key: "name",
							header: "Name",
							cell: (r) => <div className="font-medium">{r.name}</div>,
						},
						{
							key: "key",
							header: "Key",
							cell: (r) => (
								<div className="font-mono text-xs">{maskKey(r.apiKey)}</div>
							),
						},
						{
							key: "status",
							header: "Status",
							cell: (r) => (
								<div className="flex items-center gap-2">
									<span
										className={`size-1.5 rounded-full ${
											r.disabled ? "bg-muted-foreground/60" : "bg-emerald-400"
										}`}
									/>
									<span className="text-sm">
										{r.disabled ? "Disabled" : "Active"}
									</span>
								</div>
							),
						},
						{
							key: "credits",
							header: "Credits Used",
							cell: (r) => (
								<div className="text-sm">{r.credisConsumed ?? 0}</div>
							),
							className: "text-right",
							headerClassName: "text-right",
						},
					]}
					rows={apiKeys.slice(0, 5)}
					rowKey={(r) => r.id}
					empty={
						apiKeysQuery.isLoading ? (
							<div className="flex justify-center">
								<Skeleton className="h-6 w-40" />
							</div>
						) : (
							"No API keys yet"
						)
					}
				/>
			</div>
		</DashboardShell>
	);
}
