"use client";

interface LabLoadingIndicatorProps {
  progress: number;
  label?: string;
}

export default function LabLoadingIndicator({
  progress,
  label = "Loading Lab",
}: LabLoadingIndicatorProps) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="h-150 w-full flex items-center justify-center bg-linear-to-b from-primary-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500 animate-spin"
            aria-hidden
          />
          <div className="absolute inset-2 rounded-full bg-white shadow-sm flex items-center justify-center">
            <span className="text-sm font-bold text-primary-700">
              {clampedProgress}%
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-primary-700">{label}</p>
          <p className="text-sm text-gray-500">MedTech Virtual Lab</p>
        </div>
      </div>
    </div>
  );
}
