import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  OrderReceiverSearchParamsSchema,
  OrderReceiversUpdateParamsSchema,
  OrderReceiverUpdateParamsSchema,
} from "../schemas/order-receiver.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_order_receivers(
  params: z.infer<typeof OrderReceiverSearchParamsSchema>,
) {
  try {
    const { shop_no, order_id, ...rest } = params;
    const data = (await makeApiRequest(`/admin/orders/${order_id}/receivers`, "GET", undefined, {
      shop_no,
      ...rest,
    })) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

async function cafe24_update_order_receivers(
  params: z.infer<typeof OrderReceiversUpdateParamsSchema>,
) {
  try {
    const { shop_no, order_id, requests } = params;
    const data = (await makeApiRequest(`/admin/orders/${order_id}/receivers`, "PUT", {
      shop_no,
      requests,
    })) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

async function cafe24_update_order_receiver(
  params: z.infer<typeof OrderReceiverUpdateParamsSchema>,
) {
  try {
    const { shop_no, order_id, shipping_code, request } = params;
    const data = (await makeApiRequest(
      `/admin/orders/${order_id}/receivers/${shipping_code}`,
      "PUT",
      {
        shop_no,
        request,
      },
    )) as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_order_receivers",
    {
      title: "List Order Receivers",
      description: "Retrieve a list of receivers for a specific order",
      inputSchema: OrderReceiverSearchParamsSchema,
    },
    cafe24_list_order_receivers,
  );

  server.registerTool(
    "cafe24_update_order_receivers",
    {
      title: "Update Multiple Order Receivers",
      description: "Update multiple receivers for a specific order",
      inputSchema: OrderReceiversUpdateParamsSchema,
    },
    cafe24_update_order_receivers,
  );

  server.registerTool(
    "cafe24_update_order_receiver",
    {
      title: "Update Order Receiver",
      description: "Update a specific receiver for a specific order",
      inputSchema: OrderReceiverUpdateParamsSchema,
    },
    cafe24_update_order_receiver,
  );
}
