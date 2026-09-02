"use client";

import { CollisionSimModel } from "./CollisionSimModel";
import drawBody from "./sketch/drawBody";
import { drawGround } from "./sketch/drawGround";
import Parameters from "./Parameters";
import BodyCards from "./BodyCards";
import { useState } from "react";
import { useP5Sketch } from "@/lib/sims/core/useP5Sketch";
import SimLoader from "../shared/SimLoader";

export default function CollisionSim() {
  const [simulation] = useState(() => new CollisionSimModel(0.01, 300));

  const { containerRef, ready } = useP5Sketch({
    setup: (p5, container) => {
      p5.createCanvas(container.clientWidth, 600).parent(container);
    },
    draw: (p5) => {
      p5.background(232, 243, 246);

      drawGround(p5, 300);

      for (const body of simulation.getBodies()) {
        drawBody(p5, body);
      }

      simulation.update();
    },
    containerResized: (p5, width) => {
      p5.resizeCanvas(width, 600);
    },
  });

  return (
    <div className="relative bg-white w-full max-h-[600px]">
      {!ready && (
        <div className="absolute inset-0 z-20">
          <SimLoader />
        </div>
      )}

      <div ref={containerRef} style={{ display: "block" }} />

      {ready && (
        <>
          <Parameters simulation={simulation} />
          <BodyCards simulation={simulation} />
        </>
      )}
    </div>
  );
}
