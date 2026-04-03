import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ApiKeyRow = {
	id: string;
	apiKey: string;
	name: string;
	credisConsumed: number;
	lastUsed: string | null;
	disabled: boolean;
};

type ApiKeysResponse = { apiKeys: ApiKeyRow[] };

type CreateApiKeyResponse = { id: number; apiKey: string };

function maskKey(key: string) {
	if (!key) return "";
	if (key.length <= 10) return `${key.slice(0, 3)}…`;
	return `${key.slice(0, 10)}…${key.slice(-6)}`;
}

function formatDate(value: string | null) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString();
}

export default function ApiKeysPage() {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [createdKey, setCreatedKey] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [createOpen, setCreateOpen] = useState(false);

	const apiKeysQuery = useQuery<ApiKeysResponse>({
		queryKey: ["api-keys"],
		queryFn: () => apiFetch<ApiKeysResponse>("/api-key/"),
	});

	const createMutation = useMutation<
		CreateApiKeyResponse,
		Error,
		{ name: string }
	>({
		mutationFn: (body) =>
			apiFetch<CreateApiKeyResponse>("/api-key/", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		onSuccess: async (data) => {
			setCreatedKey(data.apiKey);
			setMessage("API key created successfully.");
			setName("");
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	const toggleMutation = useMutation<
		{ message: string },
		Error,
		{ id: string; disabled: boolean }
	>({
		mutationFn: ({ id, disabled }) =>
			apiFetch<{ message: string }>("/api-key/disable-status", {
				method: "PUT",
				body: JSON.stringify({ id: Number(id), disabled }),
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	const deleteMutation = useMutation<
		{ message: string },
		Error,
		{ id: string }
	>({
		mutationFn: ({ id }) =>
			apiFetch<{ message: string }>(`/api-key/${id}`, {
				method: "DELETE",
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	const rows = useMemo(
		() => apiKeysQuery.data?.apiKeys ?? [],
		[apiKeysQuery.data],
	);

	useEffect(() => {
		if (!createOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setCreateOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [createOpen]);

	return (
		<DashboardShell
			title="API Keys"
			description="Create and manage your API keys for accessing models."
			actions={
				<Button
					onClick={() => {
						setMessage(null);
						setCreatedKey(null);
						setName("");
						setCreateOpen(true);
					}}
				>
					<Plus className="size-4" />
					Create key
				</Button>
			}
		>
			<div className="mt-8">
				{message ? (
					<div className="mb-4 rounded-lg border border-emerald-200/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
						{message}
					</div>
				) : null}
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
								<div className="flex items-center justify-between gap-3">
									<div className="font-mono text-xs text-muted-foreground">
										{maskKey(r.apiKey)}
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={async () => {
											await navigator.clipboard.writeText(r.apiKey);
											setMessage("Copied to clipboard.");
										}}
										aria-label="Copy key"
									>
										<Copy className="size-4" />
									</Button>
								</div>
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
									<span>{r.disabled ? "Disabled" : "Active"}</span>
								</div>
							),
						},
						{
							key: "lastUsed",
							header: "Last Used",
							cell: (r) => (
								<div className="text-sm text-muted-foreground">
									{formatDate(r.lastUsed)}
								</div>
							),
						},
						{
							key: "credits",
							header: "Credits Used",
							cell: (r) => (
								<div className="text-right tabular-nums">
									{r.credisConsumed ?? 0}
								</div>
							),
							className: "text-right",
							headerClassName: "text-right",
						},
						{
							key: "actions",
							header: "Actions",
							cell: (r) => (
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											toggleMutation.mutate({ id: r.id, disabled: !r.disabled })
										}
										disabled={toggleMutation.isPending}
									>
										{r.disabled ? "Enable" : "Disable"}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => deleteMutation.mutate({ id: r.id })}
										disabled={deleteMutation.isPending}
										aria-label="Delete key"
									>
										<Trash2 className="size-4" />
									</Button>
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
								<Skeleton className="h-6 w-44" />
							</div>
						) : (
							"No API keys"
						)
					}
				/>
			</div>

			{createOpen ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) setCreateOpen(false);
					}}
				>
					<div className="w-full max-w-lg rounded-2xl border border-border/70 bg-card/70 p-5 shadow-xl backdrop-blur">
						<div className="flex items-start justify-between gap-4">
							<div>
								<div className="text-base font-semibold">Create API key</div>
								<div className="mt-1 text-sm text-muted-foreground">
									Name your key so you can identify it later.
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCreateOpen(false)}
								aria-label="Close"
							>
								<X className="size-4" />
							</Button>
						</div>

						{createMutation.error ? (
							<div className="mt-4 rounded-lg border border-red-200/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
								{createMutation.error.message}
							</div>
						) : null}

						{createdKey ? (
							<div className="mt-4 rounded-xl border border-border/70 bg-background/30 p-4">
								<div className="text-sm font-medium">New key</div>
								<div className="mt-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2 font-mono text-xs">
									{createdKey}
								</div>
								<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
									<Button
										variant="outline"
										onClick={async () => {
											await navigator.clipboard.writeText(createdKey);
											setMessage("Copied to clipboard.");
										}}
									>
										<Copy className="size-4" />
										Copy
									</Button>
									<Button
										onClick={() => {
											setCreateOpen(false);
										}}
									>
										Done
									</Button>
								</div>
							</div>
						) : (
							<div className="mt-4 space-y-4">
								<div>
									<label className="mb-1 block text-sm text-muted-foreground">
										Name
									</label>
									<Input
										autoFocus
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. Production, Development, My App"
									/>
								</div>
								<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
									<Button
										variant="outline"
										onClick={() => setCreateOpen(false)}
										disabled={createMutation.isPending}
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											setMessage(null);
											setCreatedKey(null);
											createMutation.mutate({ name: name.trim() || "default" });
										}}
										disabled={createMutation.isPending}
									>
										<Plus className="size-4" />
										{createMutation.isPending ? "Creating..." : "Create key"}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			) : null}
		</DashboardShell>
	);
}
