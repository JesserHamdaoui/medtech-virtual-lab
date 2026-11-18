"use client";

import { DragEvent, useRef, useState } from "react";
import CalorimetryUnity, { DropProbe } from "./CalorimetryUnity";
import DockActions from "./DockActions";
import GraphPanel from "./GraphPanel";
import { GraphSample } from "./graphHistory";
import InstrumentDock from "./InstrumentDock";
import MaterialInventory from "./MaterialInventory";
import { LabSettings } from "./labSettings";
import { SimSpeed } from "./simSpeed";
import SettingsMenu from "./SettingsMenu";
import SpeedControl from "./SpeedControl";
import StationHeader from "./StationHeader";
import { buildStationStatus } from "./stationStatus";
import {
  CalorimetryBench,
  CalorimetrySection,
  MaterialInfo,
  StationInfo,
  sampleAt,
  samplesInUse,
} from "./types";
import { UnityCalorimetrySnapshot } from "./unityState";

interface StationCanvasProps {
  section: CalorimetrySection;
  station: StationInfo;
  /** Zero-based position of the station among its section's stations. */
  stepIndex: number;
  stepCount: number;
  materials: MaterialInfo[];
  bench: CalorimetryBench;
  /** The recorded temperatures for the live graph. */
  samples: GraphSample[];
  snapshot: UnityCalorimetrySnapshot;
  onPlaceSample: (materialId: string) => void;
  onRemoveSample: () => void;
  onHeaterToggle: () => void;
  onIgnite: () => void;
  onReset: () => void;
  resetDisabled: boolean;
  settings: LabSettings;
  onApplySettings: (settings: LabSettings) => void;
  speed: SimSpeed;
  onSpeedChange: (speed: SimSpeed) => void;
}

/**
 * Bench canvas for the active station. Unity draws the station's apparatus
 * between a header on top and the instrument dock along the bottom, with the
 * live graph in a column to its right and the inventory down its left edge. A material dragged in from the inventory is set on the
 * station — on the scale pan, into the beaker or cup, onto the plate or
 * under the can — and Unity draws it there. It only lands when let go over
 * the apparatus itself, which Unity outlines while the sample is held over it. On the balance, the scale's LCD
 * also reads its mass. A sample stays on its station until removed.
 */
export default function StationCanvas({
  section,
  station,
  stepIndex,
  stepCount,
  materials,
  bench,
  samples,
  snapshot,
  onPlaceSample,
  onRemoveSample,
  onHeaterToggle,
  onIgnite,
  onReset,
  resetDisabled,
  settings,
  onApplySettings,
  speed,
  onSpeedChange,
}: StationCanvasProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const probeRef = useRef<DropProbe | null>(null);
  const onStation = sampleAt(bench, section, station.id);
  const inUse = samplesInUse(bench, section);
  const status = buildStationStatus(bench, section, station.id);

  // Without a running 3D bench there is nothing to aim at, so the whole
  // canvas stands in for the station.
  const overApparatus = (e: DragEvent) => probeRef.current?.hover(e.clientX, e.clientY) ?? true;

  const endDrag = () => {
    setIsDragOver(false);
    probeRef.current?.end();
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        const over = overApparatus(e);
        e.dataTransfer.dropEffect = over ? "copy" : "none";
        setIsDragOver(over);
      }}
      onDragLeave={(e) => {
        // Moving onto a child element also fires dragleave; only a real exit counts.
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        endDrag();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const over = overApparatus(e);
        endDrag();
        if (!over) return;
        const materialId = e.dataTransfer.getData("text/plain");
        if (materials.some((m) => m.id === materialId) && !inUse.includes(materialId)) {
          onPlaceSample(materialId);
        }
      }}
      className={`relative flex-1 min-h-[520px] bg-[var(--sim-panel-bg)] flex flex-col transition-colors duration-100 ${
        isDragOver ? "outline outline-2 outline-dashed outline-[var(--sim-accent-900)] outline-offset-[-4px]" : ""
      }`}
    >
      <StationHeader
        label={station.label}
        instruction={status.instruction}
        stepIndex={stepIndex}
        stepCount={stepCount}
        onReset={onReset}
        resetDisabled={resetDisabled}
      >
        <SpeedControl speed={speed} onChange={onSpeedChange} />
        <SettingsMenu settings={settings} onApply={onApplySettings} />
      </StationHeader>

      <div className="flex flex-1 min-h-0">
        <div className="relative flex-1 min-w-0">
          <CalorimetryUnity snapshot={snapshot} probeRef={probeRef} onHeaterToggle={onHeaterToggle} />
          <MaterialInventory materials={materials} inUseIds={inUse} />
        </div>
        <GraphPanel stationId={station.id} samples={samples} />
      </div>

      <InstrumentDock status={status}>
        <DockActions
          stationId={station.id}
          bench={bench}
          sample={onStation}
          onHeaterToggle={onHeaterToggle}
          onIgnite={onIgnite}
          onRemoveSample={onRemoveSample}
        />
      </InstrumentDock>
    </div>
  );
}
