import { useState, useEffect } from "react";
import { CollisionSimModel } from "@/lib/labs/collision/models/CollisionSimModel";
import BodyCard from "./BodyCard";
import Table from "./Table";

interface BodyCardsProps {
  simulation: CollisionSimModel;
}

export default function BodyCards({ simulation }: BodyCardsProps) {
  const [bodies, setBodies] = useState(simulation.getBodies());

  useEffect(() => {
    // Update the state whenever the simulation updates
    const interval = setInterval(() => {
      setBodies([...simulation.getBodies()]);
    }, 60);

    return () => clearInterval(interval);
  }, [simulation]);

  const handleMassChange = (index: number, newMass: number) => {
    simulation.updateBodyMass(index, newMass);
    setBodies([...simulation.getBodies()]);
    simulation.restart();
  };

  const handleVelocityChange = (index: number, newVelocity: number) => {
    simulation.updateBodyInitialVelocity(index, newVelocity);
    setBodies([...simulation.getBodies()]);
    simulation.restart();
  };

  const handlePositionChange = (index: number, newPosition: number) => {
    simulation.updateBodyInitialPosition(index, newPosition);
    setBodies([...simulation.getBodies()]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 relative -top-74.25 max-w-300 max-h-73.75 overflow-y-hidden py-3 px-5">
      <div className="grid grid-rows-2 gap-4 sm:grid-rows-2 col-span-1">
        {bodies.map((body, index) => (
          <BodyCard
            key={index}
            body={body}
            index={index}
            onMassChange={handleMassChange}
            onVelocityChange={handleVelocityChange}
            onPositionChange={handlePositionChange}
            isMoving={simulation.isMoving}
          />
        ))}
      </div>
      <div className="col-span-2">
        <Table bodies={bodies} />
      </div>
    </div>
  );
}
