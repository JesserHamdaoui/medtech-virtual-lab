import { useId } from "react";

interface NumberFieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown under the field when the value isn't allowed. */
  error?: string;
}

/** A labelled number input with its unit and an error line. */
export default function NumberField({ label, unit, value, onChange, error }: NumberFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={id} className="text-xs font-semibold text-[var(--sim-neutral-900)]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`w-24 border-2 bg-[var(--sim-neutral-0)] px-2 py-1 font-mono text-sm tabular-nums text-[var(--sim-neutral-900)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${
            error ? "border-red-600" : "border-[var(--sim-border)]"
          }`}
        />
        <span className="text-xs font-semibold text-[var(--sim-neutral-600)]">{unit}</span>
      </div>
      {error && <span className="text-[11px] text-red-700">{error}</span>}
    </div>
  );
}
