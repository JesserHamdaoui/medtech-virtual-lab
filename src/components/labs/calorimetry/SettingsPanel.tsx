import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DockButton from "./DockButton";
import NumberField from "./NumberField";
import {
  DEFAULT_LAB_SETTINGS,
  LabSettings,
  SETTING_LIMITS,
  parseField,
} from "./labSettings";
import { BIOMASS_MATERIALS, METAL_MATERIALS, MaterialInfo } from "./types";

type Draft = Record<string, string>;

const MATERIAL_GROUPS: { title: string; materials: MaterialInfo[] }[] = [
  { title: "Metals", materials: METAL_MATERIALS },
  { title: "Biomass", materials: BIOMASS_MATERIALS },
];

const ALL_MATERIALS = [...METAL_MATERIALS, ...BIOMASS_MATERIALS];

/** The text each field starts with for a set of settings. */
function draftOf(settings: LabSettings): Draft {
  const draft: Draft = {
    cupWaterMl: String(settings.cupWaterMl),
    flaskWaterMl: String(settings.flaskWaterMl),
    cupColdTemp: String(settings.cupColdTemp),
  };
  for (const material of ALL_MATERIALS) {
    draft[`mass:${material.id}`] = String(settings.masses[material.id] ?? material.massGrams);
  }
  return draft;
}

/** Checks every field. Returns the settings when all are fine, else the error of each bad field. */
function validate(draft: Draft): { settings: LabSettings; errors: Record<string, string> } | { settings: null; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const read = (key: string, limits: { min: number; max: number }) => {
    const result = parseField(draft[key], limits);
    if (result.error) errors[key] = result.error;
    return result.value ?? 0;
  };

  const masses: Record<string, number> = {};
  for (const material of ALL_MATERIALS) masses[material.id] = read(`mass:${material.id}`, SETTING_LIMITS.mass);
  const settings: LabSettings = {
    masses,
    cupWaterMl: read("cupWaterMl", SETTING_LIMITS.cupWaterMl),
    flaskWaterMl: read("flaskWaterMl", SETTING_LIMITS.flaskWaterMl),
    cupColdTemp: read("cupColdTemp", SETTING_LIMITS.cupColdTemp),
  };
  return Object.keys(errors).length ? { settings: null, errors } : { settings, errors };
}

interface SettingsPanelProps {
  settings: LabSettings;
  onApply: (settings: LabSettings) => void;
  onClose: () => void;
}

/** The form for the lab's set-up: sample masses and water amounts. Applying starts a fresh bench. */
export default function SettingsPanel({ settings, onApply, onClose }: SettingsPanelProps) {
  const [draft, setDraft] = useState<Draft>(() => draftOf(settings));
  const { settings: valid, errors } = validate(draft);
  const set = (key: string) => (value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onApply(valid);
      }}
      className="flex flex-col gap-4 w-80 max-h-[70vh] overflow-y-auto border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] shadow-lg p-4 text-left"
    >
      <span className="text-xs font-bold tracking-widest uppercase text-[var(--sim-label)]">Lab settings</span>

      {MATERIAL_GROUPS.map((group) => (
        <fieldset key={group.title} className="flex flex-col gap-2">
          <legend className="mb-1 text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)]">
            {group.title} mass
          </legend>
          {group.materials.map((material) => (
            <NumberField
              key={material.id}
              label={material.label}
              unit="g"
              value={draft[`mass:${material.id}`]}
              onChange={set(`mass:${material.id}`)}
              error={errors[`mass:${material.id}`]}
            />
          ))}
        </fieldset>
      ))}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)]">Water</legend>
        <NumberField label="Coffee cup water" unit="mL" value={draft.cupWaterMl} onChange={set("cupWaterMl")} error={errors.cupWaterMl} />
        <NumberField label="Flask water" unit="mL" value={draft.flaskWaterMl} onChange={set("flaskWaterMl")} error={errors.flaskWaterMl} />
        <NumberField label="Cup water start" unit="°C" value={draft.cupColdTemp} onChange={set("cupColdTemp")} error={errors.cupColdTemp} />
      </fieldset>

      <p className="text-xs text-[var(--sim-neutral-600)]">Applying puts every sample back in the inventory and starts a fresh bench.</p>

      <div className="flex flex-wrap gap-2">
        <DockButton type="submit" variant="primary" icon={faCheck} disabled={!valid}>
          Apply
        </DockButton>
        <DockButton onClick={() => setDraft(draftOf(DEFAULT_LAB_SETTINGS))}>Defaults</DockButton>
        <DockButton onClick={onClose}>Close</DockButton>
      </div>
    </form>
  );
}
