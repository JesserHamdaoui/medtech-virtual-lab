"use client";

import { TimeSpeed, Elasticity } from "./types";
import { CollisionSimModel } from "./CollisionSimModel";
import ElasticitySelector from "./ElasticitySelector";
import Button from "../shared/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useProperty } from "@/lib/sims/core/useProperty";

interface ParametersProps {
  simulation: CollisionSimModel;
}

export default function Parameters({ simulation }: ParametersProps) {
  const isPlaying = useProperty(simulation.getIsMovingProperty());
  const timeSpeed = useProperty(simulation.getTimeSpeedProperty());
  const elasticity = useProperty(simulation.getElasticityProperty());

  const handleChangeIsPlaying = () => {
    simulation.updateIsMoving(!isPlaying);
  };

  const handleRestart = () => {
    simulation.restart();
  };

  const handleChangeTimeSpeed = () => {
    const newSpeed = timeSpeed === TimeSpeed.NORMAL ? TimeSpeed.SLOW : TimeSpeed.NORMAL;
    simulation.updateTimeSpeed(newSpeed);
  };

  const handleChangeElasticity = (newElasticity: Elasticity) => {
    simulation.updateElasticity(newElasticity);
  };

  return (
    <div className="absolute top-10 z-10 ml-5 flex items-center shadow-md pr-4 bg-slate-100 border border-blue-300 max-h-16 rounded-xl max-w-[500px]">
      <Button handleClick={handleChangeIsPlaying} className="-ml-2" size="lg">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </Button>
      <Button handleClick={handleRestart}>
        <FontAwesomeIcon icon={faRotateRight} />
      </Button>
      <Button handleClick={handleChangeTimeSpeed}>{`${timeSpeed}x`}</Button>
      <ElasticitySelector
        handleChangeElasticity={handleChangeElasticity}
        elasticity={elasticity}
        isMoving={isPlaying}
      />
    </div>
  );
}
