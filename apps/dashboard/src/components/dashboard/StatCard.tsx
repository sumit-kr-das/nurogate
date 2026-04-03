import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

export function StatCard({
	title,
	value,
	subtitle,
	icon,
	right,
}: {
	title: string;
	value: ReactNode;
	subtitle?: ReactNode;
	icon?: ReactNode;
	right?: ReactNode;
}) {
	return (
		<Card className="bg-card/40 backdrop-blur">
			<CardHeader className="flex-row items-start justify-between gap-4">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				{right ?? icon}
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-semibold tracking-tight">{value}</div>
				{subtitle ? (
					<div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
				) : null}
			</CardContent>
		</Card>
	);
}
