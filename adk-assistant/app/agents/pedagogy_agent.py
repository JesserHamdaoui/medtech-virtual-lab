from .base import AgentContext, SemanticIntent


class PedagogyCoachAgent:
    def run(self, *, context: AgentContext, intent: SemanticIntent) -> str:
        if intent.intent == "evaluate_answer":
            return (
                "Pedagogy mode: evaluate student reasoning quality. "
                "Highlight one strength, one gap, and one next evidence-based step."
            )

        if intent.requires_action:
            return (
                "Pedagogy mode: when applying simulation changes, explain why each change was chosen "
                "and ask the student to verify one observable outcome."
            )

        return (
            "Pedagogy mode: keep guidance concise and Socratic, prioritize concept checks before computation."
        )
