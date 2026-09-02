"use client";

import { useEffect, useRef, useState } from "react";
import OutcomeCard from "./OutcomeCard";
import SampleTabs from "./SampleTabs";
import SampleTray from "./SampleTray";
import TestSidebar from "./TestSidebar";
import TestTube, { TestTubeLayer } from "./TestTube";
import Toast from "./Toast";
import WatchGlass from "./WatchGlass";
import WorkbenchInfo from "./WorkbenchInfo";
import WorkbenchToolbar from "./WorkbenchToolbar";
import {
  createEmptyTestSession,
  getCombustionOutcome,
  getReagentOutcome,
  getSolubilityOutcome,
  HYDROCARBONS,
  HydrocarbonId,
  MAX_DROPS_PER_REAGENT,
  REAGENTS,
  ReagentId,
  SampleId,
  SAMPLES,
  shuffleSampleIdentities,
  TestId,
  TESTS,
  TestSessionState,
} from "./types";

const SAMPLE_DROPS = 5;
const PX_PER_DROP = 2.8;
const SAMPLE_TUBE_COLOR = "var(--sim-accent-100)";

export default function HydrocarbonsSim() {
  const [activeSample, setActiveSample] = useState<SampleId>(SAMPLES[0].id);
  const [openTest, setOpenTest] = useState<TestId>(TESTS[0].id);
  // Hidden ground truth — shuffled once per mount, never shown to the user.
  // Drives what the tube actually does; the tags below are just the
  // user's own notes and have no effect on chemistry.
  const [identities] = useState<Record<SampleId, HydrocarbonId>>(() =>
    shuffleSampleIdentities(),
  );
  const [assignments, setAssignments] = useState<
    Partial<Record<SampleId, HydrocarbonId>>
  >({});
  const [sessions, setSessions] = useState<Record<SampleId, TestSessionState>>(
    () => ({
      "unknown-1": createEmptyTestSession(),
      "unknown-2": createEmptyTestSession(),
      "unknown-3": createEmptyTestSession(),
    }),
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isShaking, setIsShaking] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shake = (sampleId: SampleId, testId: TestId) => {
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    setIsShaking(false);
    // Force a reflow so re-adding the animation class restarts the keyframe.
    requestAnimationFrame(() => setIsShaking(true));
    shakeTimer.current = setTimeout(() => setIsShaking(false), 600);

    setSessions((current) => {
      const currentSession = current[sampleId];
      return {
        ...current,
        [sampleId]: {
          ...currentSession,
          reacted: { ...currentSession.reacted, [testId]: true },
        },
      };
    });
  };

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, []);

  const stopShaking = () => {
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    setIsShaking(false);
  };

  const unassign = (sampleId: SampleId) =>
    setAssignments((current) => {
      const next = { ...current };
      delete next[sampleId];
      return next;
    });

  const resetSample = (sampleId: SampleId) => {
    unassign(sampleId);
    setSessions((current) => ({
      ...current,
      [sampleId]: createEmptyTestSession(),
    }));
    stopShaking();
  };

  const addReagentDrop = (sampleId: SampleId, reagentId: ReagentId) => {
    const session = sessions[sampleId];

    // Solubility test: water and ligroin are run in separate tubes per the
    // manual, so mixing them in this simulated single tube is disallowed.
    if (reagentId === "water" || reagentId === "ligroin") {
      const otherReagentLabel = reagentId === "water" ? "Petroleum Ether (Ligroin)" : "Water";
      const otherDropsAlreadyAdded =
        reagentId === "water"
          ? session.solubility.ligroinDrops > 0
          : session.solubility.waterDrops > 0;

      if (otherDropsAlreadyAdded) {
        showToast(
          `Can't add ${REAGENTS.find((r) => r.id === reagentId)?.label}, this test tube already has ${otherReagentLabel}. Reset the sample to try a different solvent.`,
        );
        return;
      }

      const currentDrops =
        reagentId === "water" ? session.solubility.waterDrops : session.solubility.ligroinDrops;
      if (currentDrops >= MAX_DROPS_PER_REAGENT) {
        showToast(
          `Can't add more ${REAGENTS.find((r) => r.id === reagentId)?.label}, maximum of ${MAX_DROPS_PER_REAGENT} drops reached.`,
        );
        return;
      }

      setSessions((current) => {
        const currentSession = current[sampleId];
        const key = reagentId === "water" ? "waterDrops" : "ligroinDrops";
        return {
          ...current,
          [sampleId]: {
            ...currentSession,
            solubility: {
              ...currentSession.solubility,
              [key]: currentSession.solubility[key] + 1,
            },
            reacted: { ...currentSession.reacted, solubility: false },
          },
        };
      });
      return;
    }

    if (session[reagentId] >= MAX_DROPS_PER_REAGENT) {
      showToast(
        `Can't add more ${REAGENTS.find((r) => r.id === reagentId)?.label}, maximum of ${MAX_DROPS_PER_REAGENT} drops reached.`,
      );
      return;
    }

    setSessions((current) => {
      const currentSession = current[sampleId];
      return {
        ...current,
        [sampleId]: {
          ...currentSession,
          [reagentId]: currentSession[reagentId] + 1,
          reacted: { ...currentSession.reacted, [reagentId]: false },
        },
      };
    });
  };

  const addSampleDropToWatchGlass = (sampleId: SampleId) => {
    const session = sessions[sampleId];
    if (session.combustionDrops >= MAX_DROPS_PER_REAGENT) {
      showToast(`Can't add more sample, maximum of ${MAX_DROPS_PER_REAGENT} drops reached.`);
      return;
    }
    setSessions((current) => {
      const currentSession = current[sampleId];
      return {
        ...current,
        [sampleId]: {
          ...currentSession,
          combustionDrops: currentSession.combustionDrops + 1,
          ignited: false,
        },
      };
    });
  };

  const igniteSample = (sampleId: SampleId) => {
    setSessions((current) => {
      const currentSession = current[sampleId];
      if (currentSession.combustionDrops === 0) return current;
      return {
        ...current,
        [sampleId]: {
          ...currentSession,
          ignited: true,
        },
      };
    });
  };

  const assignedHydrocarbons = new Set(Object.values(assignments));
  // The user's own tag — shown as a label, never fed into the chemistry.
  const activeTagId = assignments[activeSample];
  const activeTagLabel = activeTagId
    ? HYDROCARBONS.find((hc) => hc.id === activeTagId)?.label
    : undefined;
  // Hidden ground truth — this is what the reaction outcomes are computed
  // against, regardless of what (or whether) the user has tagged the tab.
  const activeHydrocarbonId = identities[activeSample];

  const activeSession = sessions[activeSample];

  const waterDrops = activeSession.solubility.waterDrops;
  const ligroinDrops = activeSession.solubility.ligroinDrops;

  // Which reagent(s) are relevant to the currently open test section — this
  // drives both the tube's liquid layers and the top-left readout, since
  // each test uses its own fresh tube in the real procedure. Combustion has
  // no dropper reagent (it's run on a watch glass), so it contributes none.
  const singleDropTestDrops =
    openTest === "bromine" || openTest === "kmno4" || openTest === "h2so4"
      ? activeSession[openTest]
      : 0;

  const activeReagentDrops: Partial<Record<ReagentId, number>> =
    openTest === "solubility"
      ? { water: waterDrops, ligroin: ligroinDrops }
      : openTest === "bromine" || openTest === "kmno4" || openTest === "h2so4"
        ? { [openTest]: singleDropTestDrops }
        : {};

  const addedReagents = REAGENTS.filter((r) => (activeReagentDrops[r.id] ?? 0) > 0).map(
    (reagent) => ({
      label: reagent.label,
      color: reagent.color,
      drops: activeReagentDrops[reagent.id] ?? 0,
    }),
  );

  const hasReacted = activeSession.reacted[openTest] === true;

  // Outcome only resolves once shaken, and only for the reagent tests — the
  // manual describes solubility outcomes too (miscible/immiscible) but the
  // color is already visually distinct pre-shake, so shake just confirms it.
  const waterOutcome = hasReacted && openTest === "solubility" && waterDrops > 0
    ? getSolubilityOutcome("water", waterDrops)
    : null;
  const ligroinOutcome = hasReacted && openTest === "solubility" && ligroinDrops > 0
    ? getSolubilityOutcome("ligroin", ligroinDrops)
    : null;
  const reagentOutcome =
    hasReacted &&
    (openTest === "bromine" || openTest === "kmno4" || openTest === "h2so4") &&
    singleDropTestDrops > 0
      ? getReagentOutcome(openTest, activeHydrocarbonId, singleDropTestDrops)
      : null;

  const combustionOutcome =
    openTest === "combustion" && activeSession.ignited
      ? getCombustionOutcome(activeHydrocarbonId)
      : null;

  // Ligroin is fully miscible with the hydrocarbon sample once there's
  // enough of it to confirm — so once shaken with a clear result, it
  // blends into one band rather than sitting as a separate layer. Water
  // never mixes in, so it always keeps its own band, denser and sitting
  // below the organic layer.
  const ligroinMiscible = ligroinOutcome?.miscible === true;

  // Water is denser than the organic hydrocarbons and sinks to the bottom.
  // Every other test's reagent is added dropwise on top of the sample.
  const tubeLayers: TestTubeLayer[] =
    openTest === "solubility"
      ? ligroinMiscible
        ? [
            { color: waterOutcome?.tubeColor ?? "#cfeaf4", heightPx: waterDrops * PX_PER_DROP },
            {
              color: ligroinOutcome?.tubeColor ?? SAMPLE_TUBE_COLOR,
              heightPx: SAMPLE_DROPS * PX_PER_DROP + ligroinDrops * PX_PER_DROP,
            },
          ]
        : [
            { color: waterOutcome?.tubeColor ?? "#cfeaf4", heightPx: waterDrops * PX_PER_DROP },
            { color: SAMPLE_TUBE_COLOR, heightPx: SAMPLE_DROPS * PX_PER_DROP },
            {
              color: ligroinOutcome?.tubeColor ?? "#f3ddb0",
              heightPx: ligroinDrops * PX_PER_DROP,
            },
          ]
      : [
          { color: SAMPLE_TUBE_COLOR, heightPx: SAMPLE_DROPS * PX_PER_DROP },
          {
            color:
              reagentOutcome?.tubeColor ??
              REAGENTS.find((r) => r.id === openTest)?.tubeColor ??
              SAMPLE_TUBE_COLOR,
            heightPx: singleDropTestDrops * PX_PER_DROP,
          },
          ...(reagentOutcome?.precipitateColor
            ? [{ color: reagentOutcome.precipitateColor, heightPx: 4 }]
            : []),
        ];

  const canShake = Object.values(activeReagentDrops).some((drops) => (drops ?? 0) > 0);
  const heatLevel = reagentOutcome?.heatLevel ?? "none";
  const canIgnite = openTest === "combustion" && activeSession.combustionDrops > 0;

  return (
    <div className="w-full border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
      <div className="flex items-stretch justify-between">
        <SampleTabs
          activeSample={activeSample}
          onSelect={(sampleId) => {
            stopShaking();
            setActiveSample(sampleId);
          }}
          assignments={assignments}
          onAssign={(sampleId, hydrocarbonId) =>
            setAssignments((current) => ({ ...current, [sampleId]: hydrocarbonId }))
          }
          onUnassign={unassign}
        />
        <SampleTray assignedHydrocarbons={assignedHydrocarbons} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        <TestSidebar
          session={activeSession}
          openTest={openTest}
          onToggleTest={(testId) => {
            stopShaking();
            setOpenTest(testId);
          }}
          sampleLabel={SAMPLES.find((s) => s.id === activeSample)?.label ?? ""}
        />

        <div className="relative flex-1 min-h-[500px] border-2 border-[var(--sim-border)] bg-[var(--sim-panel-bg)] flex items-center justify-center">
          <WorkbenchInfo
            sampleLabel={SAMPLES.find((s) => s.id === activeSample)?.label ?? ""}
            hydrocarbonLabel={activeTagLabel}
            sampleDrops={openTest === "combustion" ? activeSession.combustionDrops : SAMPLE_DROPS}
            addedReagents={addedReagents}
          />
          {openTest === "combustion" ? (
            <WatchGlass
              drops={activeSession.combustionDrops}
              onSampleDrop={() => addSampleDropToWatchGlass(activeSample)}
              isIgnited={activeSession.ignited}
              flameColor={combustionOutcome?.flameColor}
              smokeLevel={combustionOutcome?.smokeLevel}
            />
          ) : (
            <TestTube
              layers={tubeLayers}
              onReagentDrop={(reagentId) => addReagentDrop(activeSample, reagentId)}
              isShaking={isShaking}
              heatLevel={heatLevel}
            />
          )}
          <WorkbenchToolbar
            onReset={() => resetSample(activeSample)}
            canShake={canShake}
            onShake={() => shake(activeSample, openTest)}
            canIgnite={canIgnite}
            onIgnite={() => igniteSample(activeSample)}
          />

          {(reagentOutcome ?? waterOutcome ?? ligroinOutcome ?? combustionOutcome) && (
            <OutcomeCard
              outcome={(reagentOutcome ?? waterOutcome ?? ligroinOutcome ?? combustionOutcome)!}
            />
          )}

          {toastMessage && <Toast message={toastMessage} />}
        </div>
      </div>
    </div>
  );
}
