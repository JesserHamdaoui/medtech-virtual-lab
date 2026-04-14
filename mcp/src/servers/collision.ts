import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CollisionController } from "../controllers/collisionController";
import { jsonTextContent } from "../shared/mcpResponse";

const controller = new CollisionController();

const server = new McpServer({
  name: "collision-lab-server",
  version: "0.1.0",
});

server.registerTool(
  "get_status",
  {
    title: "Get Collision Status",
    description: "Returns current collision simulation state.",
  },
  async () => jsonTextContent(controller.getStatus()),
);

server.registerTool(
  "get_capabilities",
  {
    title: "Get Collision Capabilities",
    description: "Returns supported control actions and parameter ranges.",
  },
  async () => jsonTextContent(controller.getCapabilities()),
);

server.registerTool(
  "control",
  {
    title: "Control Collision Lab",
    description:
      "Apply a control action to the collision lab and return updated state.",
    inputSchema: {
      action: z.enum([
        "start",
        "pause",
        "toggle_play",
        "restart",
        "step",
        "set_elasticity",
        "set_time_speed",
        "set_body_mass",
        "set_body_velocity",
        "set_body_position",
      ]),
      bodyIndex: z.number().int().min(0).max(1).optional(),
      value: z.union([z.number(), z.string(), z.boolean()]).optional(),
      steps: z.number().int().positive().optional(),
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
