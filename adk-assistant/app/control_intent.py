import re
from typing import Any


def _extract_number(text: str) -> float | None:
    match = re.search(r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?", text)
    if not match:
        return None
    try:
        return float(match.group(0))
    except ValueError:
        return None


def _looks_like_follow_up_set(message: str) -> bool:
    lowered = message.lower()
    return (
        _extract_number(lowered) is not None
        and any(token in lowered for token in ["change", "set", "make", "update", "it", "that", "this"])
    )


def _history_contains_any(history: list[str], keywords: list[str]) -> bool:
    for item in reversed(history):
        lowered = item.lower()
        if any(keyword in lowered for keyword in keywords):
            return True
    return False


def _collision_intent(message: str) -> dict[str, Any] | None:
    text = message.lower()

    if "restart" in text or "reset" in text:
        return {"action": "restart"}
    if "pause" in text or "stop" in text:
        return {"action": "pause"}
    if "start" in text or "resume" in text or "play" in text:
        return {"action": "start"}

    if "elastic" in text and "inelastic" not in text:
        return {"action": "set_elasticity", "value": "elastic"}
    if "inelastic" in text:
        return {"action": "set_elasticity", "value": "inelastic"}

    if "slow" in text and "speed" in text:
        return {"action": "set_time_speed", "value": "slow"}
    if "normal" in text and "speed" in text:
        return {"action": "set_time_speed", "value": "normal"}

    body_index = 0 if any(tag in text for tag in ["body 1", "body1", "object 1", "object1"]) else 1 if any(tag in text for tag in ["body 2", "body2", "object 2", "object2"]) else None
    if body_index is None:
        return None

    value = _extract_number(text)
    if value is None:
        return None

    if "mass" in text:
        return {"action": "set_body_mass", "bodyIndex": body_index, "value": value}
    if "velocity" in text or "speed" in text:
        return {"action": "set_body_velocity", "bodyIndex": body_index, "value": value}
    if "position" in text or "x=" in text or "x " in text:
        return {"action": "set_body_position", "bodyIndex": body_index, "value": value}

    return None


def _coulomb_intent(message: str) -> dict[str, Any] | None:
    text = message.lower()

    if "reset" in text or "restart" in text:
        return {"action": "reset"}

    value = _extract_number(text)

    if "distance" in text and value is not None:
        if "mm" in text:
            value = value / 1000
        elif "cm" in text:
            value = value / 100
        if any(token in text for token in ["increase", "decrease", "nudge", "delta", "+", "-"]):
            signed_value = -abs(value) if "decrease" in text or "-" in text else abs(value)
            return {"action": "nudge_distance", "value": signed_value}
        return {"action": "set_distance", "value": value}

    if value is None:
        return None

    if any(tag in text for tag in ["q1", "charge a", "charge 1"]):
        if "micro" in text or "µc" in text or "uc" in text:
            value *= 1e-6
        if any(token in text for token in ["increase", "decrease", "nudge", "delta", "+", "-"]):
            signed_value = -abs(value) if "decrease" in text or "-" in text else abs(value)
            return {"action": "nudge_charge_a", "value": signed_value}
        return {"action": "set_charge_a", "value": value}

    if any(tag in text for tag in ["q2", "charge b", "charge 2"]):
        if "micro" in text or "µc" in text or "uc" in text:
            value *= 1e-6
        if any(token in text for token in ["increase", "decrease", "nudge", "delta", "+", "-"]):
            signed_value = -abs(value) if "decrease" in text or "-" in text else abs(value)
            return {"action": "nudge_charge_b", "value": signed_value}
        return {"action": "set_charge_b", "value": value}

    return None


def _standing_waves_intent(message: str) -> dict[str, Any] | None:
    text = message.lower()

    if "restart" in text or "reset" in text:
        return {"action": "restart"}
    if "pause" in text:
        return {"action": "pause"}
    if "play" in text or "start" in text:
        return {"action": "play"}

    if "fixed end" in text or "fixed" in text and "end" in text:
        return {"action": "set_end", "value": "fixed"}
    if "loose end" in text or "loose" in text and "end" in text:
        return {"action": "set_end", "value": "loose"}

    if "slow" in text and "speed" in text:
        return {"action": "set_time_speed", "value": "slow"}
    if "normal" in text and "speed" in text:
        return {"action": "set_time_speed", "value": "normal"}

    value = _extract_number(text)
    if value is None:
        return None

    if "tension" in text:
        return {"action": "set_tension", "value": value}
    if "damping" in text:
        return {"action": "set_damping", "value": value}
    if "frequency" in text:
        return {"action": "set_frequency", "value": value}
    if "amplitude" in text:
        return {"action": "set_amplitude", "value": value}

    return None


def _contextual_follow_up_intent(
    lab_id: str,
    latest_message: str,
    previous_user_messages: list[str],
) -> dict[str, Any] | None:
    if not _looks_like_follow_up_set(latest_message):
        return None

    value = _extract_number(latest_message)
    if value is None:
        return None

    normalized_lab = lab_id.lower()

    if normalized_lab == "standing-waves":
        if _history_contains_any(previous_user_messages, ["amplitude"]):
            return {"action": "set_amplitude", "value": value}
        if _history_contains_any(previous_user_messages, ["frequency"]):
            return {"action": "set_frequency", "value": value}
        if _history_contains_any(previous_user_messages, ["tension"]):
            return {"action": "set_tension", "value": value}
        if _history_contains_any(previous_user_messages, ["damping"]):
            return {"action": "set_damping", "value": value}

    if normalized_lab == "coulombs-law":
        if _history_contains_any(previous_user_messages, ["distance"]):
            if "mm" in latest_message.lower():
                value = value / 1000
            elif "cm" in latest_message.lower():
                value = value / 100
            return {"action": "set_distance", "value": value}
        if _history_contains_any(previous_user_messages, ["q1", "charge a", "charge 1"]):
            if any(token in latest_message.lower() for token in ["micro", "µc", "uc"]):
                value *= 1e-6
            return {"action": "set_charge_a", "value": value}
        if _history_contains_any(previous_user_messages, ["q2", "charge b", "charge 2"]):
            if any(token in latest_message.lower() for token in ["micro", "µc", "uc"]):
                value *= 1e-6
            return {"action": "set_charge_b", "value": value}

    if normalized_lab in ["collision", "laws-of-collisions"]:
        if _history_contains_any(previous_user_messages, ["body 1", "body1", "object 1", "object1"]):
            if _history_contains_any(previous_user_messages, ["mass"]):
                return {"action": "set_body_mass", "bodyIndex": 0, "value": value}
            if _history_contains_any(previous_user_messages, ["velocity", "speed"]):
                return {"action": "set_body_velocity", "bodyIndex": 0, "value": value}
            if _history_contains_any(previous_user_messages, ["position", "x"]):
                return {"action": "set_body_position", "bodyIndex": 0, "value": value}

        if _history_contains_any(previous_user_messages, ["body 2", "body2", "object 2", "object2"]):
            if _history_contains_any(previous_user_messages, ["mass"]):
                return {"action": "set_body_mass", "bodyIndex": 1, "value": value}
            if _history_contains_any(previous_user_messages, ["velocity", "speed"]):
                return {"action": "set_body_velocity", "bodyIndex": 1, "value": value}
            if _history_contains_any(previous_user_messages, ["position", "x"]):
                return {"action": "set_body_position", "bodyIndex": 1, "value": value}

    return None


def detect_control_intent(
    lab_id: str,
    user_message: str,
    previous_user_messages: list[str] | None = None,
) -> dict[str, Any] | None:
    normalized_lab = lab_id.lower()
    history = previous_user_messages or []

    if normalized_lab in ["collision", "laws-of-collisions"]:
        return _collision_intent(user_message) or _contextual_follow_up_intent(
            lab_id,
            user_message,
            history,
        )
    if normalized_lab == "coulombs-law":
        return _coulomb_intent(user_message) or _contextual_follow_up_intent(
            lab_id,
            user_message,
            history,
        )
    if normalized_lab == "standing-waves":
        return _standing_waves_intent(user_message) or _contextual_follow_up_intent(
            lab_id,
            user_message,
            history,
        )

    return None
