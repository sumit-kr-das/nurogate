import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearAuthToken, decodeJwt, getAuthToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { LogOut, Search } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
	const navigate = useNavigate();

	const token = typeof window !== "undefined" ? getAuthToken() : null;
	const email = useMemo(() => {
		if (!token) return null;
		return decodeJwt(token)?.email ?? null;
	}, [token]);

	return (
		<header className="sticky top-0 z-30 border-b border-border/60 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30">
			<div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
				<div className="relative hidden w-full max-w-md lg:block">
					<Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
					<Input className="pl-9" placeholder="Search…" />
				</div>

				<div className="ml-auto flex items-center gap-2">
					<div className="hidden text-sm text-muted-foreground sm:block">
						{email ?? "Signed in"}
					</div>
					<ThemeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={async () => {
							await apiFetch<{ message: string }>("/auth/sign-out", {
								method: "POST",
							}).catch(() => null);
							clearAuthToken();
							navigate("/login", { replace: true });
						}}
						aria-label="Log out"
					>
						<LogOut className="size-4" />
					</Button>
				</div>
			</div>
		</header>
	);
}
