import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { FulfillmentResponse } from "@/types/index.js";
import { FulfillmentCreateParamsSchema } from "../schemas/fulfillment.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_create_fulfillment(params: z.infer<typeof FulfillmentCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<FulfillmentResponse>("/admin/fulfillments", "POST", {
      shop_no: params.shop_no,
      requests: params.requests,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.fulfillments.length} fulfillment(s).`,
        },
      ],
      structuredContent: {
        results: data.fulfillments,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_create_fulfillment",
    {
      title: "Create Cafe24 Fulfillment",
      description:
        "Creates multiple fulfillments (shipping records) for orders in a specific shop.",
      inputSchema: FulfillmentCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_fulfillment,
  );
}
