"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { Card } from "../shared/ui/Card";
import { ReagentInfo } from "./types";

interface ReagentBottleProps {
  reagent: ReagentInfo;
  disabled?: boolean;
}

export default function ReagentBottle({ reagent, disabled }: ReagentBottleProps) {
  return (
    <Card
      draggable={!disabled}
      // Read on dragstart to tell the 3D bench what is being held, so the
      // vessel that can take it outlines itself.
      data-reagent={reagent.id}
      onDragStart={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("application/x-reagent", reagent.id);
        e.dataTransfer.effectAllowed = "copy";
      }}
      style={{ backgroundColor: `${reagent.color}14`, opacity: disabled ? 0.45 : 1 }}
      className={`flex items-center gap-3 px-3 py-2.5 select-none ${
        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <FontAwesomeIcon
        icon={faEyeDropper}
        style={{ color: reagent.color }}
        className="w-6 h-6 shrink-0"
      />
      <span className="text-xs font-semibold leading-tight text-[var(--sim-neutral-600)]">
        {reagent.label}
      </span>
    </Card>
  );
}
