import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { decodeJwt, getAuthToken } from "@/lib/auth";
import { Github, Shield, User } from "lucide-react";
import { useMemo } from "react";

export default function AccountPage() {
	const token = typeof window !== "undefined" ? getAuthToken() : null;
	const payload = useMemo(() => (token ? decodeJwt(token) : null), [token]);
	const email = payload?.email ?? "—";

	return (
		<DashboardShell title="Account" description="Manage your account info.">
			<Card className="overflow-hidden bg-card/40 backdrop-blur">
				<div className="grid gap-0 lg:grid-cols-12">
					<div className="border-b border-border/60 bg-background/20 p-4 lg:col-span-3 lg:border-b-0 lg:border-r">
						<div className="text-sm font-medium">Account</div>
						<div className="mt-3 space-y-1">
							<div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm">
								<User className="size-4" />
								Profile
							</div>
							<div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground">
								<Shield className="size-4" />
								Security
							</div>
						</div>
					</div>

					<div className="p-4 lg:col-span-9">
						<div className="text-sm font-medium">Profile details</div>
						<div className="mt-4 divide-y divide-border/60 rounded-lg border border-border/70 bg-background/20">
							<div className="flex items-center justify-between gap-4 px-4 py-4">
								<div className="text-sm">
									<div className="text-muted-foreground">Profile</div>
									<div className="mt-1 font-medium">{email}</div>
								</div>
								<Button variant="outline" disabled>
									Update profile
								</Button>
							</div>

							<div className="flex items-center justify-between gap-4 px-4 py-4">
								<div className="text-sm">
									<div className="text-muted-foreground">Email addresses</div>
									<div className="mt-1 font-medium">{email}</div>
								</div>
								<Button variant="ghost" disabled>
									Add email address
								</Button>
							</div>

							<div className="flex items-center justify-between gap-4 px-4 py-4">
								<div className="text-sm">
									<div className="text-muted-foreground">Connected accounts</div>
									<div className="mt-1 flex items-center gap-2 font-medium">
										<Github className="size-4" />
										GitHub
									</div>
								</div>
								<Button variant="ghost" disabled>
									Connect account
								</Button>
							</div>

							<div className="flex items-center justify-between gap-4 px-4 py-4">
								<div className="text-sm">
									<div className="text-muted-foreground">Web3 wallets</div>
									<div className="mt-1 text-muted-foreground">Not connected</div>
								</div>
								<Button variant="ghost" disabled>
									Connect wallet
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</DashboardShell>
	);
}

