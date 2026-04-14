import React from "react";
import clsx from "clsx";

interface IconButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export default function IconButton({
  onClick,
  size = "md",
  variant = "secondary",
  children,
}: IconButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center rounded-full shadow transition-all duration-200 focus:outline-none active:scale-95",
        sizeClasses[size],
        variantClasses[variant]
      )}
    >
      {children}
    </button>
  );
}
