from dataclasses import dataclass
from typing import Any


@dataclass
class AgentContext:
    lab_id: str
    lab_title: str
    objectives: list[str]
    question_titles: list[str]
    questions: list[dict[str, Any]]
    answers: list[dict[str, Any]]
    messages: list[dict[str, str]]
    latest_user_message: str
    previous_user_messages: list[str]


@dataclass
class AgentResult:
    note: str = ""
    metadata: dict[str, Any] | None = None


@dataclass
class SemanticIntent:
    intent: str
    confidence: float
    goal: str
    requires_action: bool
    needs_clarification: bool = False
    clarification_question: str = ""
    entities: dict[str, Any] | None = None


@dataclass
class PlannedAction:
    action: str
    value: float | str | bool | None = None
    body_index: int | None = None
    seconds: float | None = None
    steps: int | None = None
    reason: str = ""

    def to_payload(self) -> dict[str, Any]:
        payload: dict[str, Any] = {"action": self.action}
        if self.value is not None:
            payload["value"] = self.value
        if self.body_index is not None:
            payload["bodyIndex"] = self.body_index
        if self.seconds is not None:
            payload["seconds"] = self.seconds
        if self.steps is not None:
            payload["steps"] = self.steps
        return payload


@dataclass
class PlanResult:
    goal: str
    confidence: float
    actions: list[PlannedAction]
    rationale: str
    expected_observation: str = ""


@dataclass
class VerificationResult:
    goal_met: bool
    confidence: float
    explanation: str


@dataclass
class WorkflowMemory:
    active_goal: str = ""
    latest_intent: str = ""
    last_actions: list[dict[str, Any]] | None = None
    unresolved_items: list[str] | None = None
