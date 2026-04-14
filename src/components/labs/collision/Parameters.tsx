import { TimeSpeed } from "@/lib/labs/collision/types/TimeSpeed";
import { Elasticity } from "@/lib/labs/collision/types/Elasticity";
import { CollisionSimModel } from "@/lib/labs/collision/models/CollisionSimModel";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { KeyboardState } from "@/components/labs/shared";

interface ParametersProps {
  simulation: CollisionSimModel;
  keyState: KeyboardState;
}

export default function Parameters({ simulation, keyState }: ParametersProps) {
  const [isPlaying, setIsPlaying] = useState(simulation.isMoving);
  const handleChangeIsPlaying = () => {
    setIsPlaying(!isPlaying);
    simulation.updateIsMoving(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    simulation.restart();
  };

  const [timeSpeed, setTimeSpeed] = useState(simulation.timeSpeed);
  const handleChangeTimeSpeed = () => {
    const newSpeed =
      timeSpeed === TimeSpeed.NORMAL ? TimeSpeed.SLOW : TimeSpeed.NORMAL;
    setTimeSpeed(newSpeed);
    simulation.updateTimeSpeed(newSpeed);
  };

  const [elasticity, setElasticity] = useState(simulation.elasticity);
  const handleChangeElasticity = (newElasticity: Elasticity) => {
    setElasticity(newElasticity);
    simulation.updateElasticity(newElasticity);
  };

  const handleToggleElasticity = () => {
    const nextElasticity =
      elasticity === Elasticity.ELASTIC
        ? Elasticity.INELASTIC
        : Elasticity.ELASTIC;
    handleChangeElasticity(nextElasticity);
  };

  // Handle keyboard button presses
  useEffect(() => {
    if (keyState.b1) {
      const nextPlaying = !simulation.isMoving;
      setIsPlaying(nextPlaying);
      simulation.updateIsMoving(nextPlaying);
    }
    if (keyState.b2) {
      setIsPlaying(false);
      simulation.restart();
    }
    if (keyState.b3) {
      const newSpeed =
        simulation.timeSpeed === TimeSpeed.NORMAL
          ? TimeSpeed.SLOW
          : TimeSpeed.NORMAL;
      setTimeSpeed(newSpeed);
      simulation.updateTimeSpeed(newSpeed);
    }
    if (keyState.b4) {
      const nextElasticity =
        elasticity === Elasticity.ELASTIC
          ? Elasticity.INELASTIC
          : Elasticity.ELASTIC;
      setElasticity(nextElasticity);
      simulation.updateElasticity(nextElasticity);
    }
  }, [
    keyState.b1,
    keyState.b2,
    keyState.b3,
    keyState.b4,
    simulation,
    elasticity,
  ]);

  return (
    <div className="absolute top-10 z-20 ml-5 flex items-center shadow-md pr-4 bg-slate-100 border border-blue-300 max-h-16 rounded-xl max-w-125">
      <div className="relative">
        <Button
          handleClick={handleChangeIsPlaying}
          className="-ml-2"
          rounded
          size="lg"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </Button>
        <span className="absolute -top-4 -right-1 rounded-full bg-primary-600 text-white border border-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
          b1
        </span>
      </div>
      <div className="relative">
        <Button handleClick={handleRestart}>
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
        <span className="absolute -top-4 -right-1 rounded-full bg-primary-600 text-white border border-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
          b2
        </span>
      </div>
      <div className="relative">
        <Button handleClick={handleChangeTimeSpeed}>{`${timeSpeed}x`}</Button>
        <span className="absolute -top-4 -right-1 rounded-full bg-primary-600 text-white border border-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
          b3
        </span>
      </div>
      <div className="relative">
        <Button
          handleClick={handleToggleElasticity}
          disabled={simulation.isMoving}
        >
          {elasticity === Elasticity.ELASTIC ? "Elastic" : "Inelastic"}
        </Button>
        <span className="absolute -top-4 -right-1 rounded-full bg-primary-600 text-white border border-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
          b4
        </span>
      </div>
    </div>
  );
}
