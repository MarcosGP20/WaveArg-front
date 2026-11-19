interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string | number;
  changeType?: "increase" | "decrease";
}

export default function MetricCard({
  title,
  value,
  icon,
  change,
  changeType,
}: MetricCardProps) {
  return (
    <div className="rounded-panel bg-superficie p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-white text-color-principal">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-tinta-suave">{title}</h3>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-tinta">{value}</p>
      {change !== undefined && (
        <span
          className={`mt-2 block text-sm font-medium ${
            changeType === "increase" ? "text-exito" : "text-destructive"
          }`}
        >
          {changeType === "increase" ? "↑" : "↓"} {change}%
        </span>
      )}
    </div>
  );
}
