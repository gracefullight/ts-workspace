import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  CreateOrderItemsResponse,
  ListOrderItemsResponse,
  UpdateOrderItemResponse,
} from "@/types/index.js";
import {
  CreateOrderItemsParamsSchema,
  OrderItemSearchParamsSchema,
  UpdateOrderItemParamsSchema,
} from "../schemas/order-item.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_order_items(params: z.infer<typeof OrderItemSearchParamsSchema>) {
  try {
    const { order_id, ...queryParams } = params;
    const data = await makeApiRequest<ListOrderItemsResponse>(
      `/admin/orders/${order_id}/items`,
      "GET",
      undefined,
      queryParams,
    );

    const items = data.items || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Cafe24 Order Items for Order #${order_id} (Total: ${items.length})\n\n` +
            items
              .map(
                (item) =>
                  `## ${item.product_name} (${item.order_item_code})\n` +
                  `- **Variant Code**: ${item.variant_code}\n` +
                  `- **Quantity**: ${item.quantity}\n` +
                  `- **Item Price**: ${item.product_price}\n` +
                  `- **Status**: ${item.status_text} (${item.order_status})\n` +
                  `- **Tracking No**: ${item.tracking_no || "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { items },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_order_items(params: z.infer<typeof CreateOrderItemsParamsSchema>) {
  try {
    const { order_id, shop_no, requests } = params;
    const data = await makeApiRequest<CreateOrderItemsResponse>(
      `/admin/orders/${order_id}/items`,
      "POST",
      {
        shop_no,
        requests,
      },
    );

    const items = data.items || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully added/split ${items.length} items for Order #${order_id}.`,
        },
      ],
      structuredContent: { items },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_item(params: z.infer<typeof UpdateOrderItemParamsSchema>) {
  try {
    const { order_id, order_item_code, shop_no, request } = params;
    const data = await makeApiRequest<UpdateOrderItemResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}`,
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
          text: `Order item ${order_item_code} in Order #${order_id} updated successfully.`,
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
    "cafe24_list_order_items",
    {
      title: "List Cafe24 Order Items",
      description: "Retrieve items included in a specific order by order ID.",
      inputSchema: OrderItemSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_items,
  );

  server.registerTool(
    "cafe24_create_order_items",
    {
      title: "Create Cafe24 Order Items",
      description:
        "Add or split items in an existing order. Typically used for bundle split or adding new variants.",
      inputSchema: CreateOrderItemsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_order_items,
  );

  server.registerTool(
    "cafe24_update_order_item",
    {
      title: "Update Cafe24 Order Item",
      description:
        "Update details of a specific order item, such as cancellation/exchange requests or shipping labels.",
      inputSchema: UpdateOrderItemParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_item,
  );
}
