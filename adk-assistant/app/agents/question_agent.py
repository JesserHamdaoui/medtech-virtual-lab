from .base import AgentContext, AgentResult, SemanticIntent


class QuestionAgent:
    def run(self, *, context: AgentContext, intent: SemanticIntent) -> AgentResult:
        question_count = len(context.questions)
        answered_count = 0

        for answer in context.answers:
            if answer.get("textAnswer"):
                answered_count += 1
                continue
            if answer.get("tableAnswer"):
                answered_count += 1
                continue
            if answer.get("plotAnswer"):
                answered_count += 1
                continue

        question_summaries: list[str] = []
        for question in context.questions[:12]:
            question_summaries.append(
                f"- [{question.get('id', '?')}] {question.get('title', '')}: {question.get('description', '')}"
            )

        answer_summaries: list[str] = []
        for answer in context.answers[:20]:
            question_id = answer.get("questionId", "?")
            if answer.get("textAnswer"):
                answer_summaries.append(
                    f"- {question_id}: text='{str(answer.get('textAnswer'))[:200]}'"
                )
            elif answer.get("tableAnswer"):
                table_data = answer.get("tableAnswer", {}).get("data", [])
                row_count = len(table_data) if isinstance(table_data, list) else 0
                answer_summaries.append(f"- {question_id}: table rows={row_count}")
            elif answer.get("plotAnswer"):
                points = answer.get("plotAnswer", {}).get("points", [])
                point_count = len(points) if isinstance(points, list) else 0
                answer_summaries.append(f"- {question_id}: plot points={point_count}")

        coaching_focus = (
            "answer-evaluation"
            if intent.intent == "evaluate_answer"
            else "evidence-building"
        )

        note = (
            "Question agent context: "
            f"{question_count} lab questions available, "
            f"{answered_count} currently answered by the student. "
            f"Coaching focus: {coaching_focus}. Use this to coach without giving final direct answers.\n"
            "Questions:\n"
            f"{chr(10).join(question_summaries) if question_summaries else '- None'}\n"
            "Current student answers:\n"
            f"{chr(10).join(answer_summaries) if answer_summaries else '- No submitted answers yet'}"
        )

        return AgentResult(
            note=note,
            metadata={
                "question_count": question_count,
                "answered_count": answered_count,
                "coaching_focus": coaching_focus,
                "questions": context.questions,
                "answers": context.answers,
            },
        )
