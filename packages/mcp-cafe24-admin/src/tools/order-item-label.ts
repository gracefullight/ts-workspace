import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  OrderItemLabelDeleteResponse,
  OrderItemLabelResponse,
  OrderItemLabelsResponse,
} from "@/types/index.js";
import {
  OrderItemLabelsCreateParamsSchema,
  OrderItemLabelsDeleteParamsSchema,
  OrderItemLabelsListParamsSchema,
  OrderItemLabelsUpdateParamsSchema,
} from "../schemas/order-item-label.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_order_item_labels(
  params: z.infer<typeof OrderItemLabelsListParamsSchema>,
) {
  try {
    const { order_id, order_item_code, shop_no } = params;
    const data = await makeApiRequest<OrderItemLabelsResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/labels`,
      "GET",
      undefined,
      { shop_no },
    );

    const labels = data.labels;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Labels for Order Item ${order_item_code} (Order: ${order_id})\n\n` +
            (labels.names.length > 0
              ? labels.names.map((name) => `- ${name}`).join("\n")
              : "No labels found."),
        },
      ],
      structuredContent: {
        labels,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_order_item_labels(
  params: z.infer<typeof OrderItemLabelsCreateParamsSchema>,
) {
  try {
    const { order_id, order_item_code, shop_no, request } = params;
    const data = await makeApiRequest<OrderItemLabelResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/labels`,
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
          text: `Successfully added labels to order item ${order_item_code}. Current labels: ${data.label.names.join(", ")}`,
        },
      ],
      structuredContent: {
        label: data.label,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_item_labels(
  params: z.infer<typeof OrderItemLabelsUpdateParamsSchema>,
) {
  try {
    const { order_id, order_item_code, shop_no, request } = params;
    const data = await makeApiRequest<OrderItemLabelResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/labels`,
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
          text: `Successfully updated labels for order item ${order_item_code}. Current labels: ${data.label.names.join(", ")}`,
        },
      ],
      structuredContent: {
        label: data.label,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_order_item_label(
  params: z.infer<typeof OrderItemLabelsDeleteParamsSchema>,
) {
  try {
    const { order_id, order_item_code, name, shop_no } = params;
    const data = await makeApiRequest<OrderItemLabelDeleteResponse>(
      `/admin/orders/${order_id}/items/${order_item_code}/labels/${name}`,
      "DELETE",
      undefined,
      { shop_no },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted label "${name}" from order item ${order_item_code}.`,
        },
      ],
      structuredContent: {
        label: data.label,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_order_item_labels",
    {
      title: "List Cafe24 Order Item Labels",
      description: "Retrieve a list of labels for a specific order item.",
      inputSchema: OrderItemLabelsListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_order_item_labels,
  );

  server.registerTool(
    "cafe24_create_order_item_labels",
    {
      title: "Add Cafe24 Order Item Labels",
      description: "Add new labels to a specific order item.",
      inputSchema: OrderItemLabelsCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_order_item_labels,
  );

  server.registerTool(
    "cafe24_update_order_item_labels",
    {
      title: "Update Cafe24 Order Item Labels",
      description: "Replace/Update all labels for a specific order item.",
      inputSchema: OrderItemLabelsUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_item_labels,
  );

  server.registerTool(
    "cafe24_delete_order_item_label",
    {
      title: "Delete Cafe24 Order Item Label",
      description: "Delete a specific label from an order item.",
      inputSchema: OrderItemLabelsDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_order_item_label,
  );
}
