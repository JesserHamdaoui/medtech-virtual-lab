"use client";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-xs font-bold tracking-widest text-[var(--sim-label)] uppercase">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 border-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2 cursor-pointer ${
          checked
            ? "bg-[var(--sim-accent-500)] border-[var(--sim-accent-900)]"
            : "bg-[var(--sim-neutral-100)] border-[var(--sim-neutral-900)] hover:bg-[var(--sim-neutral-200)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 border-2 transition-transform duration-150 ease-out ${
            checked
              ? "bg-white border-[var(--sim-accent-900)] translate-x-5"
              : "bg-white border-[var(--sim-neutral-900)] translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
