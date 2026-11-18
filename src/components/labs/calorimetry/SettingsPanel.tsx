import { faArrowRotateLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DockButton from "./DockButton";
import NumberField from "./NumberField";
import SettingsSection from "./SettingsSection";
import {
  DEFAULT_LAB_SETTINGS,
  LabSettings,
  Limits,
  SETTING_LIMITS,
  parseField,
} from "./labSettings";
import { BIOMASS_MATERIALS, METAL_MATERIALS } from "./types";

type Draft = Record<string, string>;

const ALL_MATERIALS = [...METAL_MATERIALS, ...BIOMASS_MATERIALS];
const massKey = (id: string) => `mass:${id}`;
const range = ({ min, max }: Limits) => `${min} to ${max}`;

/** The text each field starts with for a set of settings. */
function draftOf(settings: LabSettings): Draft {
  const draft: Draft = {
    bathWaterMl: String(settings.bathWaterMl),
    cupWaterMl: String(settings.cupWaterMl),
    flaskWaterMl: String(settings.flaskWaterMl),
    cupColdTemp: String(settings.cupColdTemp),
  };
  for (const material of ALL_MATERIALS) {
    draft[massKey(material.id)] = String(settings.masses[material.id] ?? material.massGrams);
  }
  return draft;
}

/** Checks every field. Returns the settings when all are fine, and the error of each bad field. */
function validate(draft: Draft): { settings: LabSettings | null; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const read = (key: string, limits: Limits) => {
    const result = parseField(draft[key], limits);
    if (result.error) errors[key] = result.error;
    return result.value ?? 0;
  };

  const masses: Record<string, number> = {};
  for (const material of ALL_MATERIALS) masses[material.id] = read(massKey(material.id), SETTING_LIMITS.mass);
  const settings: LabSettings = {
    masses,
    bathWaterMl: read("bathWaterMl", SETTING_LIMITS.bathWaterMl),
    cupWaterMl: read("cupWaterMl", SETTING_LIMITS.cupWaterMl),
    flaskWaterMl: read("flaskWaterMl", SETTING_LIMITS.flaskWaterMl),
    cupColdTemp: read("cupColdTemp", SETTING_LIMITS.cupColdTemp),
  };
  return { settings: Object.keys(errors).length ? null : settings, errors };
}

interface SettingsPanelProps {
  settings: LabSettings;
  onApply: (settings: LabSettings) => void;
  onClose: () => void;
}

/**
 * The content of the settings dialog: sample masses on one side, water and
 * temperature on the other, and the buttons along the bottom. Applying starts
 * a fresh bench.
 */
export default function SettingsPanel({ settings, onApply, onClose }: SettingsPanelProps) {
  const [draft, setDraft] = useState<Draft>(() => draftOf(settings));
  const { settings: valid, errors } = validate(draft);
  const set = (key: string) => (value: string) => setDraft((prev) => ({ ...prev, [key]: value }));
  const massField = (material: (typeof ALL_MATERIALS)[number]) => (
    <NumberField
      key={material.id}
      label={material.label}
      unit="g"
      value={draft[massKey(material.id)]}
      onChange={set(massKey(material.id))}
      hint={range(SETTING_LIMITS.mass)}
      error={errors[massKey(material.id)]}
    />
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onApply(valid);
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SettingsSection title="Metal samples">{METAL_MATERIALS.map(massField)}</SettingsSection>
          <SettingsSection title="Biomass samples">{BIOMASS_MATERIALS.map(massField)}</SettingsSection>
        </div>
        <div className="flex flex-col gap-4">
          <SettingsSection title="Water">
            <NumberField label="Hot water bath" unit="mL" value={draft.bathWaterMl} onChange={set("bathWaterMl")} hint={range(SETTING_LIMITS.bathWaterMl)} error={errors.bathWaterMl} />
            <NumberField label="Coffee cup" unit="mL" value={draft.cupWaterMl} onChange={set("cupWaterMl")} hint={range(SETTING_LIMITS.cupWaterMl)} error={errors.cupWaterMl} />
            <NumberField label="Flask" unit="mL" value={draft.flaskWaterMl} onChange={set("flaskWaterMl")} hint={range(SETTING_LIMITS.flaskWaterMl)} error={errors.flaskWaterMl} />
          </SettingsSection>
          <SettingsSection title="Temperature">
            <NumberField label="Cup water start" unit="°C" value={draft.cupColdTemp} onChange={set("cupColdTemp")} hint={range(SETTING_LIMITS.cupColdTemp)} error={errors.cupColdTemp} />
          </SettingsSection>
        </div>
      </div>

      <footer className="flex flex-wrap items-center gap-3 border-t-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)] px-5 py-3">
        <p className="min-w-48 flex-1 text-xs text-[var(--sim-neutral-600)]">
          Applying puts every sample back in the inventory and starts a fresh bench.
        </p>
        <DockButton icon={faArrowRotateLeft} onClick={() => setDraft(draftOf(DEFAULT_LAB_SETTINGS))}>
          Defaults
        </DockButton>
        <DockButton onClick={onClose}>Cancel</DockButton>
        <DockButton type="submit" variant="primary" icon={faCheck} disabled={!valid}>
          Apply
        </DockButton>
      </footer>
    </form>
  );
}
