from typing import Any

from ..lab_mcp import apply_lab_controls, get_lab_capabilities, get_lab_status
from .base import AgentContext, AgentResult, PlannedAction


class LabMcpAgent:
    async def get_status(self, context: AgentContext) -> AgentResult:
        try:
            status_snapshot = await get_lab_status(context.lab_id)
            return AgentResult(
                note="Lab MCP agent retrieved the current lab status.",
                metadata={
                    "status_snapshot": status_snapshot,
                    "control_action": None,
                    "control_applied": False,
                    "control_error": None,
                },
            )
        except Exception as status_error:
            return AgentResult(
                note=f"Lab MCP agent could not read status: {status_error}",
                metadata={
                    "status_snapshot": {"warning": f"Could not read MCP status: {status_error}"},
                    "control_action": None,
                    "control_applied": False,
                    "control_error": None,
                },
            )

    async def get_capabilities(self, context: AgentContext) -> dict[str, Any]:
        try:
            capabilities = await get_lab_capabilities(context.lab_id)
            if isinstance(capabilities, dict):
                return capabilities
        except Exception:
            pass
        return {"lab": context.lab_id, "actions": [], "parameters": []}

    async def execute_actions(
        self,
        *,
        context: AgentContext,
        actions: list[PlannedAction],
    ) -> AgentResult:
        if not actions:
            return AgentResult(
                note="Lab MCP agent received empty action plan.",
                metadata={
                    "status_snapshot": await get_lab_status(context.lab_id),
                    "control_action": None,
                    "control_applied": False,
                    "control_error": None,
                    "applied_actions": [],
                },
            )

        payloads = [planned_action.to_payload() for planned_action in actions]
        applied_actions: list[dict[str, Any]] = []
        current_state: dict[str, Any] | None = None

        try:
            batch_result = await apply_lab_controls(context.lab_id, payloads)
            raw_applied = batch_result.get("applied_actions")
            if isinstance(raw_applied, list):
                applied_actions = [item for item in raw_applied if isinstance(item, dict)]
            snapshot = batch_result.get("status_snapshot")
            current_state = snapshot if isinstance(snapshot, dict) else None
        except Exception as control_error:
            return AgentResult(
                note=f"Lab MCP agent failed planned action sequence: {control_error}",
                metadata={
                    "status_snapshot": current_state,
                    "control_action": payloads[-1] if payloads else None,
                    "control_applied": False,
                    "control_error": str(control_error),
                    "applied_actions": applied_actions,
                },
            )

        return AgentResult(
            note="Lab MCP agent executed planned actions successfully.",
            metadata={
                "status_snapshot": current_state,
                "control_action": applied_actions[-1] if applied_actions else None,
                "control_applied": bool(applied_actions),
                "control_error": None,
                "applied_actions": applied_actions,
            },
        )
