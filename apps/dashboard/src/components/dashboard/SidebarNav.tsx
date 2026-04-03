import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCard, KeyRound, LayoutDashboard, User } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
	{
		label: "Dashboard",
		to: "/app",
		icon: LayoutDashboard,
	},
	{
		label: "API Keys",
		to: "/app/api-keys",
		icon: KeyRound,
	},
	{
		label: "Credits",
		to: "/app/credits",
		icon: CreditCard,
	},
	{
		label: "Account",
		to: "/app/account",
		icon: User,
	},
] as const;

export function SidebarNav() {
	const location = useLocation();

	return (
		<aside className="hidden h-screen w-64 flex-col border-r border-border/60 bg-background/40 backdrop-blur lg:flex">
			<div className="px-5 py-5">
				<div className="text-sm font-semibold tracking-wide">NeuroGate</div>
				<div className="mt-1 text-xs text-muted-foreground">
					Control plane
				</div>
			</div>
			<nav className="px-3">
				{navItems.map((item) => {
					const active =
						location.pathname === item.to ||
						(item.to !== "/app" && location.pathname.startsWith(item.to));
					const Icon = item.icon;
					return (
						<Button
							key={item.to}
							variant="ghost"
							className={cn(
								"mb-1 w-full justify-start gap-2",
								active && "bg-accent text-accent-foreground",
							)}
							asChild
						>
							<Link to={item.to}>
								<Icon className="size-4" />
								{item.label}
							</Link>
						</Button>
					);
				})}
			</nav>
			<div className="mt-auto px-5 py-5 text-xs text-muted-foreground">
				<span>© {new Date().getFullYear()} NeuroGate</span>
			</div>
		</aside>
	);
}
