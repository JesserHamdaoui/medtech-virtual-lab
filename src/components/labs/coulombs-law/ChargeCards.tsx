"use client";

import { SimulationModel } from "./SimulationModel";
import ChargeCard from "./ChargeCard";
import { Card } from "../shared/ui/Card";
import Slider from "../shared/ui/Slider";
import { SettingsProps } from "./constants";
import MetricBadge from "../shared/ui/MetricBadge";
import { useProperty } from "@/lib/sims/core/useProperty";

interface ChargeCardsProps {
  simulation: SimulationModel;
}

export default function ChargeCards({ simulation }: ChargeCardsProps) {
  const distance = useProperty(simulation.getDistanceProperty());
  const chargeA = useProperty(simulation.chargeModelA.getChargeProperty());
  const chargeB = useProperty(simulation.chargeModelB.getChargeProperty());
  const exercisedForceA = useProperty(
    simulation.chargeModelA.getExercisedForceProperty(),
  );
  const exercisedForceB = useProperty(
    simulation.chargeModelB.getExercisedForceProperty(),
  );

  const handleChargeAChange = (newCharge: number) => {
    simulation.updateChargeA(newCharge);
  };

  const handleChargeBChange = (newCharge: number) => {
    simulation.updateChargeB(newCharge);
  };

  const handleDistanceChange = (newDistance: number) => {
    simulation.updateDistance(newDistance);
  };

  return (
    <div className="flex flex-row items-center justify-between h-[200px] py-3 pr-5 bg-slate-100 px-3 gap-5 absolute bottom-0 left-0 right-0 z-10 rounded-t-lg shadow-md overflow-x-auto">
      <div className="flex flex-row items-center gap-5">
        <ChargeCard
          name={simulation.chargeModelA.name}
          charge={chargeA}
          exercisedForce={exercisedForceA}
          handleChargeChange={handleChargeAChange}
        />
        <ChargeCard
          name={simulation.chargeModelB.name}
          charge={chargeB}
          exercisedForce={exercisedForceB}
          handleChargeChange={handleChargeBChange}
        />
      </div>
      <Card>
        <div className="flex flex-col p-4 space-y-4">
          <span className="text-lg text-[#2596be] font-semibold">
            Simulation Controls
          </span>
          <div className="space-y-3">
            <div>
              <span>
                Distance: <MetricBadge value={distance.toFixed(2)} unit="m" />
              </span>
            </div>
            <Slider
              min={SettingsProps.DISTANCE_MIN}
              max={SettingsProps.DISTANCE_MAX}
              minIndicator={`${SettingsProps.DISTANCE_MIN}m`}
              maxIndicator={`${SettingsProps.DISTANCE_MAX}m`}
              step={0.01}
              initialValue={distance}
              onChange={handleDistanceChange}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
