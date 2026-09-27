"use client";

import { useState } from "react";
import {
  ReagentId,
  TestId,
  TestSessionState,
  TESTS,
  TEST_CATEGORY_LABELS,
  TestCategory,
  testSessionHasActivity,
  getTestProgress,
} from "./types";
import TestSection from "./TestSection";
import SolubilityTestPanel from "./SolubilityTestPanel";
import ReagentTestPanel from "./ReagentTestPanel";
import CombustionTestPanel from "./CombustionTestPanel";
import TestInstructionsModal from "./TestInstructionsModal";

interface TestSidebarProps {
  session: TestSessionState;
  openTest: TestId | null;
  onToggleTest: (testId: TestId) => void;
  sampleLabel: string;
  /** What the dropper on the 3D bench is holding, if anything. */
  dropper: string;
  /** Puts a reagent's dropper on the bench. */
  onPickReagent: (reagentId: ReagentId) => void;
  /** Puts the sample's own dropper on the bench, for combustion. */
  onPickSample: () => void;
}

export default function TestSidebar({
  session,
  openTest,
  onToggleTest,
  sampleLabel,
  dropper,
  onPickReagent,
  onPickSample,
}: TestSidebarProps) {
  const [instructionsTest, setInstructionsTest] = useState<TestId | null>(null);
  const activeInstructions = TESTS.find((test) => test.id === instructionsTest);

  const categories: TestCategory[] = ["physical", "chemical"];

  return (
    <div className="w-full md:w-72 shrink-0 border-2 border-[var(--sim-border)] bg-[var(--sim-panel-bg)]">
      {categories.map((category) => (
        <div key={category}>
          <div className="px-4 py-2 bg-[var(--sim-neutral-100)] border-b-2 border-[var(--sim-border)] text-[11px] font-bold tracking-widest text-[var(--sim-neutral-600)] uppercase">
            {TEST_CATEGORY_LABELS[category]}
          </div>
          {TESTS.filter((test) => test.category === category).map((test) => (
            <TestSection
              key={test.id}
              label={test.label}
              isOpen={openTest === test.id}
              hasActivity={testSessionHasActivity(session, test.id)}
              progress={getTestProgress(session, test.id)}
              onToggle={() => onToggleTest(test.id)}
              onShowInstructions={() => setInstructionsTest(test.id)}
            >
              {test.id === "solubility" && (
                <SolubilityTestPanel
                  dropper={dropper}
                  onPick={onPickReagent}
                />
              )}
              {test.id === "bromine" && (
                <ReagentTestPanel
                  reagentId="bromine"
                  dropper={dropper}
                  onPick={onPickReagent}
                />
              )}
              {test.id === "kmno4" && (
                <ReagentTestPanel
                  reagentId="kmno4"
                  dropper={dropper}
                  onPick={onPickReagent}
                />
              )}
              {test.id === "h2so4" && (
                <ReagentTestPanel
                  reagentId="h2so4"
                  dropper={dropper}
                  onPick={onPickReagent}
                />
              )}
              {test.id === "combustion" && (
                <CombustionTestPanel
                  sampleLabel={sampleLabel}
                  dropper={dropper}
                  onPick={onPickSample}
                />
              )}
            </TestSection>
          ))}
        </div>
      ))}

      {activeInstructions && (
        <TestInstructionsModal
          testLabel={activeInstructions.label}
          procedures={activeInstructions.procedures}
          onClose={() => setInstructionsTest(null)}
        />
      )}
    </div>
  );
}
