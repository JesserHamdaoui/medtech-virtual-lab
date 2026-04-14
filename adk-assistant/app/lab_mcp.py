import asyncio
import os
from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


@dataclass
class LabServerConfig:
    command: str
    args: list[str]


def _server_config(lab_id: str) -> LabServerConfig:
    default_mcp_dir = str(Path(__file__).resolve().parents[2] / "mcp")
    mcp_dir = os.getenv("MCP_WORKSPACE", default_mcp_dir)
    run_map = {
        "collision": "collision",
        "laws-of-collisions": "collision",
        "coulombs-law": "coulombs-law",
        "standing-waves": "standing-waves",
    }

    npm_script = run_map.get(lab_id, "collision")
    return LabServerConfig(
        command="npm",
        args=["--prefix", mcp_dir, "run", npm_script],
    )


@asynccontextmanager
async def _session_for_lab(lab_id: str):
    config = _server_config(lab_id)
    server = StdioServerParameters(command=config.command, args=config.args)

    async with stdio_client(server) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session


async def get_lab_status(lab_id: str) -> dict:
    return await call_lab_tool(lab_id, "get_status", {})


async def get_lab_capabilities(lab_id: str) -> dict:
    return await call_lab_tool(lab_id, "get_capabilities", {})


async def get_lab_status_syncable(lab_id: str) -> dict:
    return await get_lab_status(lab_id)


async def call_lab_tool(lab_id: str, tool_name: str, payload: dict) -> dict:
    async with _session_for_lab(lab_id) as session:
        result = await session.call_tool(tool_name, payload)
        text = "{}"
        if result.content and len(result.content) > 0:
            text = getattr(result.content[0], "text", "{}")
        return _safe_json_parse(text)


async def apply_lab_control(lab_id: str, control_payload: dict) -> dict:
    return await call_lab_tool(lab_id, "control", control_payload)


async def apply_lab_controls(lab_id: str, control_payloads: list[dict]) -> dict:
    applied_actions: list[dict] = []
    current_state: dict = {}

    async with _session_for_lab(lab_id) as session:
        for payload in control_payloads:
            result = await session.call_tool("control", payload)
            text = "{}"
            if result.content and len(result.content) > 0:
                text = getattr(result.content[0], "text", "{}")

            current_state = _safe_json_parse(text)
            applied_actions.append(payload)

    return {
        "status_snapshot": current_state,
        "applied_actions": applied_actions,
    }


def _safe_json_parse(raw: str) -> dict:
    import json

    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
        return {"value": data}
    except Exception:
        return {"raw": raw}


def get_lab_status_sync(lab_id: str) -> dict:
    return asyncio.run(get_lab_status(lab_id))
