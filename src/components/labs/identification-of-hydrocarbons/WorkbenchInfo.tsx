"use client";

const ML_PER_DROP = 0.05;

interface AddedReagent {
  label: string;
  color: string;
  drops: number;
}

interface WorkbenchInfoProps {
  sampleLabel: string;
  hydrocarbonLabel?: string;
  sampleDrops: number;
  addedReagents: AddedReagent[];
}

function Reading({
  label,
  drops,
  swatchColor,
}: {
  label: string;
  drops: number;
  swatchColor?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--sim-neutral-500)]">
      {swatchColor && (
        <span
          style={{ backgroundColor: swatchColor, borderRadius: "9999px" }}
          className="w-2 h-2 shrink-0"
        />
      )}
      <span className="min-w-[11rem] whitespace-nowrap text-[var(--sim-neutral-600)]">{label}</span>
      <span className="px-2 py-0.5 border-2 border-[var(--sim-border-subtle)]">
        {drops} drop{drops === 1 ? "" : "s"}
      </span>
      <span className="px-2 py-0.5 border-2 border-[var(--sim-border-subtle)]">
        {(drops * ML_PER_DROP).toFixed(2)} mL
      </span>
    </div>
  );
}

export default function WorkbenchInfo({
  sampleLabel,
  hydrocarbonLabel,
  sampleDrops,
  addedReagents,
}: WorkbenchInfoProps) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-2 p-4 max-w-[24rem]">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-wide text-[var(--sim-neutral-900)] uppercase">
          {sampleLabel}
        </span>
        {hydrocarbonLabel && (
          <span className="text-xs font-semibold px-2 py-0.5 border-2 bg-[var(--sim-accent-50)] text-[var(--sim-accent-700)] border-[var(--sim-accent-700)]">
            {hydrocarbonLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Reading label={sampleLabel} drops={sampleDrops} />
        {addedReagents.map((reagent) => (
          <Reading
            key={reagent.label}
            label={reagent.label}
            drops={reagent.drops}
            swatchColor={reagent.color}
          />
        ))}
      </div>
    </div>
  );
}
