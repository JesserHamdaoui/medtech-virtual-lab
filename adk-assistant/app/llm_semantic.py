import json
from typing import Any


def _extract_json_object(text: str) -> dict[str, Any]:
    stripped = text.strip()
    try:
        parsed = json.loads(stripped)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    start = stripped.find("{")
    end = stripped.rfind("}")
    if start >= 0 and end > start:
        snippet = stripped[start : end + 1]
        try:
            parsed = json.loads(snippet)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            return {}

    return {}


def call_groq_json(
    *,
    groq_api_key: str,
    groq_model: str,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.1,
) -> dict[str, Any]:
    try:
        from openai import OpenAI
    except ModuleNotFoundError as import_error:
        raise RuntimeError(
            "Missing Python dependency 'openai'. Install assistant dependencies with: pip install -r requirements.txt"
        ) from import_error

    client = OpenAI(api_key=groq_api_key, base_url="https://api.groq.com/openai/v1")
    client_any: Any = client

    response = client_any.chat.completions.create(
        model=groq_model,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content or "{}"
    return _extract_json_object(content)
