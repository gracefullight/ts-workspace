import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const OrdersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    order_id: z.string().optional().describe("Filter by specific order ID(s), comma-separated"),
    start_date: z.string().optional().describe("Filter orders from this date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Filter orders until this date (YYYY-MM-DD)"),
    order_status_code: z.string().optional().describe("Filter by order status code"),
  })
  .strict();

const OrderDetailParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
  })
  .strict();

const OrderUpdateStatusParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    order_status_code: z.string().describe("New order status code"),
  })
  .strict();

async function cafe24_list_orders(params: z.infer<typeof OrdersSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/orders", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.order_id ? { order_id: params.order_id.split(",") } : {}),
      ...(params.start_date ? { start_date: params.start_date } : {}),
      ...(params.end_date ? { end_date: params.end_date } : {}),
      ...(params.order_status_code ? { order_status_code: params.order_status_code } : {}),
    });

    const orders = data.orders || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} orders (showing ${orders.length})\n\n` +
            orders
              .map(
                (o: any) =>
                  `## Order #${o.order_id}\n` +
                  `- **Order Name**: ${o.order_name}\n` +
                  `- **Status**: ${o.order_status_name} (${o.order_status_code})\n` +
                  `- **Payment Status**: ${o.payment_status_name}\n` +
                  `- **Amount**: ${o.settle_amount} ${data.currency || "KRW"}\n` +
                  `- **Customer**: ${o.customer_name} (${o.customer_id})\n` +
                  `- **Date**: ${o.order_date}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: orders.length,
        offset: params.offset,
        orders: orders.map((o: any) => ({
          id: o.order_id,
          name: o.order_name,
          status_code: o.order_status_code,
          status_name: o.order_status_name,
          payment_status: o.payment_status,
          payment_status_name: o.payment_status_name,
          amount: o.settle_amount,
          currency: o.currency,
          order_date: o.order_date,
          customer_id: o.customer_id,
          customer_name: o.customer_name,
        })),
        has_more: total > params.offset + orders.length,
        ...(total > params.offset + orders.length
          ? { next_offset: params.offset + orders.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_order(params: z.infer<typeof OrderDetailParamsSchema>) {
  try {
    const data = await makeApiRequest(`/admin/orders/${params.order_id}`, "GET");
    const order = data.order || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Order Details\n\n` +
            `- **Order ID**: ${order.order_id}\n` +
            `- **Order Name**: ${order.order_name}\n` +
            `- **Status**: ${order.order_status_name}\n` +
            `- **Payment Status**: ${order.payment_status_name}\n` +
            `- **Amount**: ${order.settle_amount} ${order.currency || "KRW"}\n` +
            `- **Customer**: ${order.customer_name} (${order.customer_id})\n` +
            `- **Order Date**: ${order.order_date}\n`,
        },
      ],
      structuredContent: {
        id: order.order_id,
        name: order.order_name,
        status_code: order.order_status_code,
        status_name: order.order_status_name,
        payment_status: order.payment_status,
        payment_status_name: order.payment_status_name,
        amount: order.settle_amount,
        currency: order.currency,
        order_date: order.order_date,
        customer_id: order.customer_id,
        customer_name: order.customer_name,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_status(params: z.infer<typeof OrderUpdateStatusParamsSchema>) {
  try {
    await makeApiRequest(`/admin/orders/${params.order_id}`, "PUT", {
      order_status_code: params.order_status_code,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Order #${params.order_id} status updated to ${params.order_status_code}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_orders",
    {
      title: "List Cafe24 Orders",
      description:
        "Retrieve a list of orders from Cafe24. Returns order details including order ID, name, status codes, payment status, amount, customer info, and order date. Supports extensive filtering by order ID, date range, and order status code. Paginated results.",
      inputSchema: OrdersSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_orders,
  );

  server.registerTool(
    "cafe24_get_order",
    {
      title: "Get Cafe24 Order Details",
      description:
        "Retrieve detailed information about a specific order by order ID. Returns complete order details including status, payment info, amount, customer, and order date.",
      inputSchema: OrderDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order,
  );

  server.registerTool(
    "cafe24_update_order_status",
    {
      title: "Update Cafe24 Order Status",
      description:
        "Update the status of an existing order in Cafe24. Requires order ID and new status code.",
      inputSchema: OrderUpdateStatusParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_status,
  );
}
