"use client";

import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import DockButton from "./DockButton";
import { LabSettings } from "./labSettings";
import SettingsPanel from "./SettingsPanel";

interface SettingsMenuProps {
  settings: LabSettings;
  /** Called with the new settings; the bench starts over with them. */
  onApply: (settings: LabSettings) => void;
}

/** The gear button and the settings form it opens below it. Escape or a click outside closes it. */
export default function SettingsMenu({ settings, onApply }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <DockButton icon={faGear} onClick={() => setOpen((prev) => !prev)}>
        Settings
      </DockButton>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-30">
          <SettingsPanel
            settings={settings}
            onApply={(next) => {
              onApply(next);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
