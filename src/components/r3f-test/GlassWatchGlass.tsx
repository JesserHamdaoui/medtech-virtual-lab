"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface GlassWatchGlassProps {
  puddleScale: number; // 0..1
  liquidColor: string;
  ignited: boolean;
  position?: [number, number, number];
}

const DISH_RADIUS = 1.6;

export default function GlassWatchGlass({
  puddleScale,
  liquidColor,
  ignited,
  position = [0, 0, 0],
}: GlassWatchGlassProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const smokeGroupRef = useRef<THREE.Group>(null);

  const dishProfile = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const x = Math.sin(t * Math.PI * 0.5) * DISH_RADIUS;
      const y = -Math.cos(t * Math.PI * 0.5) * 0.35;
      points.push(new THREE.Vector2(x, y));
    }
    return points;
  }, []);

  const smokeSeeds = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        x: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3,
        speed: 0.4 + Math.random() * 0.3,
        offset: Math.random() * 10,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      const flicker = 1 + Math.sin(t * 12) * 0.08 + Math.sin(t * 27) * 0.04;
      flameRef.current.scale.set(flicker, flicker * (1 + Math.sin(t * 9) * 0.1), flicker);
    }
    if (ignited && smokeGroupRef.current) {
      smokeGroupRef.current.children.forEach((child, i) => {
        const seed = smokeSeeds[i];
        const cycle = (t * seed.speed + seed.offset) % 3;
        child.position.set(seed.x + Math.sin(t + i) * 0.15, 0.3 + cycle * 0.8, seed.z);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.35 - cycle * 0.12);
        child.scale.setScalar(0.15 + cycle * 0.15);
      });
    }
  });

  return (
    <group position={position}>
      {/* dish */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <latheGeometry args={[dishProfile, 48]} />
        <meshPhysicalMaterial
          color="#dfe9ec"
          transparent
          opacity={0.2}
          roughness={0.05}
          transmission={0.95}
          thickness={0.2}
          ior={1.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* puddle */}
      {puddleScale > 0 && (
        <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[puddleScale, puddleScale, 1]}>
          <circleGeometry args={[DISH_RADIUS * 0.85, 48]} />
          <meshPhysicalMaterial
            color={liquidColor}
            transparent
            opacity={0.75}
            roughness={0.2}
            transmission={0.3}
          />
        </mesh>
      )}

      {/* flame */}
      {ignited && (
        <mesh ref={flameRef} position={[0, 0.15, 0]}>
          <coneGeometry args={[0.35, 0.9, 16]} />
          <meshBasicMaterial color="#f2a63c" transparent opacity={0.85} />
        </mesh>
      )}

      {/* smoke */}
      {ignited && (
        <group ref={smokeGroupRef}>
          {smokeSeeds.map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#888888" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
