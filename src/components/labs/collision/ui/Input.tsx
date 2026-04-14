export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
      {...props}
      step={0.01}
    />
  );
}
