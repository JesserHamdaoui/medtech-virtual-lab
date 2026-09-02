"use client";

import { useRef, useState } from "react";

interface StepperProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export default function Stepper({ label, min, max, step, value, onChange }: StepperProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHolding = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimeoutRef.current = null;
    holdIntervalRef.current = null;
  };

  const applyDelta = (delta: number) => {
    const newValue = roundToPrecision(value + delta, 3);
    if (newValue >= min && newValue <= max) {
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  const startHolding = (delta: number) => {
    applyDelta(delta);
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => applyDelta(delta), 100);
    }, 500);
  };

  const handleInputChange = (raw: string) => {
    setInputValue(raw);
    const trimmed = raw.trim();
    if (trimmed === "") return;
    const parsed = parseFloat(trimmed);
    if (!isNaN(parsed)) {
      onChange(roundToPrecision(parsed, 3));
    }
  };

  const enforceBounds = () => {
    let parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      setInputValue(value.toString());
      return;
    }
    if (parsed < min) parsed = min;
    if (parsed > max) parsed = max;
    const rounded = roundToPrecision(parsed, 3);
    setInputValue(rounded.toString());
    onChange(rounded);
  };

  const stepperButtonClass =
    "w-8 h-8 bg-[var(--sim-accent-500)] text-white text-lg font-bold border-2 border-[var(--sim-accent-900)] shadow-[var(--sim-shadow-raised-accent)] hover:bg-[var(--sim-accent-400)] active:bg-[var(--sim-accent-600)] active:shadow-[var(--sim-shadow-pressed-accent)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 flex items-center justify-center leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-1 cursor-pointer";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold tracking-widest text-[var(--sim-label)] uppercase">
        {label}
      </span>
      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          className={stepperButtonClass}
          onMouseDown={() => startHolding(-step)}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
        >
          −
        </button>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          className="w-16 h-8 text-center border-2 border-[var(--sim-border-subtle)] px-1 text-sm font-mono font-bold transition-colors duration-100 hover:border-[var(--sim-accent-500)] focus:outline-none focus:border-[var(--sim-accent-500)] focus:ring-2 focus:ring-[var(--sim-accent-tint-40)]"
          value={inputValue}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={enforceBounds}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <button
          type="button"
          className={stepperButtonClass}
          onMouseDown={() => startHolding(step)}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
        >
          +
        </button>
      </div>
    </div>
  );
}
