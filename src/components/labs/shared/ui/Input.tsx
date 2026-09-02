export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full h-9 border-2 border-[var(--sim-border-subtle)] px-2 font-mono font-medium transition-colors duration-100 hover:border-[var(--sim-accent-500)] focus:outline-none focus:border-[var(--sim-accent-500)] focus:ring-2 focus:ring-[var(--sim-accent-tint-40)] disabled:bg-[var(--sim-neutral-50)] disabled:text-[var(--sim-neutral-300)] disabled:cursor-not-allowed disabled:border-[var(--sim-neutral-100)] ${className}`}
      {...props}
      step={0.01}
    />
  );
}
