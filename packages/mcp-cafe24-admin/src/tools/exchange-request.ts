import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { ExchangeRequestResponse } from "@/types/index.js";
import {
  ExchangeRequestAcceptParamsSchema,
  ExchangeRequestCreateParamsSchema,
  ExchangeRequestUpdateParamsSchema,
} from "../schemas/exchange-request.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_create_exchange_request(
  params: z.infer<typeof ExchangeRequestCreateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ exchangerequests: ExchangeRequestResponse[] }>(
      "/admin/exchangerequests",
      "POST",
      {
        shop_no: params.shop_no,
        requests: params.requests,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.exchangerequests.length} exchange request(s).`,
        },
      ],
      structuredContent: {
        results: data.exchangerequests,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_accept_order_exchange_request(
  params: z.infer<typeof ExchangeRequestAcceptParamsSchema>,
) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<{ exchangerequests: ExchangeRequestResponse }>(
      `/admin/orders/${order_id}/exchangerequests`,
      "PUT",
      {
        shop_no,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully accepted exchange request for order #${order_id}.`,
        },
      ],
      structuredContent: {
        exchangerequests: data.exchangerequests,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_exchange_request(
  params: z.infer<typeof ExchangeRequestUpdateParamsSchema>,
) {
  try {
    const data = await makeApiRequest<{ exchangerequests: ExchangeRequestResponse[] }>(
      "/admin/exchangerequests",
      "PUT",
      {
        shop_no: params.shop_no,
        requests: params.requests,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated ${data.exchangerequests.length} exchange request(s).`,
        },
      ],
      structuredContent: {
        results: data.exchangerequests,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_accept_order_exchange_request",
    {
      title: "Accept Cafe24 Order Exchange Request",
      description: "Accepts/Rejects an exchange request for a specific order.",
      inputSchema: ExchangeRequestAcceptParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_accept_order_exchange_request,
  );

  server.registerTool(
    "cafe24_create_exchange_request",
    {
      title: "Create Cafe24 Exchange Request",
      description: "Creates multiple exchange requests for orders in a specific shop.",
      inputSchema: ExchangeRequestCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_exchange_request,
  );

  server.registerTool(
    "cafe24_update_exchange_request",
    {
      title: "Update Cafe24 Exchange Request",
      description: "Rejects (undone) multiple exchange requests for orders in a specific shop.",
      inputSchema: ExchangeRequestUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_exchange_request,
  );
}
