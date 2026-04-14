from pydantic import BaseModel, Field
from typing import Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AssistRequest(BaseModel):
    labId: str
    labTitle: str
    objectives: list[str] = Field(default_factory=list)
    questionTitles: list[str] = Field(default_factory=list)
    questions: list[dict] = Field(default_factory=list)
    answers: list[dict] = Field(default_factory=list)
    messages: list[ChatMessage]


class AssistResponse(BaseModel):
    reply: str
    statusSnapshot: dict | None = None
    controlAction: dict | None = None
    appliedActions: list[dict] = Field(default_factory=list)
    controlApplied: bool = False
    controlError: str | None = None
