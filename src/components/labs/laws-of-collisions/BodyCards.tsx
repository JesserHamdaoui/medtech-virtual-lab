"use client";

import { CollisionSimModel } from "./CollisionSimModel";
import { BodyModel } from "./BodyModel";
import BodyCard from "./BodyCard";
import Table from "./Table";
import { useProperty } from "@/lib/sims/core/useProperty";

interface BodyCardsProps {
  simulation: CollisionSimModel;
}

function useBodySnapshot(body: BodyModel) {
  useProperty(body.getMassProperty());
  useProperty(body.getVelocityProperty());
  useProperty(body.getPositionProperty());
  useProperty(body.getCollidedProperty());
  return body;
}

export default function BodyCards({ simulation }: BodyCardsProps) {
  const bodies = simulation.getBodies();
  const [body1, body2] = bodies;
  useBodySnapshot(body1);
  useBodySnapshot(body2);
  const isMoving = useProperty(simulation.getIsMovingProperty());

  const handleMassChange = (index: number, newMass: number) => {
    simulation.updateBodyMass(index, newMass);
    simulation.restart();
  };

  const handleVelocityChange = (index: number, newVelocity: number) => {
    simulation.updateBodyInitialVelocity(index, newVelocity);
    simulation.restart();
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 relative -top-[297px] max-w-[1200px] max-h-[295px] overflow-y-hidden py-3 px-5">
      <div className="grid grid-rows-2 gap-4 sm:grid-rows-2 col-span-1">
        {bodies.map((body, index) => (
          <BodyCard
            key={index}
            body={body}
            index={index}
            onMassChange={handleMassChange}
            onVelocityChange={handleVelocityChange}
            isMoving={isMoving}
          />
        ))}
      </div>
      <div className="col-span-2">
        <Table bodies={bodies} />
      </div>
    </div>
  );
}
