import { useState, useEffect, useCallback } from "react";
import { SimulationModel } from "@/lib/labs/coulombs-law/models/SimulationModel";
import ChargeCard from "./ChargeCard";
import { Card } from "./ui/Card";
import Slider from "./ui/Slider";
import {
  SettingsProps,
  SimulationProps,
} from "@/lib/labs/coulombs-law/constants/simulationConstants";
import MetricBadge from "./ui/MetricBadge";
import { KeyboardState, useFullscreen } from "@/components/labs/shared";

interface ChargeCardsProps {
  simulation: SimulationModel;
  keyState: KeyboardState;
  externalUpdateSignal?: number;
}

export default function ChargeCards({
  simulation,
  keyState,
  externalUpdateSignal = 0,
}: ChargeCardsProps) {
  const { isFullscreen } = useFullscreen();

  const [distance, setDistance] = useState(simulation.distance);
  const [chargeA, setChargeA] = useState(simulation.chargeModelA.charge);
  const [chargeB, setChargeB] = useState(simulation.chargeModelB.charge);
  const [exercisedForceA, setExercisedForceA] = useState(
    simulation.chargeModelA.exercisedForce,
  );
  const [exercisedForceB, setExercisedForceB] = useState(
    simulation.chargeModelB.exercisedForce,
  );

  const syncFromSimulation = useCallback(() => {
    setDistance((previous) => {
      const next = simulation.distance;
      return Object.is(previous, next) ? previous : next;
    });
    setChargeA((previous) => {
      const next = simulation.chargeModelA.charge;
      return Object.is(previous, next) ? previous : next;
    });
    setChargeB((previous) => {
      const next = simulation.chargeModelB.charge;
      return Object.is(previous, next) ? previous : next;
    });
    setExercisedForceA((previous) => {
      const next = simulation.chargeModelA.exercisedForce;
      return Object.is(previous, next) ? previous : next;
    });
    setExercisedForceB((previous) => {
      const next = simulation.chargeModelB.exercisedForce;
      return Object.is(previous, next) ? previous : next;
    });
  }, [simulation]);

  useEffect(() => {
    syncFromSimulation();
  }, [syncFromSimulation, externalUpdateSignal]);

  const handleChargeAChange = (newCharge: number) => {
    simulation.updateChargeA(newCharge);
    syncFromSimulation();
    if (isFullscreen) {
      simulation.updatePositions(window.innerWidth, window.innerHeight);
    }
  };

  const handleChargeBChange = (newCharge: number) => {
    simulation.updateChargeB(newCharge);
    syncFromSimulation();
    if (isFullscreen) {
      simulation.updatePositions(window.innerWidth, window.innerHeight);
    }
  };

  const handleDistanceChange = (newDistance: number) => {
    simulation.updateDistance(newDistance);
    syncFromSimulation();
    if (isFullscreen) {
      simulation.updatePositions(window.innerWidth, window.innerHeight);
    }
  };

  useEffect(() => {
    const chargeStep = 0.0000001;
    const distanceStep = 0.001;

    const hasWheelInput =
      keyState.w1Increase ||
      keyState.w1Decrease ||
      keyState.w2Increase ||
      keyState.w2Decrease ||
      keyState.w3Increase ||
      keyState.w3Decrease;

    if (!hasWheelInput) {
      return;
    }

    const interval = setInterval(() => {
      let changed = false;

      if (keyState.w1Increase) {
        const next = Math.min(
          simulation.chargeModelA.charge + chargeStep,
          SettingsProps.CHARGE_MAX,
        );
        simulation.updateChargeA(next);
        changed = true;
      }
      if (keyState.w1Decrease) {
        const next = Math.max(
          simulation.chargeModelA.charge - chargeStep,
          SettingsProps.CHARGE_MIN,
        );
        simulation.updateChargeA(next);
        changed = true;
      }

      if (keyState.w2Increase) {
        const next = Math.min(
          simulation.chargeModelB.charge + chargeStep,
          SettingsProps.CHARGE_MAX,
        );
        simulation.updateChargeB(next);
        changed = true;
      }
      if (keyState.w2Decrease) {
        const next = Math.max(
          simulation.chargeModelB.charge - chargeStep,
          SettingsProps.CHARGE_MIN,
        );
        simulation.updateChargeB(next);
        changed = true;
      }

      if (keyState.w3Increase) {
        const next = Math.min(
          simulation.distance + distanceStep,
          SettingsProps.DISTANCE_MAX,
        );
        simulation.updateDistance(next);
        changed = true;
      }
      if (keyState.w3Decrease) {
        const next = Math.max(
          simulation.distance - distanceStep,
          SettingsProps.DISTANCE_MIN,
        );
        simulation.updateDistance(next);
        changed = true;
      }

      if (changed && isFullscreen) {
        simulation.updatePositions(window.innerWidth, window.innerHeight);
      }

      if (changed) {
        syncFromSimulation();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [keyState, simulation, isFullscreen, syncFromSimulation]);

  return (
    <div
      className={`flex flex-row items-center justify-between ${
        isFullscreen ? "h-[300px] py-7 pr-10" : "h-[200px] py-3 pr-5"
      } bg-slate-100 px-3 gap-5 absolute bottom-0 left-0 right-0 z-10 rounded-t-lg shadow-md`}
      style={{
        width: isFullscreen ? "100%" : `${SimulationProps.SIMULATION_WIDTH}px`,
      }}
    >
      <div className="flex flex-row items-center gap-5">
        <ChargeCard
          name={simulation.chargeModelA.name}
          charge={chargeA}
          exercisedForce={exercisedForceA}
          handleChargeChange={handleChargeAChange}
          keyHint="w1"
        />
        <ChargeCard
          name={simulation.chargeModelB.name}
          charge={chargeB}
          exercisedForce={exercisedForceB}
          handleChargeChange={handleChargeBChange}
          keyHint="w2"
        />
      </div>
      <Card>
        <div
          className={`flex flex-col p-4 space-y-4 ${isFullscreen ? "gap-6" : ""}`}
        >
          <span
            className="text-lg text-[#2596be] font-semibold"
            style={isFullscreen ? { fontSize: "2rem" } : {}}
          >
            Simulation Controls
          </span>
          <div className={isFullscreen ? "space-y-6" : "space-y-3"}>
            <div className="relative">
              <span style={isFullscreen ? { fontSize: "1.5rem" } : {}}>
                Distance: <MetricBadge value={distance.toFixed(5)} unit="m" />
              </span>
              <span className="absolute -top-4 -right-1 rounded-full bg-primary-600/10 text-primary-700 border border-primary-600/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                w3
              </span>
            </div>
            <Slider
              min={SettingsProps.DISTANCE_MIN}
              max={SettingsProps.DISTANCE_MAX}
              minIndicator={`${SettingsProps.DISTANCE_MIN}m`}
              maxIndicator={`${SettingsProps.DISTANCE_MAX}m`}
              step={0.00001}
              initialValue={distance}
              onChange={handleDistanceChange}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
