"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ReagentId, SampleId } from "./types";
import {
  DropPayload,
  resolveCssColor,
  SAMPLE_PAYLOAD,
  UNITY_BRIDGE_OBJECT,
  UNITY_EVENT_NAME,
  UnityWorkbenchEvent,
  UnityWorkbenchState,
} from "./unity/protocol";
import { useUnityInstance } from "./unity/useUnityInstance";

const BUILD_URL = "/unity/hydrocarbons";
const BUILD_NAME = "hydrocarbons";

interface UnityWorkbenchProps {
  state: UnityWorkbenchState;
  /** Selects a pane — clicking or dragging into one makes it the active sample. */
  onSelectSample: (sampleId: SampleId) => void;
  /** sampleId is the bench Unity reports the drop landed on, if any. */
  onReagentDrop: (reagentId: ReagentId, sampleId?: SampleId) => void;
  onSampleDrop: (sampleId?: SampleId) => void;
  /** Rendered instead of the canvas if the build can't be loaded. */
  fallback?: ReactNode;
}

/**
 * The Unity half of the bench. Everything around it — the sample tabs, the
 * test sidebar, the toolbar, the outcome card — stays in React and keeps
 * driving the same state, so both halves always describe the same tube.
 *
 * Unity is purely a renderer and a hit-test surface here. It never decides
 * whether a drop is legal or what a reagent does; it reports what was hit
 * and React applies the rules it already owns.
 */
export default function UnityWorkbench({
  state,
  onReagentDrop,
  onSampleDrop,
  onSelectSample,
  fallback,
}: UnityWorkbenchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { status, progress, error, instanceRef } = useUnityInstance(canvasRef, {
    buildUrl: BUILD_URL,
    buildName: BUILD_NAME,
  });

  // Callbacks are read through a ref inside the DOM listener so the
  // subscription isn't torn down and rebuilt on every parent render.
  const handlersRef = useRef({ onReagentDrop, onSampleDrop });
  handlersRef.current = { onReagentDrop, onSampleDrop };

  const sendState = useCallback(() => {
    const instance = instanceRef.current;
    const element = containerRef.current;
    if (!instance || !element) return;

    const payload: UnityWorkbenchState = {
      ...state,
      layers: state.layers.map((layer) => ({
        ...layer,
        color: resolveCssColor(layer.color, element),
      })),
      // Every pane's colours have to be resolved too, or split view sends
      // Unity raw var() tokens it cannot parse.
      panes: state.panes.map((pane) => ({
        ...pane,
        layers: pane.layers.map((layer) => ({
          ...layer,
          color: resolveCssColor(layer.color, element),
        })),
        flameColor: resolveCssColor(pane.flameColor, element),
      })),
      glass: resolveCssColor(state.glass, element),
      background: resolveCssColor(state.background, element),
      flameColor: resolveCssColor(state.flameColor, element),
    };

    instance.SendMessage(UNITY_BRIDGE_OBJECT, "SetState", JSON.stringify(payload));
  }, [instanceRef, state]);

  // Push a fresh snapshot whenever the state changes, and once more as soon
  // as the instance reports ready — the player boots after the first few
  // renders, so those early snapshots would otherwise be lost.
  useEffect(() => {
    if (status !== "ready") return;
    sendState();
  }, [sendState, status]);

  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<UnityWorkbenchEvent>).detail;
      if (!detail) return;

      if (detail.type === "ready") {
        sendState();
        return;
      }

      if (detail.type === "drop" && detail.accepted) {
        const sampleId = detail.sample ? (detail.sample as SampleId) : undefined;

        if (detail.payload === SAMPLE_PAYLOAD) {
          if (detail.target === "watchglass") handlersRef.current.onSampleDrop(sampleId);
          return;
        }

        if (detail.target === "tube") {
          handlersRef.current.onReagentDrop(detail.payload as ReagentId, sampleId);
        }
      }
    };

    window.addEventListener(UNITY_EVENT_NAME, handle);
    return () => window.removeEventListener(UNITY_EVENT_NAME, handle);
  }, [sendState]);

  const split = state.layout === "split";
  const widths = state.panes.map(() => 1 / state.panes.length);

  /** Left edge of each pane as a fraction of the canvas, plus the trailing 1. */
  const edges = widths.reduce<number[]>(
    (acc, width) => [...acc, acc[acc.length - 1] + width],
    [0],
  );

  const paneAt = (clientX: number) => {
    const element = containerRef.current;
    if (!element || !split) return null;

    const rect = element.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    for (let i = 0; i < state.panes.length; i++) {
      if (fraction >= edges[i] && fraction < edges[i + 1]) return state.panes[i].sample;
    }
    return state.panes[state.panes.length - 1]?.sample ?? null;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const reagentId = event.dataTransfer.getData("application/x-reagent");
    const sample = event.dataTransfer.getData("application/x-sample-dropper");
    const payload: DropPayload | "" = reagentId
      ? (reagentId as ReagentId)
      : sample
        ? SAMPLE_PAYLOAD
        : "";

    if (!payload) return;

    const instance = instanceRef.current;
    const element = containerRef.current;
    if (!instance || !element) return;

    // The pane a drop lands in becomes the selected one, so the toolbar acts on
    // the bench the user just used.
    const dropped = paneAt(event.clientX);
    if (dropped) onSelectSample(dropped);

    // HTML5 drag events never reach Unity's own input system, so the browser
    // has to say where the drop landed. Coordinates go over normalised, with
    // the DOM's top-left origin, and the C# side flips them into screen space.
    const rect = element.getBoundingClientRect();
    instance.SendMessage(
      UNITY_BRIDGE_OBJECT,
      "DropAt",
      JSON.stringify({
        payload,
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      }),
    );
  };

  if (status === "error") {
    return (
      <>
        {fallback}
        <p className="absolute bottom-2 left-2 right-2 text-[10px] leading-tight text-[var(--sim-neutral-600)]">
          3D workbench unavailable, showing the 2D bench instead. {error}
        </p>
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDragOver(true);
        // Dragging into a pane selects it, so the drop and the toolbar act on
        // the bench the user is actually pointing at.
        const hovered = paneAt(event.clientX);
        if (hovered && hovered !== state.sample) onSelectSample(hovered);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onPointerDown={(event) => {
        const clicked = paneAt(event.clientX);
        if (clicked) onSelectSample(clicked);
      }}
    >
      <canvas
        ref={canvasRef}
        // Required, not cosmetic: Unity's input layer looks the canvas back up
        // with document.querySelector("#" + canvas.id), so an id-less canvas
        // throws while registering keyboard callbacks and the whole instance
        // fails to start.
        id="unity-canvas"
        className="block w-full h-full"
        // Unity sizes its drawing buffer from the element's CSS box, so the
        // canvas must be laid out before the instance is created.
        style={{ outline: isDragOver ? "3px dashed var(--sim-accent-700)" : "none" }}
      />

      {split && status === "ready" && (
        <>
          {state.panes.map((pane, index) => (
            <div
              key={pane.sample}
              // Frames the pane the toolbar acts on. Pointer events pass through
              // so it never eats a drop.
              className="absolute top-0 bottom-0 pointer-events-none transition-[border-color] duration-100"
              style={{
                left: `${edges[index] * 100}%`,
                width: `${widths[index] * 100}%`,
                border: pane.active
                  ? "3px solid var(--sim-accent-500)"
                  : "3px solid transparent",
              }}
            />
          ))}

          {state.panes.slice(0, -1).map((pane, index) => (
            <div
              key={`divider-${pane.sample}`}
              // A plain separator: panes are fixed equal shares, so it is not a
              // handle and must not swallow drops.
              className="absolute top-0 bottom-0 w-[3px] -ml-[1px] pointer-events-none bg-[var(--sim-border)]"
              style={{ left: `${edges[index + 1] * 100}%` }}
            />
          ))}
        </>
      )}

      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--sim-panel-bg)]">
          <div className="h-1.5 w-40 overflow-hidden bg-[var(--sim-neutral-200)]">
            <div
              className="h-full bg-[var(--sim-accent-500)] transition-[width] duration-200"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[var(--sim-neutral-600)]">Loading workbench…</p>
        </div>
      )}
    </div>
  );
}
