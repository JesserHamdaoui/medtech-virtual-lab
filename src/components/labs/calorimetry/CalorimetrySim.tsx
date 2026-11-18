"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionTabs from "./SectionTabs";
import StationCanvas from "./StationCanvas";
import StationTabs from "./StationTabs";
import {
  CALORIMETRY_SECTIONS,
  CalorimetryBench,
  CalorimetrySection,
  CUP_STATION,
  INITIAL_BENCH,
  initialBench,
  benchSettled,
  getMaterialsFor,
  getStationsFor,
  ignite,
  advanceBench,
  syncCup,
  uncover,
} from "./types";
import { DEFAULT_LAB_SETTINGS, LabSettings } from "./labSettings";
import { DEFAULT_SIM_SPEED, SimSpeed } from "./simSpeed";
import { recordProgress, sectionProgress } from "./progress";
import { toUnitySnapshot } from "./unityState";
import { useGraphHistory } from "./useGraphHistory";

/** How often the bench is advanced, ms. */
const TICK_MS = 100;
/** The most real time one tick may advance the bench by, s, before the speed multiplies it. */
const MAX_STEP_SECONDS = 1;

export default function CalorimetrySim() {
  const [activeSection, setActiveSection] = useState<CalorimetrySection>("metal");
  const stations = getStationsFor(activeSection);
  const materials = getMaterialsFor(activeSection);
  const [activeStation, setActiveStation] = useState(stations[0].id);
  // The set-up the student chose, and the empty bench that goes with it. A
  // reset puts the bench back to exactly that object.
  const [setup, setSetup] = useState({ settings: DEFAULT_LAB_SETTINGS, initial: INITIAL_BENCH });
  const [bench, setBench] = useState<CalorimetryBench>(setup.initial);
  const [speed, setSpeed] = useState<SimSpeed>(DEFAULT_SIM_SPEED);
  const samples = useGraphHistory(bench, setup.initial, speed);

  // Every change to the bench goes through here, so progress is recorded as it happens.
  const update = useCallback((change: (prev: CalorimetryBench) => CalorimetryBench) => {
    setBench((prev) => recordProgress(change(prev)));
  }, []);
  const progress = {
    metal: sectionProgress(bench, "metal"),
    biomass: sectionProgress(bench, "biomass"),
  };
  const occupiedSections = CALORIMETRY_SECTIONS.filter(
    (section) => Object.keys(bench.placements[section.id]).length > 0,
  ).map((section) => section.id);

  const selectSection = (section: CalorimetrySection) => {
    setActiveSection(section);
    setActiveStation(getStationsFor(section)[0].id);
  };

  const station = stations.find((s) => s.id === activeStation) ?? stations[0];

  // A sample already out on some station stays there: it can't be dropped
  // anywhere else until it is removed back to the inventory. Dropping onto an
  // occupied station sends the sample that was there back to the inventory.
  const placeSample = (materialId: string) => {
    update((prev) => {
      const placed = prev.placements[activeSection];
      if (Object.values(placed).includes(materialId)) return prev;
      const next = {
        ...prev,
        placements: { ...prev.placements, [activeSection]: { ...placed, [station.id]: materialId } },
      };
      return station.id === CUP_STATION ? syncCup(next) : next;
    });
  };

  const removeSample = () => {
    update((prev) => {
      // A burning sample stays on the dish until it is out.
      if (prev.burning !== null && prev.placements[activeSection][station.id] === prev.burning) return prev;
      const placed = { ...prev.placements[activeSection] };
      delete placed[station.id];
      const next = { ...prev, placements: { ...prev.placements, [activeSection]: placed } };
      // Taking the sample off the dish means lifting the can off first.
      if (station.id === CUP_STATION) return syncCup(next);
      return station.id === "tin-can-calorimeter" ? uncover(next) : next;
    });
  };

  // Stable, so the Unity event listener isn't re-attached every render.
  const toggleHeater = useCallback(() => {
    update((prev) => ({ ...prev, heaterOn: !prev.heaterOn }));
  }, [update]);

  const igniteSample = () => update(ignite);

  // Everything back in the inventory, cold water, plate off.
  const resetBench = () => setBench(setup.initial);

  // New masses or water amounts mean a different experiment, so the bench starts over.
  const applySettings = (settings: LabSettings) => {
    const initial = initialBench(settings);
    setSetup({ settings, initial });
    setBench(initial);
  };

  // One clock runs the whole bench in real time, whichever station is open:
  // the bath heats and cools, a lit sample burns down and warms the flask, the
  // cup water and the metal in it meet in the middle, and a metal carries the
  // bath's heat with it. It only ticks while something is still changing.
  const settled = benchSettled(bench);
  useEffect(() => {
    if (settled) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      // Real elapsed time, so the bench keeps pace when the browser throttles
      // the timer in a background tab. Capped, so a long sleep can't jump it.
      const now = performance.now();
      const dt = Math.min(MAX_STEP_SECONDS, (now - last) / 1000) * speed;
      last = now;
      update((prev) => advanceBench(prev, dt));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [settled, update, speed]);

  // Memoised so Unity only gets a SetState when something it draws changed.
  const snapshot = useMemo(
    () => toUnitySnapshot(bench, activeSection, station.id),
    [bench, activeSection, station.id],
  );

  return (
    <div className="w-full border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
      <SectionTabs activeSection={activeSection} occupied={occupiedSections} progress={progress} onSelect={selectSection} />
      <StationTabs
        stations={stations}
        activeStation={activeStation}
        occupied={Object.keys(bench.placements[activeSection])}
        onSelect={setActiveStation}
      />

      <div className="flex">
        <StationCanvas
          section={activeSection}
          station={station}
          stepIndex={stations.indexOf(station)}
          stepCount={stations.length}
          materials={materials}
          bench={bench}
          samples={samples}
          snapshot={snapshot}
          onPlaceSample={placeSample}
          onRemoveSample={removeSample}
          onHeaterToggle={toggleHeater}
          onIgnite={igniteSample}
          onReset={resetBench}
          resetDisabled={bench === setup.initial}
          settings={setup.settings}
          onApplySettings={applySettings}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>
    </div>
  );
}
