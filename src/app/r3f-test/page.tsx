"use client";

import dynamic from "next/dynamic";

const R3FTestScene = dynamic(() => import("@/components/r3f-test/R3FTestScene"), {
  ssr: false,
});

export default function R3FTestPage() {
  return (
    <div className="h-screen w-screen">
      <R3FTestScene />
    </div>
  );
}
