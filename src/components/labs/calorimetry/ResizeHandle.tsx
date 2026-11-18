"use client";

import { KeyboardEvent, PointerEvent, useRef } from "react";

/** How far an arrow key moves the edge, px. */
const KEY_STEP = 16;

interface ResizeHandleProps {
  /** The size being changed, px. */
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Which way dragging should grow the size: 1 when the panel is left of the handle, -1 when it is right of it. */
  direction: 1 | -1;
  label: string;
}

/**
 * A thin vertical grip on the edge of a panel. Dragging it, or pressing the
 * arrow keys while it has focus, changes the panel's size within its limits.
 */
export default function ResizeHandle({ value, min, max, onChange, direction, label }: ResizeHandleProps) {
  const drag = useRef<{ x: number; start: number } | null>(null);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, start: value };
  };
  const onPointerMove = (e: PointerEvent) => {
    if (drag.current) onChange(clamp(drag.current.start + direction * (e.clientX - drag.current.x)));
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!drag.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    drag.current = null;
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const towardsRight = e.key === "ArrowRight" ? 1 : -1;
    onChange(clamp(value + direction * towardsRight * KEY_STEP));
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ touchAction: "none" }}
      className="absolute inset-y-0 -left-1.5 z-10 flex w-3 cursor-col-resize items-center justify-center hover:bg-[var(--sim-accent-tint-40)] focus:outline-none focus-visible:bg-[var(--sim-accent-tint-40)]"
    >
      <span aria-hidden className="h-8 w-1 bg-[var(--sim-neutral-300)]" />
    </div>
  );
}
