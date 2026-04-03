export function MiniBarChart({
	values,
	className,
}: {
	values: number[];
	className?: string;
}) {
	const max = Math.max(1, ...values);
	return (
		<div className={`grid grid-cols-12 items-end gap-1 ${className ?? ""}`}>
			{values.slice(0, 12).map((v, i) => {
				const h = Math.max(2, Math.round((v / max) * 40));
				return (
					<div
						key={i}
						className="h-10 rounded bg-primary/20"
						style={{
							height: `${h}px`,
							backgroundColor: "rgba(99, 102, 241, 0.35)",
						}}
					/>
				);
			})}
		</div>
	);
}
