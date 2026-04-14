import { useEffect, useRef, useState } from "react";
import { SimulationModel } from "@/lib/labs/coulombs-law/models/SimulationModel";
import { SimulationProps } from "@/lib/labs/coulombs-law/constants/simulationConstants";
import sketchCharge from "@/lib/labs/coulombs-law/sketches/sketchCharge";
import ChargeCards from "./ChargeCards";
import P5 from "p5";
import sketchRuler from "@/lib/labs/coulombs-law/sketches/sketchRuler";
import { useKeyboardControls } from "@/components/labs/shared";
import {
  LAB_ASSISTANT_CONTROL_EVENT,
  LabAssistantControlDetail,
} from "@/components/labs/assistant/events";

export default function Simulation() {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const p5Instance = useRef<P5 | null>(null);
  const keyState = useKeyboardControls();
  const [externalUpdateSignal, setExternalUpdateSignal] = useState(0);

  const [simulation] = useState(() => new SimulationModel());
  const [chargeA] = useState(simulation.chargeModelA);
  const [chargeB] = useState(simulation.chargeModelB);

  // Handle keyboard controls
  useEffect(() => {
    if (!canvasHostRef.current) {
      return;
    }

    const sketch = (pt: P5) => {
      const getCanvasSize = () => ({
        width: SimulationProps.SIMULATION_WIDTH,
        height: SimulationProps.SIMULATION_HEIGHT,
      });

      pt.setup = () => {
        const { width, height } = getCanvasSize();
        pt.createCanvas(width, height).parent(canvasHostRef.current!);
        pt.background(0);
        pt.frameRate(60);
      };

      pt.draw = () => {
        pt.background(0);
        sketchRuler(pt, false);
        sketchCharge(pt, chargeA, false);
        sketchCharge(pt, chargeB, false);
      };

      pt.windowResized = () => {
        const { width, height } = getCanvasSize();
        pt.resizeCanvas(width, height);
        simulation.updatePositions(width, height);
      };
    };

    p5Instance.current = new P5(sketch, canvasHostRef.current);

    return () => {
      p5Instance.current?.remove();
      p5Instance.current = null;
    };
  }, [chargeA, chargeB, simulation]);

  useEffect(() => {
    const handleAssistantControl = (event: Event) => {
      const customEvent = event as CustomEvent<LabAssistantControlDetail>;
      if (!customEvent.detail || customEvent.detail.labId !== "coulombs-law") {
        return;
      }

      const action = customEvent.detail.action as {
        action?: string;
        value?: number;
      };

      if (!action.action) {
        return;
      }

      switch (action.action) {
        case "reset":
          simulation.updateDistance(0.06);
          simulation.updateChargeA(-5e-6);
          simulation.updateChargeB(10e-6);
          break;
        case "set_distance":
          if (typeof action.value === "number") {
            simulation.updateDistance(action.value);
          }
          break;
        case "nudge_distance":
          if (typeof action.value === "number") {
            simulation.updateDistance(simulation.distance + action.value);
          }
          break;
        case "set_charge_a":
          if (typeof action.value === "number") {
            simulation.updateChargeA(action.value);
          }
          break;
        case "set_charge_b":
          if (typeof action.value === "number") {
            simulation.updateChargeB(action.value);
          }
          break;
        case "nudge_charge_a":
          if (typeof action.value === "number") {
            simulation.updateChargeA(
              simulation.chargeModelA.charge + action.value,
            );
          }
          break;
        case "nudge_charge_b":
          if (typeof action.value === "number") {
            simulation.updateChargeB(
              simulation.chargeModelB.charge + action.value,
            );
          }
          break;
        default:
          break;
      }

      simulation.updatePositions(window.innerWidth, window.innerHeight);
      setExternalUpdateSignal((previous) => previous + 1);
    };

    window.addEventListener(
      LAB_ASSISTANT_CONTROL_EVENT,
      handleAssistantControl,
    );

    return () => {
      window.removeEventListener(
        LAB_ASSISTANT_CONTROL_EVENT,
        handleAssistantControl,
      );
    };
  }, [simulation]);

  return (
    <div className="relative bg-white">
      <div ref={canvasHostRef} style={{ display: "block" }} />

      <ChargeCards
        simulation={simulation}
        keyState={keyState}
        externalUpdateSignal={externalUpdateSignal}
      />
    </div>
  );
}
