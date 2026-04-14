import { ReactNode } from "react";

interface ButtonProps {
  handleClick: () => void;
  children: ReactNode;
  style: React.CSSProperties;
  className?: string;
  rounded?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Button({
  handleClick,
  children,
  style,
  className = "",
  rounded = false,
  size = "sm",
}: ButtonProps) {
  return (
    <button
      style={style}
      onClick={handleClick}
      className={`${
        size == "sm"
          ? "w-10 h-10 text-base"
          : size == "md"
          ? "w-16 h-16 text-lg"
          : "w-28 h-28 text-4xl"
      } bg-[#2596be] text-white hover:bg-[#2187ab] ${
        rounded ? "rounded-full" : "rounded-md"
      } shadow transition-all duration-200 focus:outline-none active:scale-95 mr-3 ${className}`}
    >
      {children}
    </button>
  );
}
