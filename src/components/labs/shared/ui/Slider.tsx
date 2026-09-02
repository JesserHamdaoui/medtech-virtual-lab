"use client";

import React, { useState, useEffect } from "react";

export interface SliderProps {
  min: number;
  max: number;
  minIndicator: string;
  maxIndicator: string;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  minIndicator,
  maxIndicator,
  step,
  initialValue,
  onChange,
  label,
}) => {
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-bold tracking-widest text-[var(--sim-label)] uppercase">
          {label}
        </span>
      )}
      <div className="flex flex-row justify-center items-center space-x-2">
        <span className="text-xs text-[var(--sim-neutral-600)] font-mono font-semibold">
          {minIndicator}
        </span>
        <input
          type="range"
          className="sim-slider w-full h-2 bg-[var(--sim-neutral-200)] border-2 border-[var(--sim-border-subtle)] appearance-none cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <span className="text-xs text-[var(--sim-neutral-600)] font-mono font-semibold">
          {maxIndicator}
        </span>
        <style>{`
          .sim-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 28px;
            background: var(--sim-accent-500);
            border: 2px solid var(--sim-accent-900);
            box-shadow: var(--sim-shadow-raised-accent);
            cursor: pointer;
            transition: background-color 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;
          }
          .sim-slider:hover::-webkit-slider-thumb {
            background: var(--sim-accent-400);
          }
          .sim-slider:active::-webkit-slider-thumb {
            background: var(--sim-accent-600);
            box-shadow: var(--sim-shadow-pressed-accent);
            transform: translate(2px, 2px);
          }
          .sim-slider:focus-visible::-webkit-slider-thumb {
            outline: 2px solid var(--sim-accent-700);
            outline-offset: 2px;
          }
          .sim-slider::-moz-range-thumb {
            width: 20px;
            height: 28px;
            background: var(--sim-accent-500);
            border: 2px solid var(--sim-accent-900);
            box-shadow: var(--sim-shadow-raised-accent);
            cursor: pointer;
            transition: background-color 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;
          }
          .sim-slider:hover::-moz-range-thumb {
            background: var(--sim-accent-400);
          }
          .sim-slider:active::-moz-range-thumb {
            background: var(--sim-accent-600);
            box-shadow: var(--sim-shadow-pressed-accent);
            transform: translate(2px, 2px);
          }
          .sim-slider:focus-visible::-moz-range-thumb {
            outline: 2px solid var(--sim-accent-700);
            outline-offset: 2px;
          }
          .sim-slider:focus {
            outline: none;
          }
          .sim-slider::-moz-focus-outer {
            border: 0;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Slider;
