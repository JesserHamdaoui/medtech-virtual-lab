"use client";

import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DockButton from "./DockButton";
import { LabSettings } from "./labSettings";
import Modal from "./Modal";
import SettingsPanel from "./SettingsPanel";

interface SettingsMenuProps {
  settings: LabSettings;
  /** Called with the new settings; the bench starts over with them. */
  onApply: (settings: LabSettings) => void;
}

/** The gear button and the settings dialog it opens. */
export default function SettingsMenu({ settings, onApply }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <DockButton icon={faGear} onClick={() => setOpen(true)}>
        Settings
      </DockButton>
      {open && (
        <Modal title="Lab settings" description="Choose how much each sample weighs and how much water is on the bench." onClose={close}>
          <SettingsPanel
            settings={settings}
            onApply={(next) => {
              onApply(next);
              close();
            }}
            onClose={close}
          />
        </Modal>
      )}
    </>
  );
}
