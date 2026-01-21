import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { OrderItemOptionsResponse } from "@/types/index.js";
import {
  CreateOrderItemOptionsParamsSchema,
  UpdateOrderItemOptionsParamsSchema,
} from "../schemas/order-item-option.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_create_order_item_options(
  params: z.infer<typeof CreateOrderItemOptionsParamsSchema>,
) {
  try {
    const { order_id, order_item_code, shop_no, request } = params;
    const data = await makeApiRequest<OrderItemOptionsResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/options`,
      "POST",
      {
        shop_no,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Additional options for order item ${order_item_code} in order ${order_id} created successfully.`,
        },
      ],
      structuredContent: { item: data.item },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_item_options(
  params: z.infer<typeof UpdateOrderItemOptionsParamsSchema>,
) {
  try {
    const { order_id, order_item_code, shop_no, request } = params;
    const data = await makeApiRequest<OrderItemOptionsResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/options`,
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
          text: `Additional options for order item ${order_item_code} in order ${order_id} updated successfully.`,
        },
      ],
      structuredContent: { item: data.item },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_create_order_item_options",
    {
      title: "Create Cafe24 Order Item Options",
      description: "Create additional options (custom text fields) for a specific order item.",
      inputSchema: CreateOrderItemOptionsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_order_item_options,
  );

  server.registerTool(
    "cafe24_update_order_item_options",
    {
      title: "Update Cafe24 Order Item Options",
      description: "Update additional options (custom text fields) for a specific order item.",
      inputSchema: UpdateOrderItemOptionsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_item_options,
  );
}
