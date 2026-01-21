import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CreateOrderMemoParamsSchema,
  DeleteOrderMemoParamsSchema,
  OrderMemoSearchParamsSchema,
  UpdateOrderMemoParamsSchema,
} from "../schemas/order-memo.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  CreateOrderMemoResponse,
  DeleteOrderMemoResponse,
  ListOrderMemosResponse,
  UpdateOrderMemoResponse,
} from "../types/order-memo.js";

async function cafe24_list_order_memos(params: z.infer<typeof OrderMemoSearchParamsSchema>) {
  try {
    const { order_id, shop_no, limit, offset } = params;
    const data = await makeApiRequest<ListOrderMemosResponse>(
      `/admin/orders/memos`,
      "GET",
      undefined,
      {
        shop_no,
        order_id,
        limit,
        offset,
      },
    );

    const memos = data.memos || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Cafe24 Order Memos (Total: ${memos.length})\n\n` +
            memos
              .map(
                (memo) =>
                  `## Memo #${memo.memo_no} (${memo.created_date})\n` +
                  `- **Order ID**: ${memo.order_id}\n` +
                  `- **Author**: ${memo.author_id}\n` +
                  `- **Content**: ${memo.content}\n` +
                  `- **Type**: ${memo.attach_type === "O" ? "Order Attachment" : "Product Attachment"}\n` +
                  `- **Fixed**: ${memo.fixed === "T" ? "Yes" : "No"}\n` +
                  `- **Starred**: ${memo.starred_memo === "T" ? "Yes" : "No"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { memos },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_order_memo(params: z.infer<typeof CreateOrderMemoParamsSchema>) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<CreateOrderMemoResponse>(
      `/admin/orders/${order_id}/memos`,
      "POST",
      {
        shop_no,
        request,
      },
    );

    const memo = data.memo;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created memo #${memo.memo_no} for Order #${order_id}.`,
        },
      ],
      structuredContent: { memo },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_memo(params: z.infer<typeof UpdateOrderMemoParamsSchema>) {
  try {
    const { order_id, memo_no, shop_no, request } = params;
    const data = await makeApiRequest<UpdateOrderMemoResponse>(
      `/admin/orders/${order_id}/memos/${memo_no}`,
      "PUT",
      {
        shop_no,
        request,
      },
    );

    const memo = data.memo;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated memo #${memo.memo_no} for Order #${order_id}.`,
        },
      ],
      structuredContent: { memo },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_order_memo(params: z.infer<typeof DeleteOrderMemoParamsSchema>) {
  try {
    const { order_id, memo_no, shop_no } = params;
    const data = await makeApiRequest<DeleteOrderMemoResponse>(
      `/admin/orders/${order_id}/memos/${memo_no}`,
      "DELETE",
      undefined,
      { shop_no },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted memo #${memo_no} from Order #${order_id}.`,
        },
      ],
      structuredContent: { memo: data.memo },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_order_memos",
    {
      title: "List Cafe24 Order Memos",
      description: "Retrieve memos for specific order(s). Can search multiple orders with comma.",
      inputSchema: OrderMemoSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_memos,
  );

  server.registerTool(
    "cafe24_create_order_memo",
    {
      title: "Create Cafe24 Order Memo",
      description: "Create a new memo for a specific order.",
      inputSchema: CreateOrderMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_order_memo,
  );

  server.registerTool(
    "cafe24_update_order_memo",
    {
      title: "Update Cafe24 Order Memo",
      description: "Update an existing memo for a specific order.",
      inputSchema: UpdateOrderMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_memo,
  );

  server.registerTool(
    "cafe24_delete_order_memo",
    {
      title: "Delete Cafe24 Order Memo",
      description: "Delete a memo from a specific order.",
      inputSchema: DeleteOrderMemoParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_order_memo,
  );
}
