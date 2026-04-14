from typing import Any

from ..llm_semantic import call_groq_json
from .base import AgentContext, SemanticIntent


class IntentClassifierAgent:
    def run(
        self,
        *,
        context: AgentContext,
        groq_api_key: str,
        groq_model: str,
        memory_goal: str = "",
    ) -> SemanticIntent:
        latest = context.latest_user_message.strip()

        schema_hint = {
            "intent": "one of: lab_control, concept_explanation, evaluate_answer, experiment_design, mixed",
            "confidence": "0..1",
            "goal": "short normalized goal",
            "requires_action": "boolean",
            "needs_clarification": "boolean",
            "clarification_question": "string",
            "entities": {
                "parameter": "optional string",
                "targetValue": "optional number",
                "targetBehavior": "optional string",
                "relativeChange": "optional string",
            },
        }

        system_prompt = (
            "You classify student intent for an interactive STEM lab tutor. "
            "Return strict JSON only. Prefer semantic interpretation over literal keywords. "
            "Set requires_action=true for implicit requests that ask to alter simulation state "
            "(e.g., make wave harmonic, tweak values, try different values)."
        )
        user_prompt = (
            f"Lab: {context.lab_title} ({context.lab_id})\n"
            f"Prior goal memory: {memory_goal or 'none'}\n"
            f"Latest user message: {latest}\n"
            f"Recent user messages: {context.previous_user_messages[:4]}\n"
            f"Output JSON schema: {schema_hint}"
        )

        parsed: dict[str, Any] = {}
        try:
            parsed = call_groq_json(
                groq_api_key=groq_api_key,
                groq_model=groq_model,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.0,
            )
        except Exception:
            parsed = {}

        intent = str(parsed.get("intent") or "mixed")
        confidence = float(parsed.get("confidence") or 0.45)
        goal = str(parsed.get("goal") or memory_goal or latest)
        requires_action = bool(parsed.get("requires_action", False))
        needs_clarification = bool(parsed.get("needs_clarification", False))
        clarification_question = str(parsed.get("clarification_question") or "")
        entities = parsed.get("entities") if isinstance(parsed.get("entities"), dict) else {}

        lowered = latest.lower()
        has_parameter_signal = any(
            token in lowered
            for token in [
                "frequency",
                "amplitude",
                "tension",
                "damping",
                "distance",
                "q1",
                "q2",
                "charge",
                "velocity",
                "mass",
                "position",
                "pause",
                "play",
                "restart",
                "reset",
            ]
        )
        has_action_verb = any(
            token in lowered
            for token in [
                "change",
                "set",
                "adjust",
                "increase",
                "decrease",
                "pause",
                "play",
                "restart",
                "reset",
                "apply",
                "do it",
                "let's do it",
                "make it",
            ]
        )
        is_question_like = lowered.endswith("?") or lowered.startswith(
            ("what", "why", "how", "is ", "are ", "can ", "could ", "should ")
        )

        explicit_action_request = has_action_verb and (
            has_parameter_signal or any(token in lowered for token in ["all of them", "them", "it"])
        )

        if "all of them" in lowered:
            prior_context_text = " ".join(context.previous_user_messages[:4]).lower()
            if any(token in prior_context_text for token in ["change", "parameter", "frequency", "amplitude", "tension", "damping"]):
                explicit_action_request = True

        if any(token in lowered for token in ["let's do it", "do it", "apply it", "go ahead"]):
            explicit_action_request = True

        if explicit_action_request:
            requires_action = True
            intent = "lab_control"
            needs_clarification = False
            clarification_question = ""

        if is_question_like and not explicit_action_request:
            requires_action = False

        if any(token in lowered for token in ["harmonic", "more stable", "optimize"]):
            intent = "lab_control" if explicit_action_request else "concept_explanation"
            if explicit_action_request:
                requires_action = True

        return SemanticIntent(
            intent=intent,
            confidence=max(0.0, min(1.0, confidence)),
            goal=goal,
            requires_action=requires_action,
            needs_clarification=needs_clarification,
            clarification_question=clarification_question,
            entities=entities,
        )
