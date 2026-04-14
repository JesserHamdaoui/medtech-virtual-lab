import { CollisionSimModel } from "@/lib/labs/collision/models/CollisionSimModel";
import sketchBody from "@/lib/labs/collision/sketches/sketchBody";
import Parameters from "./Parameters";
import { sketchGround } from "@/lib/labs/collision/sketches/sketchGround";
import BodyCards from "./BodyCards";
import { useEffect, useRef, useState } from "react";
import P5 from "p5";
import { useKeyboardControls } from "@/components/labs/shared";
import { PROPERTY_BOUNDAERIES } from "@/lib/labs/collision/constants/config";
import { Elasticity } from "@/lib/labs/collision/types/Elasticity";
import { TimeSpeed } from "@/lib/labs/collision/types/TimeSpeed";
import {
  isCollisionLabId,
  LAB_ASSISTANT_CONTROL_EVENT,
  LabAssistantControlDetail,
} from "@/components/labs/assistant/events";
// import Stopwatch from "./Stopwatch";

export default function Simulation() {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const p5Instance = useRef<P5 | null>(null);
  const keyState = useKeyboardControls();

  const [simulation] = useState(() => new CollisionSimModel(0.01, 300));

  useEffect(() => {
    if (simulation.isMoving) {
      return;
    }

    const bodies = simulation.getBodies();

    if (keyState.w1Increase) {
      simulation.updateBodyMass(
        0,
        Math.min(bodies[0].mass + 0.05, PROPERTY_BOUNDAERIES.mass.max),
      );
    }
    if (keyState.w1Decrease) {
      simulation.updateBodyMass(
        0,
        Math.max(bodies[0].mass - 0.05, PROPERTY_BOUNDAERIES.mass.min),
      );
    }

    if (keyState.w2Increase) {
      simulation.updateBodyInitialVelocity(
        0,
        Math.min(
          bodies[0].initialVelocity + 10,
          PROPERTY_BOUNDAERIES.velocity.max,
        ),
      );
      simulation.updateBodyVelocity(
        0,
        Math.min(bodies[0].velocity + 10, PROPERTY_BOUNDAERIES.velocity.max),
      );
    }
    if (keyState.w2Decrease) {
      simulation.updateBodyInitialVelocity(
        0,
        Math.max(
          bodies[0].initialVelocity - 10,
          PROPERTY_BOUNDAERIES.velocity.min,
        ),
      );
      simulation.updateBodyVelocity(
        0,
        Math.max(bodies[0].velocity - 10, PROPERTY_BOUNDAERIES.velocity.min),
      );
    }

    if (keyState.w3Increase) {
      simulation.updateBodyMass(
        1,
        Math.min(bodies[1].mass + 0.05, PROPERTY_BOUNDAERIES.mass.max),
      );
    }
    if (keyState.w3Decrease) {
      simulation.updateBodyMass(
        1,
        Math.max(bodies[1].mass - 0.05, PROPERTY_BOUNDAERIES.mass.min),
      );
    }

    if (keyState.w4Increase) {
      simulation.updateBodyInitialVelocity(
        1,
        Math.min(
          bodies[1].initialVelocity + 10,
          PROPERTY_BOUNDAERIES.velocity.max,
        ),
      );
      simulation.updateBodyVelocity(
        1,
        Math.min(bodies[1].velocity + 10, PROPERTY_BOUNDAERIES.velocity.max),
      );
    }
    if (keyState.w4Decrease) {
      simulation.updateBodyInitialVelocity(
        1,
        Math.max(
          bodies[1].initialVelocity - 10,
          PROPERTY_BOUNDAERIES.velocity.min,
        ),
      );
      simulation.updateBodyVelocity(
        1,
        Math.max(bodies[1].velocity - 10, PROPERTY_BOUNDAERIES.velocity.min),
      );
    }
  }, [keyState, simulation]);

  useEffect(() => {
    if (!canvasHostRef.current) {
      return;
    }

    const sketch = (p5: P5) => {
      const getCanvasWidth = () =>
        Math.min(canvasHostRef.current?.clientWidth ?? 1200, 1200);

      p5.setup = () => {
        const width = getCanvasWidth();
        const height = 600;
        p5.createCanvas(width, height).parent(canvasHostRef.current!);
      };

      p5.draw = () => {
        p5.background(232, 243, 246);
        sketchGround(p5, 300);

        for (const body of simulation.getBodies()) {
          sketchBody(p5, body);
        }

        simulation.update();
      };

      p5.windowResized = () => {
        const width = getCanvasWidth();
        const height = 600;
        p5.resizeCanvas(width, height);
      };
    };

    p5Instance.current = new P5(sketch, canvasHostRef.current);

    return () => {
      p5Instance.current?.remove();
      p5Instance.current = null;
    };
  }, [simulation]);

  useEffect(() => {
    const handleAssistantControl = (event: Event) => {
      const customEvent = event as CustomEvent<LabAssistantControlDetail>;
      if (!customEvent.detail || !isCollisionLabId(customEvent.detail.labId)) {
        return;
      }

      const action = customEvent.detail.action as {
        action?: string;
        bodyIndex?: number;
        value?: number | string;
        steps?: number;
      };

      if (!action.action) {
        return;
      }

      switch (action.action) {
        case "start":
          simulation.updateIsMoving(true);
          break;
        case "pause":
          simulation.updateIsMoving(false);
          break;
        case "toggle_play":
          simulation.updateIsMoving(!simulation.isMoving);
          break;
        case "restart":
          simulation.restart();
          break;
        case "step": {
          const steps = Math.max(1, Math.floor(action.steps ?? 1));
          const wasMoving = simulation.isMoving;
          simulation.updateIsMoving(true);
          for (let index = 0; index < steps; index += 1) {
            simulation.update();
          }
          simulation.updateIsMoving(wasMoving);
          break;
        }
        case "set_elasticity":
          if (action.value === "elastic") {
            simulation.updateElasticity(Elasticity.ELASTIC);
          }
          if (action.value === "inelastic") {
            simulation.updateElasticity(Elasticity.INELASTIC);
          }
          break;
        case "set_time_speed":
          if (action.value === "normal") {
            simulation.updateTimeSpeed(TimeSpeed.NORMAL);
          }
          if (action.value === "slow") {
            simulation.updateTimeSpeed(TimeSpeed.SLOW);
          }
          break;
        case "set_body_mass":
          if (
            typeof action.bodyIndex === "number" &&
            typeof action.value === "number"
          ) {
            simulation.updateBodyMass(action.bodyIndex, action.value);
          }
          break;
        case "set_body_velocity":
          if (
            typeof action.bodyIndex === "number" &&
            typeof action.value === "number"
          ) {
            simulation.updateBodyVelocity(action.bodyIndex, action.value);
            simulation.updateBodyInitialVelocity(
              action.bodyIndex,
              action.value,
            );
          }
          break;
        case "set_body_position":
          if (
            typeof action.bodyIndex === "number" &&
            typeof action.value === "number"
          ) {
            simulation.updateBodyPosition(action.bodyIndex, action.value);
            simulation.updateBodyInitialPosition(
              action.bodyIndex,
              action.value,
            );
          }
          break;
        default:
          break;
      }
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
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div ref={canvasHostRef} style={{ display: "block" }} />

      <Parameters simulation={simulation} keyState={keyState} />
      <BodyCards simulation={simulation} />
      {/* <Stopwatch simulation={simulation} /> */}
    </div>
  );
}
