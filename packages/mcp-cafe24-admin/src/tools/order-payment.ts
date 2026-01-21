import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  ListOrderPaymentTimelineResponse,
  OrderPaymentTimelineDetailResponse,
  UpdateOrderPaymentResponse,
  UpdatePaymentsResponse,
} from "@/types/index.js";
import {
  OrderPaymentTimelineDetailParamsSchema,
  OrderPaymentTimelineSearchParamsSchema,
  UpdateOrderPaymentParamsSchema,
  UpdatePaymentsParamsSchema,
} from "../schemas/order-payment.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_update_payments_status(params: z.infer<typeof UpdatePaymentsParamsSchema>) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<UpdatePaymentsResponse>("/admin/payments", "PUT", {
      shop_no,
      requests,
    });

    const payments = data.payments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Statuses Updated (Total: ${payments.length})\n\n` +
            payments
              .map(
                (p) =>
                  `## Order #${p.order_id}\n` +
                  `- **Status**: ${p.status}\n` +
                  `- **Payment No**: ${p.payment_no}\n` +
                  (p.cancel_request
                    ? `- **Refund Status**: ${p.cancel_request.refund_status}\n` +
                      `- **Partial Cancel**: ${p.cancel_request.partial_cancel}\n`
                    : ""),
              )
              .join("\n"),
        },
      ],
      structuredContent: { payments },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_payment(params: z.infer<typeof UpdateOrderPaymentParamsSchema>) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<UpdateOrderPaymentResponse>(
      `/admin/orders/${order_id}/payments`,
      "PUT",
      {
        shop_no,
        request,
      },
    );

    const payment = data.payment;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Details Updated for Order #${payment.order_id}\n\n` +
            `- **Payment Method**: ${payment.payment_method}\n` +
            `- **Initial Estimated**: ${payment.initial_estimated_payment_amount}\n` +
            `- **Additional Amount**: ${payment.admin_additional_amount || "0"}\n` +
            `- **Reason**: ${payment.change_payment_amount_reason || "N/A"}\n`,
        },
      ],
      structuredContent: { payment },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_order_payment_timeline(
  params: z.infer<typeof OrderPaymentTimelineSearchParamsSchema>,
) {
  try {
    const { order_id, ...queryParams } = params;
    const data = await makeApiRequest<ListOrderPaymentTimelineResponse>(
      `/admin/orders/${order_id}/paymenttimeline`,
      "GET",
      undefined,
      queryParams,
    );

    const timeline = data.paymenttimeline || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Timeline for Order #${order_id} (Total: ${timeline.length})\n\n` +
            timeline
              .map(
                (p) =>
                  `## Payment #${p.payment_no}\n` +
                  `- **Type**: ${p.payment_settle_type === "O" ? "Initial" : p.payment_settle_type === "R" ? "Additional" : "Refund"}\n` +
                  `- **Methods**: ${p.payment_methods.join(", ")}\n` +
                  `- **Order Amount**: ${p.order_amount}\n` +
                  `- **Paid Amount**: ${p.paid_amount}\n` +
                  `- **Date**: ${p.payment_datetime}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { paymenttimeline: timeline },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_order_payment_timeline_detail(
  params: z.infer<typeof OrderPaymentTimelineDetailParamsSchema>,
) {
  try {
    const { order_id, payment_no, shop_no } = params;
    const data = await makeApiRequest<OrderPaymentTimelineDetailResponse>(
      `/admin/orders/${order_id}/paymenttimeline/${payment_no}`,
      "GET",
      undefined,
      { shop_no },
    );

    const p = data.paymenttimeline;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Timeline Detail: Order #${order_id}, Payment #${payment_no}\n\n` +
            `- **Type**: ${p.payment_settle_type === "O" ? "Initial" : p.payment_settle_type === "R" ? "Additional" : "Refund"}\n` +
            `- **Order Amount**: ${p.order_amount}\n` +
            `- **Paid Amount**: ${p.paid_amount}\n` +
            `- **Date**: ${p.payment_datetime}\n` +
            `\n## Payment Methods Detail\n` +
            (p.payment_method_detail?.map((m) => `- ${m.name}: ${m.amount}`).join("\n") || "N/A") +
            `\n\n## Order Amount Detail\n` +
            (p.order_amount_detail
              ?.map((d) => `- ${d.name} (${d.order_item_code || "N/A"}): ${d.amount}`)
              .join("\n") || "N/A"),
        },
      ],
      structuredContent: { paymenttimeline: p },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_update_order_payment",
    {
      title: "Update Cafe24 Order Payment",
      description: "Update payment amount or method for a specific order.",
      inputSchema: UpdateOrderPaymentParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_payment,
  );

  server.registerTool(
    "cafe24_update_payments_status",
    {
      title: "Update Cafe24 Payments Status",
      description: "Update payment status (paid, unpaid, canceled) for multiple orders.",
      inputSchema: UpdatePaymentsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_payments_status,
  );

  server.registerTool(
    "cafe24_list_order_payment_timeline",
    {
      title: "List Cafe24 Order Payment Timeline",
      description:
        "Retrieve the payment timeline (initial payments, additional payments, and refunds) for an order.",
      inputSchema: OrderPaymentTimelineSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_payment_timeline,
  );

  server.registerTool(
    "cafe24_get_order_payment_timeline_detail",
    {
      title: "Get Cafe24 Order Payment Timeline Detail",
      description:
        "Retrieve detailed information about a specific payment timeline entry, including breakdown by payment method and order items.",
      inputSchema: OrderPaymentTimelineDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_get_order_payment_timeline_detail,
  );
}
