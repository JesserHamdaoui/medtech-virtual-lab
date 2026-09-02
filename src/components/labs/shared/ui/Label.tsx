export function Label({
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`inline pr-2 pl-1 text-xs font-bold tracking-widest text-[var(--sim-label)] uppercase ${className}`}
      {...props}
    />
  );
}
