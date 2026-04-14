from typing import Any

from ..llm_semantic import call_groq_json
from .base import AgentContext, PlanResult, PlannedAction, SemanticIntent


class LabPlannerAgent:
    def run(
        self,
        *,
        context: AgentContext,
        intent: SemanticIntent,
        resolved_context: dict[str, Any],
        capabilities: dict[str, Any],
        groq_api_key: str,
        groq_model: str,
    ) -> PlanResult:
        system_prompt = (
            "You generate execution plans for a simulation control agent. "
            "Return strict JSON only. Create small, safe actions that move toward goal. "
            "If user request is vague or underspecified, return an empty actions list and ask for clarification in rationale."
        )

        schema = {
            "goal": "string",
            "confidence": "0..1",
            "rationale": "string",
            "expected_observation": "string",
            "actions": [
                {
                    "action": "string",
                    "value": "number|string|boolean optional",
                    "bodyIndex": "number optional",
                    "seconds": "number optional",
                    "steps": "number optional",
                    "reason": "string",
                }
            ],
        }

        user_prompt = (
            f"Lab: {context.lab_title} ({context.lab_id})\n"
            f"Intent: {intent.intent} confidence={intent.confidence}\n"
            f"Goal: {intent.goal}\n"
            f"Resolved context: {resolved_context}\n"
            f"Capabilities: {capabilities}\n"
            f"Current state: {resolved_context.get('current_state', {})}\n"
            f"Latest message: {context.latest_user_message}\n"
            f"Output schema: {schema}\n"
            "Rules: choose at most 2 actions; keep values inside capability ranges; do not invent unsupported actions."
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

        raw_actions = parsed.get("actions")
        actions_data = raw_actions if isinstance(raw_actions, list) else []
        actions: list[PlannedAction] = []

        for item in actions_data[:2]:
            if not isinstance(item, dict) or not item.get("action"):
                continue

            body_index_raw = item.get("bodyIndex")
            seconds_raw = item.get("seconds")
            steps_raw = item.get("steps")

            actions.append(
                PlannedAction(
                    action=str(item.get("action")),
                    value=item.get("value"),
                    body_index=body_index_raw if isinstance(body_index_raw, int) else None,
                    seconds=float(seconds_raw) if isinstance(seconds_raw, (int, float)) else None,
                    steps=steps_raw if isinstance(steps_raw, int) else None,
                    reason=str(item.get("reason") or ""),
                )
            )

        if not actions:
            actions = self._fallback_plan(intent, capabilities, context, resolved_context)

        return PlanResult(
            goal=str(parsed.get("goal") or intent.goal),
            confidence=float(parsed.get("confidence") or intent.confidence),
            actions=actions,
            rationale=str(parsed.get("rationale") or "Fallback conservative plan."),
            expected_observation=str(parsed.get("expected_observation") or "Observe trend change after action."),
        )

    def _fallback_plan(
        self,
        intent: SemanticIntent,
        capabilities: dict[str, Any],
        context: AgentContext,
        resolved_context: dict[str, Any],
    ) -> list[PlannedAction]:
        available = set(capabilities.get("actions", [])) if isinstance(capabilities.get("actions"), list) else set()
        goal = intent.goal.lower()
        latest = context.latest_user_message.lower()
        current_state = resolved_context.get("current_state") if isinstance(resolved_context, dict) else {}
        if not isinstance(current_state, dict):
            current_state = {}

        if "harmonic" in goal and intent.requires_action:
            if "set_damping" in available:
                return [PlannedAction(action="set_damping", value=10, reason="Lower damping for clearer harmonic behavior")]
            if "set_frequency" in available:
                return [PlannedAction(action="set_frequency", value=1.0, reason="Move frequency toward stable fundamental")]

        if intent.requires_action and any(token in latest for token in ["all of them", "let's do it", "do it"]):
            multi_actions: list[PlannedAction] = []
            if "set_tension" in available and isinstance(current_state.get("tension"), (int, float)):
                multi_actions.append(
                    PlannedAction(
                        action="set_tension",
                        value=max(0.2, min(0.8, float(current_state["tension"]) - 0.1)),
                        reason="Small tension adjustment for comparative observation.",
                    )
                )
            if "set_damping" in available and isinstance(current_state.get("damping"), (int, float)):
                multi_actions.append(
                    PlannedAction(
                        action="set_damping",
                        value=max(0.0, min(100.0, float(current_state["damping"]) + 5.0)),
                        reason="Small damping change to compare dissipation effects.",
                    )
                )
            if "set_amplitude" in available and isinstance(current_state.get("amplitude"), (int, float)):
                multi_actions.append(
                    PlannedAction(
                        action="set_amplitude",
                        value=max(0.0, min(1.3, float(current_state["amplitude"]) + 0.1)),
                        reason="Small amplitude change for visibility and trend comparison.",
                    )
                )
            if "set_frequency" in available and isinstance(current_state.get("frequency"), (int, float)):
                multi_actions.append(
                    PlannedAction(
                        action="set_frequency",
                        value=max(0.0, min(3.0, float(current_state["frequency"]) + 0.1)),
                        reason="Small frequency adjustment for harmonic-pattern exploration.",
                    )
                )
            if multi_actions:
                return multi_actions[:2]

        parameter = str((intent.entities or {}).get("parameter") or "").lower()
        target = (intent.entities or {}).get("targetValue")
        if parameter and isinstance(target, (int, float)):
            guessed = f"set_{parameter}"
            if guessed in available:
                return [PlannedAction(action=guessed, value=float(target), reason="Apply requested target value")]

        if intent.requires_action and "frequency" in latest and "set_frequency" in available:
            current = float(current_state.get("frequency", 1.5)) if isinstance(current_state.get("frequency"), (int, float)) else 1.5
            return [
                PlannedAction(
                    action="set_frequency",
                    value=max(0.0, min(3.0, current + 0.1)),
                    reason="Explicit request to change frequency with conservative step.",
                )
            ]

        if intent.requires_action and "amplitude" in latest and "set_amplitude" in available:
            current = float(current_state.get("amplitude", 0.75)) if isinstance(current_state.get("amplitude"), (int, float)) else 0.75
            return [
                PlannedAction(
                    action="set_amplitude",
                    value=max(0.0, min(1.3, current + 0.1)),
                    reason="Explicit request to change amplitude with conservative step.",
                )
            ]

        return []
