from typing import Any

from .base import AgentContext, SemanticIntent


class ContextResolverAgent:
    def run(
        self,
        *,
        context: AgentContext,
        intent: SemanticIntent,
        status_snapshot: dict[str, Any],
        capabilities: dict[str, Any],
    ) -> dict[str, Any]:
        entities = dict(intent.entities or {})
        latest = context.latest_user_message.lower()

        if "parameter" not in entities or not entities.get("parameter"):
            parameter_candidates = self._parameter_candidates(capabilities)
            if any(pronoun in latest for pronoun in ["it", "them", "that", "this"]):
                inferred = self._infer_from_history(context.previous_user_messages, parameter_candidates)
                if inferred:
                    entities["parameter"] = inferred

        if not entities.get("targetBehavior"):
            if "harmonic" in latest:
                entities["targetBehavior"] = "harmonic_wave"
            elif "stable" in latest:
                entities["targetBehavior"] = "stability"
            elif "increase force" in latest:
                entities["targetBehavior"] = "increase_force"

        return {
            "entities": entities,
            "current_state": status_snapshot,
            "parameter_candidates": self._parameter_candidates(capabilities),
        }

    def _parameter_candidates(self, capabilities: dict[str, Any]) -> list[str]:
        parameters = capabilities.get("parameters")
        if isinstance(parameters, list):
            return [str(item.get("name")) for item in parameters if isinstance(item, dict)]
        return []

    def _infer_from_history(self, history: list[str], candidates: list[str]) -> str:
        normalized_candidates = [candidate.lower() for candidate in candidates]
        for message in reversed(history):
            lowered = message.lower()
            for candidate in normalized_candidates:
                if candidate and candidate in lowered:
                    return candidate
        return ""
