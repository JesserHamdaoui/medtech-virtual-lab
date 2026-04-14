from textwrap import dedent

try:
    from google.adk.agents import Agent
except Exception:
    Agent = None


class AdkLabTutorPolicy:
    def __init__(self) -> None:
        self.available = Agent is not None

    def instruction_for_lab(self, lab_title: str) -> str:
        base_instruction = dedent(
            f"""
            ADK Tutor Policy for {lab_title}:
            - Act as a coach, not an answer key.
            - Never provide final direct answers to graded questions.
            - Require student evidence from simulation observations.
            - Suggest controlled experiments (change one variable at a time).
            - Use progressive hints: conceptual -> procedural -> verification.
            """
        ).strip()

        if not self.available:
            return base_instruction

        _ = Agent
        return base_instruction
