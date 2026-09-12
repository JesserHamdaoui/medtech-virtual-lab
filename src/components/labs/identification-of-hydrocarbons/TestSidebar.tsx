"use client";

import { useState } from "react";
import { TestId, TestSessionState, TESTS, testSessionHasActivity } from "./types";
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
}

export default function TestSidebar({
  session,
  openTest,
  onToggleTest,
  sampleLabel,
}: TestSidebarProps) {
  const [instructionsTest, setInstructionsTest] = useState<TestId | null>(null);
  const activeInstructions = TESTS.find((test) => test.id === instructionsTest);

  return (
    <div className="w-full md:w-72 shrink-0 border-2 border-[var(--sim-border)] bg-[var(--sim-panel-bg)]">
      {TESTS.map((test) => (
        <TestSection
          key={test.id}
          label={test.label}
          isOpen={openTest === test.id}
          hasActivity={testSessionHasActivity(session, test.id)}
          onToggle={() => onToggleTest(test.id)}
          onShowInstructions={() => setInstructionsTest(test.id)}
        >
          {test.id === "solubility" && <SolubilityTestPanel state={session.solubility} />}
          {test.id === "bromine" && (
            <ReagentTestPanel reagentId="bromine" drops={session.bromine} />
          )}
          {test.id === "kmno4" && <ReagentTestPanel reagentId="kmno4" drops={session.kmno4} />}
          {test.id === "h2so4" && <ReagentTestPanel reagentId="h2so4" drops={session.h2so4} />}
          {test.id === "combustion" && (
            <CombustionTestPanel sampleLabel={sampleLabel} drops={session.combustionDrops} />
          )}
        </TestSection>
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
