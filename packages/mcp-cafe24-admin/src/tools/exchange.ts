import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { Exchange } from "@/types/index.js";
import {
  ExchangeCreateParamsSchema,
  ExchangeDetailParamsSchema,
  ExchangeUpdateParamsSchema,
} from "../schemas/exchange.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_get_exchange(params: z.infer<typeof ExchangeDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ exchange: Exchange }>(
      `/admin/exchange/${params.claim_code}`,
      "GET",
      undefined,
      { shop_no: params.shop_no },
    );
    const exchange = data.exchange;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Exchange Details: ${exchange.claim_code}\n\n` +
            `- **Order ID**: ${exchange.order_id}\n` +
            `- **Status**: ${exchange.claim_reason}\n` +
            `- **Reason Type**: ${exchange.claim_reason_type}\n` +
            `- **Customer**: ${exchange.receiver.name}\n` +
            `- **Address**: ${exchange.receiver.address}\n\n` +
            `## Items to Exchange\n` +
            exchange.items
              .map(
                (item) =>
                  `- ${item.product_name} (${item.variant_code}) x ${item.quantity}\n` +
                  `  - Status: ${item.status_text}\n`,
              )
              .join("") +
            (exchange.exchanged_items.length > 0
              ? `\n## Exchanged Items\n` +
                exchange.exchanged_items
                  .map(
                    (item) => `- ${item.product_name} (${item.variant_code}) x ${item.quantity}\n`,
                  )
                  .join("")
              : ""),
        },
      ],
      structuredContent: {
        exchange,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_exchange(params: z.infer<typeof ExchangeCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ exchange: any[] }>("/admin/exchange", "POST", {
      shop_no: params.shop_no,
      requests: params.requests,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.exchange.length} exchange request(s).`,
        },
      ],
      structuredContent: {
        results: data.exchange,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_exchange(params: z.infer<typeof ExchangeUpdateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ exchange: any[] }>("/admin/exchange", "PUT", {
      shop_no: params.shop_no,
      requests: params.requests,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated ${data.exchange.length} exchange request(s).`,
        },
      ],
      structuredContent: {
        results: data.exchange,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_exchange",
    {
      title: "Get Cafe24 Exchange Details",
      description: "Retrieve detailed information about a specific exchange by its claim code.",
      inputSchema: ExchangeDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_get_exchange,
  );

  server.registerTool(
    "cafe24_create_exchange",
    {
      title: "Create Cafe24 Exchange",
      description: "Create new exchange requests for orders.",
      inputSchema: ExchangeCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_exchange,
  );

  server.registerTool(
    "cafe24_update_exchange",
    {
      title: "Update Cafe24 Exchange",
      description: "Update existing exchange requests (status, pickup, information).",
      inputSchema: ExchangeUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_exchange,
  );
}
