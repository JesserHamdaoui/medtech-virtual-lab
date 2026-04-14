import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CoulombsLawController } from "../controllers/coulombsLawController";
import { jsonTextContent } from "../shared/mcpResponse";

const controller = new CoulombsLawController();

const server = new McpServer({
  name: "coulombs-law-lab-server",
  version: "0.1.0",
});

server.registerTool(
  "get_status",
  {
    title: "Get Coulomb Status",
    description: "Returns current Coulomb's law simulation state.",
  },
  async () => jsonTextContent(controller.getStatus()),
);

server.registerTool(
  "get_capabilities",
  {
    title: "Get Coulomb Capabilities",
    description: "Returns supported control actions and parameter ranges.",
  },
  async () => jsonTextContent(controller.getCapabilities()),
);

server.registerTool(
  "control",
  {
    title: "Control Coulomb Lab",
    description:
      "Apply a control action to the Coulomb's law lab and return updated state.",
    inputSchema: {
      action: z.enum([
        "reset",
        "set_distance",
        "nudge_distance",
        "set_charge_a",
        "set_charge_b",
        "nudge_charge_a",
        "nudge_charge_b",
      ]),
      value: z.number().optional(),
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
