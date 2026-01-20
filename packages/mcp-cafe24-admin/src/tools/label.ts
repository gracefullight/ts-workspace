import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { LabelsCreateResponse, LabelsListResponse } from "@/types/index.js";
import { LabelsCreateParamsSchema, LabelsSearchParamsSchema } from "../schemas/label.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_labels(params: z.infer<typeof LabelsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<LabelsListResponse>("/admin/labels", "GET", undefined, {
      shop_no: params.shop_no,
      limit: params.limit,
      offset: params.offset,
    });

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Order Labels (Shop: ${data.labels.shop_no})\n\n` +
            data.labels.names.map((name) => `- ${name}`).join("\n"),
        },
      ],
      structuredContent: {
        labels: data.labels,
        links: data.links,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_labels(params: z.infer<typeof LabelsCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<LabelsCreateResponse>("/admin/labels", "POST", {
      shop_no: params.shop_no,
      requests: params.requests,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.labels.length} label(s).`,
        },
      ],
      structuredContent: {
        results: data.labels,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_labels",
    {
      title: "List Cafe24 Order Labels",
      description: "Retrieve a list of order labels for a specific shop.",
      inputSchema: LabelsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_labels,
  );

  server.registerTool(
    "cafe24_create_labels",
    {
      title: "Create Cafe24 Order Labels",
      description: "Creates multiple labels for order items in a specific shop.",
      inputSchema: LabelsCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_labels,
  );
}
