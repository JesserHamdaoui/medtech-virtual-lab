import { HTMLAttributes } from "react";

export function LabCard({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-primary-200 shadow-lg rounded-lg ${className}`}
      {...props}
    />
  );
}

export function LabCardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-4 py-1 space-y-3 ${className}`} {...props} />;
}
