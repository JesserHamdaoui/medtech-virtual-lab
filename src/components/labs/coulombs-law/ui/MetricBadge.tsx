import React from "react";

interface MetricBadgeProps {
  value: string | number;
  unit: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ value, unit }) => (
  <span className="inline-flex items-center border-2 border-[#2596be] text-[#2596be] rounded-lg px-2 font-mono text-base font-medium gap-2 ml-2">
    <span>{value}</span>
    <span>{unit}</span>
  </span>
);

export default MetricBadge;
