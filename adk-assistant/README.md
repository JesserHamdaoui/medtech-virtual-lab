# Lab AI Assistant Service (Google ADK + Groq + MCP)

This service provides a lab tutor backend for the web app.

## Stack

- **Google ADK policy layer** (`app/adk_agent.py`) for tutoring behavior constraints
- **Groq LLM inference** via OpenAI-compatible API (`app/assistant.py`)
- **MCP lab status tools** from this repo (`mcp/`) via stdio MCP client (`app/lab_mcp.py`)
- **FastAPI** HTTP service for Next.js integration (`app/main.py`)
- **ReactOrchestrator multi-agent workflow** (`app/agents/orchestrator.py`)

## Multi-Agent Architecture

The assistant now runs through a semantic orchestrator with planning and verification.

### Active agents in the current implementation

- `intent_agent` (`app/agents/intent_agent.py`)
  - Classifies semantic intent and detects implicit action requests.
- `context_resolver_agent` (`app/agents/context_resolver_agent.py`)
  - Resolves context references (`it`, `them`, `that`) from history + lab capabilities.
- `lab_planner_agent` (`app/agents/lab_planner_agent.py`)
  - Builds bounded action plans from goal + current status + capabilities.
- `lab_mcp_agent` (`app/agents/lab_mcp_agent.py`)
  - Reads status, reads capabilities, and executes planned MCP control actions.
- `goal_verifier_agent` (`app/agents/goal_verifier_agent.py`)
  - Verifies whether post-action state moved toward the user goal.
- `question_agent` (`app/agents/question_agent.py`)
  - Injects complete question + answer context for coaching.
- `physics_agent` (`app/agents/physics_agent.py`)
  - Adds semantic physics reasoning guidance.
- `math_agent` (`app/agents/math_agent.py`)
  - Adds semantic quantitative reasoning guidance.
- `pedagogy_agent` (`app/agents/pedagogy_agent.py`)
  - Tunes response style for coaching vs answer-evaluation mode.
- `adk_policy_agent` (`app/adk_agent.py`)
  - Enforces anti-answer-key behavior.

### Orchestration flow

1. Read `get_status` and `get_capabilities`.
2. Classify intent semantically.
3. Resolve entities and references from context.
4. Plan bounded lab actions.
5. Execute actions via MCP.
6. Verify outcome and embed verification notes into tutoring response.

This gives one coherent tutor response grounded in simulation state, capability metadata, and assessment context.

## Endpoints

- `GET /health`
- `POST /assist`

`/assist` input:

```json
{
  "labId": "coulombs-law",
  "labTitle": "Coulomb's Law",
  "objectives": ["..."],
  "questionTitles": ["..."],
  "questions": [{ "id": "q1", "title": "...", "description": "..." }],
  "answers": [{ "questionId": "q1", "textAnswer": "..." }],
  "messages": [{ "role": "user", "content": "Help me design an experiment" }]
}
```

## Setup

```bash
cd /home/jess/ssd/dev/medtech-vl-web/adk-assistant
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and set `GROQ_API_KEY`.

## Run

```bash
cd /home/jess/ssd/dev/medtech-vl-web/adk-assistant
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Then set in Next.js environment:

```bash
LAB_ASSISTANT_SERVICE_URL=http://localhost:8001
```

## Notes

- The assistant is configured to **avoid direct final answers** for graded questions.
- It focuses on experiment planning, conceptual guidance, and reasoning checks.
- MCP status and capabilities are read on each request through the lab-specific MCP server.
- The orchestrator keeps short-term workflow memory (`active_goal`, `latest_intent`, `last_actions`).

## Parameter Control via Chat

The assistant can now apply lab changes through MCP for both explicit and implicit requests.

Examples:

- Coulomb's law:
  - "Set distance to 0.08 m"
  - "Increase q1 by 0.2 microC"
- Collision:
  - "Set body 1 mass to 2.4"
  - "Make collision elastic"
  - "Pause the simulation"
- Standing waves:
  - "Set tension to 0.6"
  - "Set end to loose"
  - "Set speed to slow"

When a control action is applied, the assistant reads the updated status snapshot and continues guidance based on the new state.

Implicit examples now supported by semantic planning:

- "The wave is not harmonic. Let's make it harmonic."
- "What are the parameters? Change them a bit."
- "Try different frequency values and guide me on what to observe."

## MCP Tool Surface

Each lab MCP server exposes:

- `get_status`
- `get_capabilities`
- `control`

`get_capabilities` returns supported actions and parameter ranges so planning is dynamic rather than hard-coded.
