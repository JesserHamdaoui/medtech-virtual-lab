import os
from textwrap import dedent
from typing import Any, cast


def _system_prompt(lab_title: str, objectives: list[str], question_titles: list[str]) -> str:
    objectives_text = "\n".join([f"- {objective}" for objective in objectives])
    questions_text = "\n".join([f"- {question}" for question in question_titles])

    return dedent(
        f"""
        You are a supportive STEM lab tutor for: {lab_title}.

        Rules:
        1) Never provide final direct answers for assessment questions.
        2) Use Socratic guidance: ask probing questions and suggest small experiments.
        3) Encourage evidence-based reasoning from simulation observations.
        4) If the student asks for direct answers, refuse briefly and provide a hint path.
        5) Keep responses concise, practical, and student-friendly.

        Lab learning objectives:
        {objectives_text or "- No objectives provided"}

        Assessment question topics:
        {questions_text or "- No question titles provided"}
        """
    ).strip()


def build_chat_reply(
    *,
    groq_api_key: str,
    groq_model: str,
    lab_title: str,
    objectives: list[str],
    question_titles: list[str],
    status_snapshot: dict,
    conversation_messages: list[dict[str, str]],
    adk_instruction: str = "",
) -> str:
    try:
        from openai import OpenAI
    except ModuleNotFoundError as import_error:
        raise RuntimeError(
            "Missing Python dependency 'openai'. Install assistant dependencies with: pip install -r requirements.txt"
        ) from import_error

    client = OpenAI(
        api_key=groq_api_key,
        base_url="https://api.groq.com/openai/v1",
    )

    status_text = f"Current simulation snapshot: {status_snapshot}"

    messages_payload = cast(
        list[dict[str, Any]],
        [
            {
                "role": "system",
                "content": _system_prompt(lab_title, objectives, question_titles),
            },
            *([{"role": "system", "content": adk_instruction}] if adk_instruction else []),
            {"role": "system", "content": status_text},
            *conversation_messages,
        ],
    )

    client_any: Any = client

    response = client_any.chat.completions.create(
        model=groq_model,
        temperature=0.0,
        messages=messages_payload,
    )

    message = response.choices[0].message.content
    if not message:
        return "Let’s continue with your observation. What did you change first, and what changed in the simulation?"
    return message


def get_groq_model() -> str:
    return os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
