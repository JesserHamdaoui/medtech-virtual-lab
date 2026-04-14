from .base import AgentContext, AgentResult, SemanticIntent


class PhysicsAgent:
    def run(self, *, context: AgentContext, intent: SemanticIntent) -> AgentResult:
        latest = context.latest_user_message.lower()
        physics_signal = any(
            token in latest
            for token in [
                "force",
                "energy",
                "momentum",
                "collision",
                "wave",
                "frequency",
                "amplitude",
                "tension",
                "charge",
                "coulomb",
            ]
        )
        if intent.requires_action:
            physics_signal = True

        if not physics_signal:
            return AgentResult(note="")

        note = (
            "Physics reasoning agent: derive causal hypotheses from current state and expected behavior. "
            "Recommend one-variable-at-a-time tests and ask student to confirm predicted trend vs observation."
        )
        return AgentResult(note=note, metadata={"mode": "semantic-physics"})
