import { CSSProperties, ReactNode } from "react";

interface LabButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rounded?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LabButton({
  onClick,
  children,
  className = "",
  style,
  rounded = false,
  size = "sm",
}: LabButtonProps) {
  const sizeClass =
    size === "sm"
      ? "w-10 h-10 text-base"
      : size === "md"
        ? "w-16 h-16 text-lg"
        : "w-28 h-28 text-4xl";

  return (
    <button
      style={style}
      onClick={onClick}
      className={`${sizeClass} bg-primary-600 text-white hover:bg-primary-700 ${
        rounded ? "rounded-full" : "rounded-md"
      } shadow transition-all duration-200 focus:outline-none active:scale-95 mr-3 ${className}`}
    >
      {children}
    </button>
  );
}
