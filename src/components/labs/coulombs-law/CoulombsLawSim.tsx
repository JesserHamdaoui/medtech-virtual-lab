"use client";

import { useState } from "react";
import { SimulationModel } from "./SimulationModel";
import { SimulationProps } from "./constants";
import drawCharge from "./sketch/drawCharge";
import drawRuler from "./sketch/drawRuler";
import ChargeCards from "./ChargeCards";
import { useP5Sketch } from "@/lib/sims/core/useP5Sketch";
import SimLoader from "../shared/SimLoader";

export default function CoulombsLawSim() {
  const [simulation] = useState(() => new SimulationModel());
  const [chargeA] = useState(simulation.chargeModelA);
  const [chargeB] = useState(simulation.chargeModelB);

  const { containerRef, ready } = useP5Sketch({
    setup: (p5, container) => {
      p5.createCanvas(container.clientWidth, SimulationProps.SIMULATION_HEIGHT).parent(
        container,
      );
      p5.background(0);
      p5.frameRate(60);
      simulation.updatePositions(container.clientWidth);
    },
    draw: (p5) => {
      p5.background(0);
      drawRuler(p5);
      drawCharge(p5, chargeA);
      drawCharge(p5, chargeB);
    },
    containerResized: (p5, width) => {
      p5.resizeCanvas(width, SimulationProps.SIMULATION_HEIGHT);
      simulation.updatePositions(width);
    },
  });

  return (
    <div className="relative w-full max-h-[600px] border-2 border-[#2596be] rounded-lg shadow-lg bg-white overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 z-20">
          <SimLoader />
        </div>
      )}

      <div ref={containerRef} style={{ display: "block" }} />

      {ready && <ChargeCards simulation={simulation} />}
    </div>
  );
}
