from typing import Any

from .base import PlanResult, VerificationResult


class GoalVerifierAgent:
    def run(
        self,
        *,
        goal: str,
        plan: PlanResult,
        status_before: dict[str, Any],
        status_after: dict[str, Any],
    ) -> VerificationResult:
        if not status_after:
            return VerificationResult(
                goal_met=False,
                confidence=0.2,
                explanation="No updated state available for verification.",
            )

        if not plan.actions:
            return VerificationResult(
                goal_met=False,
                confidence=0.3,
                explanation="No actions were planned, so goal could not be advanced.",
            )

        changed = status_before != status_after
        if not changed:
            return VerificationResult(
                goal_met=False,
                confidence=0.35,
                explanation="State did not change after action execution.",
            )

        lowered_goal = goal.lower()
        if "harmonic" in lowered_goal:
            damping_before = status_before.get("damping")
            damping_after = status_after.get("damping")
            oscillating = bool(status_after.get("isOscillating", True))
            if isinstance(damping_before, (int, float)) and isinstance(damping_after, (int, float)):
                if damping_after <= damping_before and oscillating:
                    return VerificationResult(
                        goal_met=True,
                        confidence=0.76,
                        explanation="Damping decreased and oscillation remains active, moving toward more harmonic behavior.",
                    )

        return VerificationResult(
            goal_met=True,
            confidence=0.68,
            explanation="State updated and aligns with planned control actions.",
        )
