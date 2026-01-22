import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type AppstorePaymentsCountParams,
  AppstorePaymentsCountParamsSchema,
  type AppstorePaymentsSearchParams,
  AppstorePaymentsSearchParamsSchema,
} from "@/schemas/appstore-payment.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  AppstorePayment,
  AppstorePaymentsCountResponse,
  AppstorePaymentsListResponse,
} from "@/types/index.js";

function formatAppstorePayment(payment: AppstorePayment): string {
  return (
    `## Order ${payment.order_id}\n` +
    `- **Status**: ${payment.payment_status}\n` +
    `- **Title**: ${payment.title}\n` +
    `- **Amount**: ${payment.payment_amount} ${payment.currency}\n` +
    `- **Refund Amount**: ${payment.refund_amount} ${payment.currency}\n` +
    `- **Payment Method**: ${payment.payment_method} (${payment.payment_gateway_name})\n` +
    `- **Approval No**: ${payment.approval_no}\n` +
    `- **Locale**: ${payment.locale_code}\n` +
    `- **Automatic Payment**: ${payment.automatic_payment === "T" ? "Enabled" : "Disabled"}\n` +
    `- **Pay Date**: ${payment.pay_date}\n` +
    `- **Refund Date**: ${payment.refund_date ?? "N/A"}\n` +
    `- **Expiration Date**: ${payment.expiration_date ?? "N/A"}\n`
  );
}

async function cafe24_list_appstore_payments(params: AppstorePaymentsSearchParams) {
  try {
    const { order_id, start_date, end_date, currency, limit, offset } = params;
    const queryParams: Record<string, unknown> = {
      start_date,
      end_date,
      limit,
      offset,
    };
    if (order_id) {
      queryParams.order_id = order_id;
    }
    if (currency) {
      queryParams.currency = currency;
    }

    const data = await makeApiRequest<AppstorePaymentsListResponse>(
      "/admin/appstore/payments",
      "GET",
      undefined,
      queryParams,
    );
    const payments = data.payments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Appstore Payments (Total: ${payments.length} in this page)\n\n` +
            payments.map(formatAppstorePayment).join("\n"),
        },
      ],
      structuredContent: {
        count: payments.length,
        payments,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_appstore_payments(params: AppstorePaymentsCountParams) {
  try {
    const { order_id, start_date, end_date, currency } = params;
    const queryParams: Record<string, unknown> = { start_date, end_date };
    if (order_id) {
      queryParams.order_id = order_id;
    }
    if (currency) {
      queryParams.currency = currency;
    }

    const data = await makeApiRequest<AppstorePaymentsCountResponse>(
      "/admin/appstore/payments/count",
      "GET",
      undefined,
      queryParams,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Appstore payments count: ${data.count}`,
        },
      ],
      structuredContent: {
        count: data.count,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_appstore_payments",
    {
      title: "List Cafe24 Appstore Payments",
      description: "Retrieve app store payments within a date range and optional filters.",
      inputSchema: AppstorePaymentsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_appstore_payments,
  );

  server.registerTool(
    "cafe24_count_appstore_payments",
    {
      title: "Count Cafe24 Appstore Payments",
      description: "Count app store payments within a date range and optional filters.",
      inputSchema: AppstorePaymentsCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_count_appstore_payments,
  );
}
