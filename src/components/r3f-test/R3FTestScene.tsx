"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import GlassTestTube from "./GlassTestTube";
import GlassWatchGlass from "./GlassWatchGlass";

type HeatLevel = "none" | "noticeable" | "high";

const COLOR_PRESETS = [
  { label: "Clear", value: "#eaf4f6" },
  { label: "Orange (bromine test)", value: "#e8933a" },
  { label: "Purple (KMnO4)", value: "#8a4fbf" },
  { label: "Brown residue", value: "#8a5a2b" },
];

export default function R3FTestScene() {
  const [fillLevel, setFillLevel] = useState(0.6);
  const [liquidColor, setLiquidColor] = useState(COLOR_PRESETS[0].value);
  const [heat, setHeat] = useState<HeatLevel>("none");
  const [puddleScale, setPuddleScale] = useState(0.5);
  const [ignited, setIgnited] = useState(false);
  const [showTube, setShowTube] = useState(true);

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="relative flex-1 bg-[#0e1013]">
        <Canvas camera={{ position: [3, 2, 5], fov: 40 }} shadows>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
          <Environment preset="studio" />
          {showTube ? (
            <GlassTestTube fillLevel={fillLevel} liquidColor={liquidColor} heat={heat} />
          ) : (
            <GlassWatchGlass puddleScale={puddleScale} liquidColor={liquidColor} ignited={ignited} />
          )}
          <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={10} blur={2} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
        </Canvas>
      </div>

      <div className="w-full shrink-0 space-y-4 overflow-y-auto border-t border-neutral-800 bg-[#15171b] p-5 text-sm text-neutral-200 md:h-full md:w-80 md:border-l md:border-t-0">
        <h2 className="text-base font-semibold text-white">R3F Glassware Test</h2>
        <p className="text-xs text-neutral-400">
          Standalone R3F sandbox, not wired to the real sim. For evaluating a 3D glassware
          look before porting.
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTube(true)}
            className={`flex-1 rounded px-3 py-1.5 text-xs font-medium ${
              showTube ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-300"
            }`}
          >
            Test Tube
          </button>
          <button
            onClick={() => setShowTube(false)}
            className={`flex-1 rounded px-3 py-1.5 text-xs font-medium ${
              !showTube ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-300"
            }`}
          >
            Watch Glass
          </button>
        </div>

        {showTube ? (
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Fill level: {fillLevel.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={fillLevel}
              onChange={(e) => setFillLevel(Number(e.target.value))}
              className="w-full"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Puddle scale: {puddleScale.toFixed(2)}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={puddleScale}
              onChange={(e) => setPuddleScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Liquid color</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setLiquidColor(preset.value)}
                className={`rounded border px-2 py-1 text-xs ${
                  liquidColor === preset.value
                    ? "border-blue-500 text-white"
                    : "border-neutral-700 text-neutral-300"
                }`}
                style={{ backgroundColor: preset.value + "33" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {showTube ? (
          <div className="space-y-1">
            <label className="text-xs text-neutral-400">Heat level</label>
            <div className="flex gap-2">
              {(["none", "noticeable", "high"] as HeatLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setHeat(level)}
                  className={`flex-1 rounded px-2 py-1 text-xs capitalize ${
                    heat === level ? "bg-orange-600 text-white" : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIgnited((v) => !v)}
            className={`w-full rounded px-3 py-1.5 text-xs font-medium ${
              ignited ? "bg-orange-600 text-white" : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {ignited ? "Extinguish" : "Ignite"}
          </button>
        )}
      </div>
    </div>
  );
}
