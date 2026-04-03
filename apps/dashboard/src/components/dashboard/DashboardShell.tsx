import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardShell({
	title,
	description,
	actions,
	children,
}: {
	title: string;
	description?: string;
	actions?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="px-4 py-6 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					{description ? (
						<p className="mt-1 text-sm text-muted-foreground">{description}</p>
					) : null}
				</div>
				{actions ? <div className={cn("flex items-center gap-2")}>{actions}</div> : null}
			</div>
			<div className="mt-6">{children}</div>
		</div>
	);
}
