import { ReactNode, CSSProperties } from "react";

interface ButtonProps {
  handleClick: () => void;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
  disabled?: boolean;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "w-11 h-11 text-lg",
  md: "w-16 h-16 text-xl",
  lg: "w-[4.5rem] h-[4.5rem] text-3xl",
};

export default function Button({
  handleClick,
  children,
  className = "",
  size = "sm",
  style,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      style={style}
      disabled={disabled}
      className={`${sizeClasses[size]} bg-[var(--sim-accent-500)] text-white font-semibold border-2 border-[var(--sim-accent-900)] shadow-[var(--sim-shadow-raised-accent)] hover:bg-[var(--sim-accent-400)] active:bg-[var(--sim-accent-600)] active:shadow-[var(--sim-shadow-pressed-accent)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2 disabled:bg-[var(--sim-neutral-200)] disabled:text-[var(--sim-neutral-500)] disabled:border-[var(--sim-neutral-300)] disabled:shadow-none disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:cursor-not-allowed mr-3 cursor-pointer flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
