import React from "react";
import { KEYBOARD_CONTROLS } from "./index";

interface ControlsDisplayProps {
  wheels?: number; // Number of wheels to display (default: 4)
  buttons?: number; // Number of buttons to display (default: 5)
}

/**
 * Display keyboard control mappings in the top-right corner
 * Shows w1-w4 wheels and b1-b5 buttons with their key mappings
 */
export function ControlsDisplay({
  wheels = 4,
  buttons = 5,
}: ControlsDisplayProps) {
  const wheelEntries = Array.from({ length: wheels }, (_, i) => i + 1);
  const buttonEntries = Array.from({ length: buttons }, (_, i) => i + 1);

  const getWheelKeys = (wheelNum: number) => {
    const increaseKey =
      KEYBOARD_CONTROLS[
        `w${wheelNum}Increase` as keyof typeof KEYBOARD_CONTROLS
      ].toUpperCase();
    const decreaseKey =
      KEYBOARD_CONTROLS[
        `w${wheelNum}Decrease` as keyof typeof KEYBOARD_CONTROLS
      ].toUpperCase();
    return { increaseKey, decreaseKey };
  };

  const getButtonKey = (buttonNum: number) => {
    return KEYBOARD_CONTROLS[
      `b${buttonNum}` as keyof typeof KEYBOARD_CONTROLS
    ].toUpperCase();
  };

  return (
    <div className="absolute top-4 right-4 z-30 bg-black/70 text-white rounded-lg p-3 text-xs font-mono">
      <div className="space-y-1">
        {wheelEntries.map((wheelNum) => {
          const { increaseKey, decreaseKey } = getWheelKeys(wheelNum);
          return (
            <div key={`w${wheelNum}`} className="flex justify-between gap-4">
              <span>w{wheelNum}:</span>
              <span>
                {increaseKey}/{decreaseKey}
              </span>
            </div>
          );
        })}
        {buttonEntries.map((buttonNum) => {
          const key = getButtonKey(buttonNum);
          return (
            <div key={`b${buttonNum}`} className="flex justify-between gap-4">
              <span>b{buttonNum}:</span>
              <span>{key}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
