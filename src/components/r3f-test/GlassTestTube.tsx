"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface GlassTestTubeProps {
  fillLevel: number; // 0..1
  liquidColor: string;
  heat: "none" | "noticeable" | "high";
  position?: [number, number, number];
}

const TUBE_RADIUS = 0.5;
const TUBE_HEIGHT = 3.2;
const TUBE_INNER_RADIUS = 0.42;
const LIQUID_MAX_HEIGHT = 2.7;

export default function GlassTestTube({
  fillLevel,
  liquidColor,
  heat,
  position = [0, 0, 0],
}: GlassTestTubeProps) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const bubbleGroupRef = useRef<THREE.Group>(null);

  const liquidHeight = Math.max(fillLevel, 0.001) * LIQUID_MAX_HEIGHT;

  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        x: (Math.random() - 0.5) * TUBE_INNER_RADIUS * 1.2,
        z: (Math.random() - 0.5) * TUBE_INNER_RADIUS * 1.2,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * 10,
        scale: 0.03 + Math.random() * 0.04,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (heat === "none" || !bubbleGroupRef.current) return;
    const t = clock.getElapsedTime();
    const speedMul = heat === "high" ? 1.8 : 1;
    bubbleGroupRef.current.children.forEach((child, i) => {
      const seed = bubbleSeeds[i];
      const cycle = ((t * seed.speed * speedMul + seed.offset) % 2) / 2;
      child.position.y = -TUBE_HEIGHT / 2 + 0.3 + cycle * liquidHeight;
      child.visible = cycle * liquidHeight < liquidHeight - 0.05;
    });
  });

  return (
    <group position={position}>
      {/* rounded bottom cap */}
      <mesh position={[0, -TUBE_HEIGHT / 2, 0]}>
        <sphereGeometry args={[TUBE_RADIUS, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#dfe9ec"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={0.3}
          ior={1.45}
          clearcoat={1}
        />
      </mesh>

      {/* tube wall */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[TUBE_RADIUS, TUBE_RADIUS, TUBE_HEIGHT, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#dfe9ec"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={0.3}
          ior={1.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* liquid */}
      {fillLevel > 0 && (
        <mesh
          ref={liquidRef}
          position={[0, -TUBE_HEIGHT / 2 + liquidHeight / 2 + 0.15, 0]}
        >
          <cylinderGeometry args={[TUBE_INNER_RADIUS, TUBE_INNER_RADIUS, liquidHeight, 48]} />
          <meshPhysicalMaterial
            color={liquidColor}
            transparent
            opacity={0.85}
            roughness={0.15}
            transmission={0.4}
            thickness={0.5}
            emissive={heat === "high" ? liquidColor : "#000000"}
            emissiveIntensity={heat === "high" ? 0.15 : 0}
          />
        </mesh>
      )}

      {/* bubbles when heated */}
      {heat !== "none" && fillLevel > 0 && (
        <group ref={bubbleGroupRef}>
          {bubbleSeeds.map((seed, i) => (
            <mesh key={i} position={[seed.x, 0, seed.z]}>
              <sphereGeometry args={[seed.scale, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* rim */}
      <mesh position={[0, TUBE_HEIGHT / 2, 0]}>
        <torusGeometry args={[TUBE_RADIUS, 0.03, 16, 48]} />
        <meshPhysicalMaterial
          color="#dfe9ec"
          transparent
          opacity={0.4}
          roughness={0.1}
          transmission={0.8}
        />
      </mesh>
    </group>
  );
}
