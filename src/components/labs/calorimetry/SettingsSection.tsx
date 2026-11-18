import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

/** A titled card that groups related fields in the settings dialog. */
export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <fieldset className="flex flex-col gap-3 border-2 border-[var(--sim-border-subtle)] bg-[var(--sim-neutral-0)] p-4">
      <legend className="px-1 text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)]">{title}</legend>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
