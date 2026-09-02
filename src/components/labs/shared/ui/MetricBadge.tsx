interface MetricBadgeProps {
  value: string | number;
  unit: string;
}

export default function MetricBadge({ value, unit }: MetricBadgeProps) {
  return (
    <span className="inline-flex items-center bg-[var(--sim-neutral-900)] text-white px-2.5 py-1 font-mono text-base font-bold gap-1.5 ml-2">
      <span>{value}</span>
      <span className="text-[var(--sim-accent-300)] font-semibold">{unit}</span>
    </span>
  );
}
