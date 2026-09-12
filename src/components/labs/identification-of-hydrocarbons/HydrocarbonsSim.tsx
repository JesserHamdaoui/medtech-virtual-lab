"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import OutcomeCard from "./OutcomeCard";
import SampleTabs from "./SampleTabs";
import SampleTray from "./SampleTray";
import TestSidebar from "./TestSidebar";
import TestTube, { TestTubeLayer } from "./TestTube";
import Toast from "./Toast";
import UnityWorkbench from "./UnityWorkbench";
import { UnityWorkbenchState } from "./unity/protocol";
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

  /** All three unknowns side by side, rather than only the selected one. */
  const [splitView, setSplitView] = useState(false);
  /**
   * What is currently being dragged, so the 3D vessels that can take it can
   * outline themselves. Empty when nothing is held.
   */
  const [holding, setHolding] = useState("");

  // Drag events fire on the draggable elements, not on the canvas, so the held
  // item is tracked at the document level and handed to Unity as state.
  useEffect(() => {
    const onDragStart = (event: DragEvent) => {
      const types = event.dataTransfer?.types ?? [];
      if (Array.from(types).includes("application/x-sample-dropper")) {
        setHolding("sample");
        return;
      }

      // Reagent ids are not readable from dataTransfer during dragstart in
      // every browser, so the element's own marker is the reliable source.
      const source = event.target as HTMLElement | null;
      const reagentId = source?.closest("[data-reagent]")?.getAttribute("data-reagent");
      if (reagentId) setHolding(reagentId);
    };
    const onDragEnd = () => setHolding("");

    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("dragend", onDragEnd);
    document.addEventListener("drop", onDragEnd);
    return () => {
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("dragend", onDragEnd);
      document.removeEventListener("drop", onDragEnd);
    };
  }, []);

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

  // Everything one sample's bench shows, derived from that sample's own
  // session. Split view draws all three at once, so this has to work for any
  // sample rather than only the selected one.
  const describeSample = (sampleId: SampleId) => {
    const session = sessions[sampleId];
    const hydrocarbonId = identities[sampleId];

    const sampleWaterDrops = session.solubility.waterDrops;
    const sampleLigroinDrops = session.solubility.ligroinDrops;

    // Which reagent(s) are relevant to the currently open test section — this
    // drives both the tube's liquid layers and the top-left readout, since
    // each test uses its own fresh tube in the real procedure. Combustion has
    // no dropper reagent (it's run on a watch glass), so it contributes none.
    const sampleSingleDropTestDrops =
      openTest === "bromine" || openTest === "kmno4" || openTest === "h2so4"
        ? session[openTest]
        : 0;

    const reacted = session.reacted[openTest] === true;

    // Outcome only resolves once shaken, and only for the reagent tests — the
    // manual describes solubility outcomes too (miscible/immiscible) but the
    // color is already visually distinct pre-shake, so shake just confirms it.
    const water = reacted && openTest === "solubility" && sampleWaterDrops > 0
      ? getSolubilityOutcome("water", sampleWaterDrops)
      : null;
    const ligroin = reacted && openTest === "solubility" && sampleLigroinDrops > 0
      ? getSolubilityOutcome("ligroin", sampleLigroinDrops)
      : null;
    const reagent =
      reacted &&
      (openTest === "bromine" || openTest === "kmno4" || openTest === "h2so4") &&
      sampleSingleDropTestDrops > 0
        ? getReagentOutcome(openTest, hydrocarbonId, sampleSingleDropTestDrops)
        : null;

    const combustion =
      openTest === "combustion" && session.ignited
        ? getCombustionOutcome(hydrocarbonId)
        : null;

    // Ligroin is fully miscible with the hydrocarbon sample once there's
    // enough of it to confirm — so once shaken with a clear result, it
    // blends into one band rather than sitting as a separate layer. Water
    // never mixes in, so it always keeps its own band, denser and sitting
    // below the organic layer.
    const ligroinMiscible = ligroin?.miscible === true;

    // Water is denser than the organic hydrocarbons and sinks to the bottom.
    // Every other test's reagent is added dropwise on top of the sample.
    const layers: TestTubeLayer[] =
      openTest === "solubility"
        ? ligroinMiscible
          ? [
              { color: water?.tubeColor ?? "#cfeaf4", heightPx: sampleWaterDrops * PX_PER_DROP },
              {
                color: ligroin?.tubeColor ?? SAMPLE_TUBE_COLOR,
                heightPx: SAMPLE_DROPS * PX_PER_DROP + sampleLigroinDrops * PX_PER_DROP,
              },
            ]
          : [
              { color: water?.tubeColor ?? "#cfeaf4", heightPx: sampleWaterDrops * PX_PER_DROP },
              { color: SAMPLE_TUBE_COLOR, heightPx: SAMPLE_DROPS * PX_PER_DROP },
              {
                color: ligroin?.tubeColor ?? "#f3ddb0",
                heightPx: sampleLigroinDrops * PX_PER_DROP,
              },
            ]
        : [
            { color: SAMPLE_TUBE_COLOR, heightPx: SAMPLE_DROPS * PX_PER_DROP },
            {
              color:
                reagent?.tubeColor ??
                REAGENTS.find((r) => r.id === openTest)?.tubeColor ??
                SAMPLE_TUBE_COLOR,
              heightPx: sampleSingleDropTestDrops * PX_PER_DROP,
            },
            ...(reagent?.precipitateColor
              ? [{ color: reagent.precipitateColor, heightPx: 4 }]
              : []),
          ];

    return {
      session,
      waterDrops: sampleWaterDrops,
      ligroinDrops: sampleLigroinDrops,
      singleDropTestDrops: sampleSingleDropTestDrops,
      hasReacted: reacted,
      waterOutcome: water,
      ligroinOutcome: ligroin,
      reagentOutcome: reagent,
      combustionOutcome: combustion,
      layers,
    };
  };

  const activeBench = describeSample(activeSample);
  const waterDrops = activeBench.waterDrops;
  const ligroinDrops = activeBench.ligroinDrops;
  const singleDropTestDrops = activeBench.singleDropTestDrops;
  const hasReacted = activeBench.hasReacted;
  const waterOutcome = activeBench.waterOutcome;
  const ligroinOutcome = activeBench.ligroinOutcome;
  const reagentOutcome = activeBench.reagentOutcome;
  const combustionOutcome = activeBench.combustionOutcome;
  const tubeLayers = activeBench.layers;

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

  const canShake = Object.values(activeReagentDrops).some((drops) => (drops ?? 0) > 0);
  const heatLevel = reagentOutcome?.heatLevel ?? "none";
  const canIgnite = openTest === "combustion" && activeSession.combustionDrops > 0;

  // Everything the Unity workbench needs to draw the current bench. It is a
  // projection of the state above, never a second copy of it — the chemistry
  // stays here so the sidebar and the 3D bench can't disagree.
  const revisionRef = useRef(0);

  // Every sample's bench, so split view can draw all three without a second
  // round trip. Keyed on its own contents because it is rebuilt each render.
  const panes = SAMPLES.map((sample) => {
    const bench = sample.id === activeSample ? activeBench : describeSample(sample.id);
    return {
      sample: sample.id,
      test: openTest,
      layers: bench.layers.map((layer) => ({ color: layer.color, height: layer.heightPx })),
      shaking: sample.id === activeSample ? isShaking : false,
      heat: bench.reagentOutcome?.heatLevel ?? ("none" as const),
      combustionDrops: bench.session.combustionDrops,
      ignited: bench.session.ignited,
      flameColor: bench.combustionOutcome?.flameColor ?? "#f2a63c",
      smoke: bench.combustionOutcome?.smokeLevel ?? ("none" as const),
      active: sample.id === activeSample,
    };
  });
  const panesKey = JSON.stringify(panes);

  const unityState: UnityWorkbenchState = useMemo(
    () => ({
      layout: splitView ? "split" : "single",
      panes,
      holding,
      test: openTest,
      sample: activeSample,
      layers: tubeLayers.map((layer) => ({ color: layer.color, height: layer.heightPx })),
      shaking: isShaking,
      heat: heatLevel,
      combustionDrops: activeSession.combustionDrops,
      ignited: activeSession.ignited,
      flameColor: combustionOutcome?.flameColor ?? "#f2a63c",
      smoke: combustionOutcome?.smokeLevel ?? "none",
      glass: "var(--sim-neutral-0)",
      background: "var(--sim-panel-bg)",
      revision: ++revisionRef.current,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [splitView, panesKey, holding, openTest, activeSample, isShaking, heatLevel],
  );

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
          {/* Sits first so the canvas stays behind the DOM overlays that read
              on top of the bench: the readout, the toolbar and the outcome card. */}
          <UnityWorkbench
            state={unityState}
            // In split view the drop lands on whichever pane it was dragged
            // over, so the bench Unity reports wins over the selected tab.
            onReagentDrop={(reagentId, sampleId) =>
              addReagentDrop(sampleId ?? activeSample, reagentId)
            }
            onSampleDrop={(sampleId) => addSampleDropToWatchGlass(sampleId ?? activeSample)}
            onSelectSample={(sampleId) => {
              if (sampleId === activeSample) return;
              stopShaking();
              setActiveSample(sampleId);
            }}
            fallback={
              openTest === "combustion" ? (
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
              )
            }
          />

          <WorkbenchInfo
            sampleLabel={SAMPLES.find((s) => s.id === activeSample)?.label ?? ""}
            hydrocarbonLabel={activeTagLabel}
            sampleDrops={openTest === "combustion" ? activeSession.combustionDrops : SAMPLE_DROPS}
            addedReagents={addedReagents}
          />

          <WorkbenchToolbar
            onReset={() => resetSample(activeSample)}
            splitView={splitView}
            onToggleSplitView={() => setSplitView((on) => !on)}
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
