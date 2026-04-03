import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Column<Row> = {
	key: string;
	header: ReactNode;
	cell: (row: Row) => ReactNode;
	className?: string;
	headerClassName?: string;
};

export function DataTable<Row>({
	columns,
	rows,
	rowKey,
	empty,
}: {
	columns: Column<Row>[];
	rows: Row[];
	rowKey: (row: Row) => string;
	empty?: ReactNode;
}) {
	return (
		<div className="overflow-hidden rounded-xl border border-border/70 bg-card/40 backdrop-blur">
			<div className="w-full overflow-auto">
				<table className="min-w-full text-sm">
					<thead className="border-b border-border/60 bg-background/20">
						<tr>
							{columns.map((c) => (
								<th
									key={c.key}
									className={cn(
										"px-4 py-3 text-left font-medium text-muted-foreground",
										c.headerClassName,
									)}
								>
									{c.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-10 text-center text-muted-foreground"
								>
									{empty ?? "No data"}
								</td>
							</tr>
						) : (
							rows.map((row) => (
								<tr
									key={rowKey(row)}
									className="border-b border-border/60 last:border-b-0 hover:bg-background/20"
								>
									{columns.map((c) => (
										<td
											key={c.key}
											className={cn("px-4 py-3 align-middle", c.className)}
										>
											{c.cell(row)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
