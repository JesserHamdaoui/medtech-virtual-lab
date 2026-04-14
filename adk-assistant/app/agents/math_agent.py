from .base import AgentContext, AgentResult, SemanticIntent


class MathAgent:
    def run(self, *, context: AgentContext, intent: SemanticIntent) -> AgentResult:
        latest = context.latest_user_message.lower()
        intent_math_like = intent.intent in ["evaluate_answer", "experiment_design", "mixed"]
        mentions_quant = any(token in latest for token in ["calculate", "equation", "rate", "fit", "units"])

        if not (intent_math_like or mentions_quant):
            return AgentResult(note="")

        note = (
            "Math reasoning agent: provide quantitative scaffolding tied to current simulation variables. "
            "Use units, identify proportional relationships, and present only partial computation path "
            "for graded prompts (student completes final substitution or conclusion)."
        )
        return AgentResult(note=note, metadata={"mode": "semantic-math"})
