"use client";

import { ReagentId, TestId, TestSessionState, TESTS, testSessionHasActivity } from "./types";
import TestSection from "./TestSection";
import SolubilityTestPanel from "./SolubilityTestPanel";
import ReagentTestPanel from "./ReagentTestPanel";
import CombustionTestPanel from "./CombustionTestPanel";

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
  return (
    <div className="w-full md:w-72 shrink-0 border-2 border-[var(--sim-border)] bg-[var(--sim-panel-bg)]">
      {TESTS.map((test) => (
        <TestSection
          key={test.id}
          label={test.label}
          isOpen={openTest === test.id}
          hasActivity={testSessionHasActivity(session, test.id)}
          onToggle={() => onToggleTest(test.id)}
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
  );
}
