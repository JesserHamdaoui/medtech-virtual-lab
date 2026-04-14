import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Keyboard control mappings
 * Wheels: W1-W4 (E/D, Q/A, W/S, R/F)
 * Buttons: B1-B5 (1, 2, 3, 4, Z)
 */
export const KEYBOARD_CONTROLS = {
  // Wheels
  w1Increase: "e",
  w1Decrease: "d",
  w2Increase: "q",
  w2Decrease: "a",
  w3Increase: "w",
  w3Decrease: "s",
  w4Increase: "r",
  w4Decrease: "f",
  // Buttons
  b1: "1",
  b2: "2",
  b3: "3",
  b4: "4",
  b5: "z",
} as const;

export type KeyboardControlKey = keyof typeof KEYBOARD_CONTROLS;

export interface KeyboardState {
  w1Increase: boolean;
  w1Decrease: boolean;
  w2Increase: boolean;
  w2Decrease: boolean;
  w3Increase: boolean;
  w3Decrease: boolean;
  w4Increase: boolean;
  w4Decrease: boolean;
  b1: boolean;
  b2: boolean;
  b3: boolean;
  b4: boolean;
  b5: boolean;
}

const EMPTY_KEYBOARD_STATE: KeyboardState = {
  w1Increase: false,
  w1Decrease: false,
  w2Increase: false,
  w2Decrease: false,
  w3Increase: false,
  w3Decrease: false,
  w4Increase: false,
  w4Decrease: false,
  b1: false,
  b2: false,
  b3: false,
  b4: false,
  b5: false,
};

// List of button keys that should only trigger once per press
const BUTTON_KEYS: KeyboardControlKey[] = ["b1", "b2", "b3", "b4", "b5"];

/**
 * Hook to track keyboard controls
 * Returns object with boolean flags for each control
 * Buttons are momentary (true for one frame), Wheels are continuous
 */
export function useKeyboardControls() {
  const [keyState, setKeyState] = useState<KeyboardState>(EMPTY_KEYBOARD_STATE);

  const pressedKeys = useRef<Set<string>>(new Set());
  const processedButtons = useRef<Set<KeyboardControlKey>>(new Set());

  const keyToControl = useCallback((key: string): KeyboardControlKey | null => {
    const lowerKey = key.toLowerCase();
    for (const [control, mappedKey] of Object.entries(KEYBOARD_CONTROLS)) {
      if (mappedKey === lowerKey) {
        return control as KeyboardControlKey;
      }
    }
    return null;
  }, []);

  const isTypingTarget = useCallback((target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const tagName = target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || tagName === "select") {
      return true;
    }

    if (target.isContentEditable) {
      return true;
    }

    return target.closest("[contenteditable='true']") !== null;
  }, []);

  const clearControls = useCallback(() => {
    pressedKeys.current.clear();
    processedButtons.current.clear();
    setKeyState(EMPTY_KEYBOARD_STATE);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) {
        clearControls();
        return;
      }

      const control = keyToControl(e.key);
      if (control) {
        e.preventDefault();
        pressedKeys.current.add(control);

        // Handle buttons specially - only trigger once
        if (BUTTON_KEYS.includes(control)) {
          if (!processedButtons.current.has(control)) {
            setKeyState((prev) => ({
              ...prev,
              [control]: true,
            }));
            processedButtons.current.add(control);
            // Reset button after a frame
            setTimeout(() => {
              setKeyState((prev) => ({
                ...prev,
                [control]: false,
              }));
            }, 16); // ~1 frame at 60fps
          }
        } else {
          // Wheels are continuous
          setKeyState((prev) => ({
            ...prev,
            [control]: true,
          }));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) {
        return;
      }

      const control = keyToControl(e.key);
      if (control) {
        e.preventDefault();
        pressedKeys.current.delete(control);
        processedButtons.current.delete(control);

        // Only set to false for wheels, buttons are already reset
        if (!BUTTON_KEYS.includes(control)) {
          setKeyState((prev) => ({
            ...prev,
            [control]: false,
          }));
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (isTypingTarget(e.target)) {
        clearControls();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [clearControls, isTypingTarget, keyToControl]);

  return keyState;
}
