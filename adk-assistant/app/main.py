import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from .agents import ReactOrchestrator
from .models import AssistRequest, AssistResponse

load_dotenv()

app = FastAPI(title="MedTech Lab ADK Assistant", version="0.1.0")
orchestrator = ReactOrchestrator()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/assist", response_model=AssistResponse)
async def assist(payload: AssistRequest) -> AssistResponse:
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set")

    try:
        orchestrator_result = await orchestrator.run(
            groq_api_key=groq_api_key,
            payload={
                "labId": payload.labId,
                "labTitle": payload.labTitle,
                "objectives": payload.objectives,
                "questionTitles": payload.questionTitles,
                "questions": payload.questions,
                "answers": payload.answers,
                "messages": [message.model_dump() for message in payload.messages],
            },
        )
    except Exception as model_error:
        raise HTTPException(
            status_code=500,
            detail=f"Assistant model call failed: {model_error}",
        ) from model_error

    return AssistResponse(
        reply=orchestrator_result["reply"],
        statusSnapshot=orchestrator_result.get("statusSnapshot"),
        controlAction=orchestrator_result.get("controlAction"),
        appliedActions=orchestrator_result.get("appliedActions", []),
        controlApplied=orchestrator_result.get("controlApplied", False),
        controlError=orchestrator_result.get("controlError"),
    )
