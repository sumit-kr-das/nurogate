import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { Topbar } from "@/components/dashboard/Topbar";
import { getAuthToken } from "@/lib/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AppLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		const theme = localStorage.getItem("theme");
		if (theme === "light") document.documentElement.classList.remove("dark");
		else document.documentElement.classList.add("dark");

		const token = getAuthToken();
		if (!token) {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-64 left-1/3 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-3xl" />
				<div className="absolute -bottom-72 right-0 h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_60%)] blur-3xl" />
			</div>

			<div className="relative flex">
				<SidebarNav />
				<div className="min-w-0 flex-1">
					<Topbar />
					<main className="mx-auto w-full max-w-7xl">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}
