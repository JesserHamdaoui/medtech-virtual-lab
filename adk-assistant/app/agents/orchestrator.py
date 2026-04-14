from typing import Any

from ..adk_agent import AdkLabTutorPolicy
from ..assistant import build_chat_reply, get_groq_model
from ..control_intent import detect_control_intent
from .base import AgentContext, PlannedAction, WorkflowMemory
from .context_resolver_agent import ContextResolverAgent
from .goal_verifier_agent import GoalVerifierAgent
from .intent_agent import IntentClassifierAgent
from .lab_mcp_agent import LabMcpAgent
from .lab_planner_agent import LabPlannerAgent
from .math_agent import MathAgent
from .pedagogy_agent import PedagogyCoachAgent
from .physics_agent import PhysicsAgent
from .question_agent import QuestionAgent


def _looks_explicit_control_command(message: str) -> bool:
    lowered = message.lower().strip()
    has_action = any(
        token in lowered
        for token in [
            "set",
            "change",
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
        ]
    )
    has_target = any(
        token in lowered
        for token in [
            "frequency",
            "amplitude",
            "tension",
            "damping",
            "distance",
            "charge",
            "q1",
            "q2",
            "mass",
            "velocity",
            "position",
            "all of them",
            "them",
            "it",
        ]
    )
    return has_action and has_target


def _sanitize_reply_against_execution(reply: str, applied_actions: list[dict[str, Any]]) -> str:
    if applied_actions:
        return reply

    lowered = reply.lower()
    false_claim_markers = [
        "i've applied",
        "i have applied",
        "we've made the changes",
        "we made the changes",
        "i changed",
        "i set",
        "the frequency has been set",
        "let's make the changes",
    ]
    if any(marker in lowered for marker in false_claim_markers):
        return (
            "I haven’t applied any lab changes yet. Tell me exactly what to change, "
            "or say something like: 'increase frequency a bit' or 'apply changes to all parameters'."
        )

    return reply


def _build_grounded_action_reply(
    *,
    applied_actions: list[dict[str, Any]],
    status_snapshot: dict[str, Any],
) -> str:
    if not applied_actions:
        return ""

    lines = ["I applied the following simulation changes:"]
    for action in applied_actions:
        action_name = action.get("action", "unknown_action")
        value = action.get("value")
        if value is None:
            lines.append(f"- {action_name}")
        else:
            lines.append(f"- {action_name}: {value}")

    key_fields = []
    for key in ["frequency", "tension", "damping", "amplitude", "distanceMeters", "timeSpeed", "endType"]:
        if key in status_snapshot:
            key_fields.append(f"{key}={status_snapshot[key]}")

    if key_fields:
        lines.append("")
        lines.append("Current key state: " + ", ".join(key_fields))

    lines.append("")
    lines.append("What change would you like to try next to compare outcomes?")
    return "\n".join(lines)


class ReactOrchestrator:
    def __init__(self) -> None:
        self.policy_agent = AdkLabTutorPolicy()
        self.intent_agent = IntentClassifierAgent()
        self.context_resolver_agent = ContextResolverAgent()
        self.lab_mcp_agent = LabMcpAgent()
        self.lab_planner_agent = LabPlannerAgent()
        self.goal_verifier_agent = GoalVerifierAgent()
        self.question_agent = QuestionAgent()
        self.math_agent = MathAgent()
        self.physics_agent = PhysicsAgent()
        self.pedagogy_agent = PedagogyCoachAgent()
        self.memory = WorkflowMemory(last_actions=[], unresolved_items=[])

    async def run(
        self,
        *,
        groq_api_key: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        latest_user_message = ""
        previous_user_messages: list[str] = []
        for message in reversed(payload["messages"]):
            if message["role"] == "user":
                if not latest_user_message:
                    latest_user_message = message["content"]
                else:
                    previous_user_messages.append(message["content"])

        context = AgentContext(
            lab_id=payload["labId"],
            lab_title=payload["labTitle"],
            objectives=payload.get("objectives", []),
            question_titles=payload.get("questionTitles", []),
            questions=payload.get("questions", []),
            answers=payload.get("answers", []),
            messages=payload["messages"],
            latest_user_message=latest_user_message,
            previous_user_messages=previous_user_messages,
        )

        groq_model = get_groq_model()

        status_before_result = await self.lab_mcp_agent.get_status(context)
        status_before = status_before_result.metadata.get("status_snapshot") if status_before_result.metadata else {}
        if not isinstance(status_before, dict):
            status_before = {"warning": "Could not read initial status"}

        capabilities = await self.lab_mcp_agent.get_capabilities(context)

        intent = self.intent_agent.run(
            context=context,
            groq_api_key=groq_api_key,
            groq_model=groq_model,
            memory_goal=self.memory.active_goal,
        )

        resolved = self.context_resolver_agent.run(
            context=context,
            intent=intent,
            status_snapshot=status_before,
            capabilities=capabilities,
        )

        planned_actions: list[PlannedAction] = []
        plan_rationale = ""
        verification_note = "No verification performed."
        execution_result = status_before_result

        should_take_action = intent.requires_action and not intent.needs_clarification
        if should_take_action:
            plan = self.lab_planner_agent.run(
                context=context,
                intent=intent,
                resolved_context=resolved,
                capabilities=capabilities,
                groq_api_key=groq_api_key,
                groq_model=groq_model,
            )
            planned_actions = plan.actions
            plan_rationale = plan.rationale

            if not planned_actions and _looks_explicit_control_command(context.latest_user_message):
                fallback_payload = detect_control_intent(
                    context.lab_id,
                    context.latest_user_message,
                    context.previous_user_messages,
                )
                if fallback_payload and fallback_payload.get("action"):
                    planned_actions = [
                        PlannedAction(
                            action=str(fallback_payload["action"]),
                            value=fallback_payload.get("value"),
                            body_index=fallback_payload.get("bodyIndex"),
                            seconds=fallback_payload.get("seconds"),
                            steps=fallback_payload.get("steps"),
                            reason="Deterministic fallback from legacy intent parser.",
                        )
                    ]

            execution_result = await self.lab_mcp_agent.execute_actions(
                context=context,
                actions=planned_actions,
            )

            status_after = execution_result.metadata.get("status_snapshot") if execution_result.metadata else {}
            if not isinstance(status_after, dict):
                status_after = {}

            verification = self.goal_verifier_agent.run(
                goal=intent.goal,
                plan=plan,
                status_before=status_before,
                status_after=status_after,
            )
            verification_note = (
                f"Verification: goal_met={verification.goal_met}, confidence={verification.confidence}. "
                f"{verification.explanation}"
            )

        if intent.needs_clarification and intent.clarification_question:
            clarification_note = f"Need clarification before control actions: {intent.clarification_question}"
        else:
            clarification_note = ""

        question_result = self.question_agent.run(context=context, intent=intent)
        math_result = self.math_agent.run(context=context, intent=intent)
        physics_result = self.physics_agent.run(context=context, intent=intent)
        pedagogy_note = self.pedagogy_agent.run(context=context, intent=intent)

        orchestration_notes = "\n\n".join(
            [
                note
                for note in [
                    status_before_result.note,
                    execution_result.note if execution_result is not status_before_result else "",
                    f"Intent: {intent.intent} (confidence={intent.confidence}) goal={intent.goal}",
                    f"Resolved entities: {resolved.get('entities', {})}",
                    f"Capabilities: {capabilities}",
                    f"Plan rationale: {plan_rationale}" if plan_rationale else "",
                    f"Planned actions: {[action.to_payload() for action in planned_actions]}" if planned_actions else "",
                    verification_note,
                    clarification_note,
                    question_result.note,
                    math_result.note,
                    physics_result.note,
                    pedagogy_note,
                ]
                if note
            ]
        )

        tutor_policy = self.policy_agent.instruction_for_lab(context.lab_title)
        adk_instruction = f"{tutor_policy}\n\n{orchestration_notes}".strip()

        raw_status_snapshot = (
            execution_result.metadata.get("status_snapshot") if execution_result.metadata else None
        )
        status_snapshot = (
            raw_status_snapshot
            if isinstance(raw_status_snapshot, dict)
            else {"warning": "No status metadata"}
        )

        metadata = execution_result.metadata or {}
        raw_applied_actions = metadata.get("applied_actions")
        applied_actions: list[dict[str, Any]] = []
        if isinstance(raw_applied_actions, list):
            applied_actions = [
                item for item in raw_applied_actions if isinstance(item, dict)
            ]
        execution_grounding = (
            f"Execution grounding: applied_actions={applied_actions}; final_status={status_snapshot}. "
            "Never claim any parameter change unless it appears in applied_actions."
        )
        adk_instruction = f"{adk_instruction}\n\n{execution_grounding}".strip()

        if applied_actions:
            reply = _build_grounded_action_reply(
                applied_actions=applied_actions,
                status_snapshot=status_snapshot,
            )
        else:
            reply = build_chat_reply(
                groq_api_key=groq_api_key,
                groq_model=groq_model,
                lab_title=context.lab_title,
                objectives=context.objectives,
                question_titles=context.question_titles,
                status_snapshot=status_snapshot,
                conversation_messages=context.messages,
                adk_instruction=adk_instruction,
            )
            reply = _sanitize_reply_against_execution(reply, applied_actions)

        self.memory.active_goal = intent.goal
        self.memory.latest_intent = intent.intent
        self.memory.last_actions = applied_actions
        unresolved = list(self.memory.unresolved_items or [])
        if intent.needs_clarification and intent.clarification_question:
            unresolved.append(intent.clarification_question)
        self.memory.unresolved_items = unresolved[-3:]

        return {
            "reply": reply,
            "statusSnapshot": status_snapshot,
            "controlAction": metadata.get("control_action"),
            "controlApplied": bool(metadata.get("control_applied", False)),
            "controlError": metadata.get("control_error"),
            "appliedActions": applied_actions,
            "orchestration": {
                "activeAgents": [
                    "intent_agent",
                    "context_resolver_agent",
                    "lab_mcp_agent",
                    "lab_planner_agent",
                    "goal_verifier_agent",
                    "question_agent",
                    *( ["math_agent"] if math_result.note else [] ),
                    *( ["physics_agent"] if physics_result.note else [] ),
                    "pedagogy_agent",
                ]
            },
        }
