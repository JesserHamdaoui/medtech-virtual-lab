"use client";

import { labSimRegistry } from "./registry";

interface LabSimulationProps {
  labId: string;
}

export default function LabSimulation({ labId }: LabSimulationProps) {
  const SimComponent = labSimRegistry[labId];

  if (!SimComponent) {
    return (
      <div className="p-8 text-center text-gray-500">
        Simulation not available for this lab.
      </div>
    );
  }

  return <SimComponent />;
}
