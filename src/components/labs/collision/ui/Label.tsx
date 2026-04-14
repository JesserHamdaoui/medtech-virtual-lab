export function Label({
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`inline pr-2 pl-1 z-100 text-xs font-medium text-blue-900 ${className}`}
      {...props}
    />
  );
}
