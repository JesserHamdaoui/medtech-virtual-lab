export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] ${className}`}
      {...props}
    />
  );
}

export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-4 py-1 space-y-3 ${className}`} {...props} />;
}
