import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface DockButtonProps {
  onClick: () => void;
  disabled?: boolean;
  /** Primary actions are filled, secondary ones outlined. */
  variant?: "primary" | "secondary";
  /** Drawn before the label. */
  icon?: IconDefinition;
  children: ReactNode;
}

/** A button in the instrument dock. */
export default function DockButton({ onClick, disabled = false, variant = "secondary", icon, children }: DockButtonProps) {
  const look =
    variant === "primary"
      ? "bg-[var(--sim-accent-500)] text-white border-[var(--sim-border)] enabled:hover:bg-[var(--sim-accent-600)]"
      : "bg-[var(--sim-neutral-0)] text-[var(--sim-neutral-900)] border-[var(--sim-border)] enabled:hover:border-[var(--sim-accent-700)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 border-2 px-3 py-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:bg-[var(--sim-neutral-50)] disabled:text-[var(--sim-neutral-500)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${look}`}
    >
      {icon && <FontAwesomeIcon icon={icon} fixedWidth aria-hidden />}
      {children}
    </button>
  );
}
