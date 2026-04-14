import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { StandingWavesController } from "../controllers/standingWavesController";
import { jsonTextContent } from "../shared/mcpResponse";

const controller = new StandingWavesController();

const server = new McpServer({
  name: "standing-waves-lab-server",
  version: "0.1.0",
});

server.registerTool(
  "get_status",
  {
    title: "Get Standing Waves Status",
    description: "Returns current standing waves simulation state.",
  },
  async () => jsonTextContent(controller.getStatus()),
);

server.registerTool(
  "get_capabilities",
  {
    title: "Get Standing Waves Capabilities",
    description: "Returns supported control actions and parameter ranges.",
  },
  async () => jsonTextContent(controller.getCapabilities()),
);

server.registerTool(
  "control",
  {
    title: "Control Standing Waves Lab",
    description:
      "Apply a control action to the standing waves lab and return updated state.",
    inputSchema: {
      action: z.enum([
        "play",
        "pause",
        "toggle_play",
        "restart",
        "step",
        "toggle_end",
        "set_end",
        "set_time_speed",
        "set_tension",
        "set_damping",
        "set_frequency",
        "set_amplitude",
        "toggle_oscillation",
        "toggle_rulers",
        "toggle_reference_line",
      ]),
      value: z.union([z.number(), z.string(), z.boolean()]).optional(),
      seconds: z.number().positive().optional(),
    },
  },
  async (input) => {
    try {
      return jsonTextContent(controller.control(input));
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text:
              error instanceof Error ? error.message : "Unknown control error",
          },
        ],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
