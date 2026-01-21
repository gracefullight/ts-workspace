import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type GetOrderDashboardParams,
  GetOrderDashboardParamsSchema,
} from "../schemas/order-dashboard.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { GetOrderDashboardResponse } from "../types/order-dashboard.js";

async function cafe24_get_order_dashboard(params: GetOrderDashboardParams) {
  try {
    const { shop_no } = params;
    const data = (await makeApiRequest<GetOrderDashboardResponse>(
      "/admin/orders/dashboard",
      "GET",
      undefined,
      { shop_no },
    )) as unknown as Record<string, unknown>;

    const dashboard = (data.dashboard as any) || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Order Dashboard (Shop #${dashboard.shop_no || shop_no})\n\n` +
            `## Order Counts\n` +
            `- **Total Orders**: ${dashboard.total_order_count || 0}\n` +
            `- **Total Paid**: ${dashboard.total_paid_count || 0}\n` +
            `- **Total Refunds**: ${dashboard.total_refund_count || 0}\n\n` +
            `## Amounts\n` +
            `- **Order Amount**: ${dashboard.total_order_amount || "0.00"}\n` +
            `- **Paid Amount**: ${dashboard.total_paid_amount || "0.00"}\n` +
            `- **Refund Amount**: ${dashboard.total_refund_amount || "0.00"}\n\n` +
            `## Claims Status\n` +
            `### Requests\n` +
            `- **Cancellation**: ${dashboard.cancellation_request_count || 0}\n` +
            `- **Exchange**: ${dashboard.exchange_request_count || 0}\n` +
            `- **Return**: ${dashboard.return_request_count || 0}\n\n` +
            `### Processing\n` +
            `- **Cancellation**: ${dashboard.cancellation_processing_count || 0}\n` +
            `- **Exchange**: ${dashboard.exchange_processing_count || 0}\n` +
            `- **Return**: ${dashboard.return_processing_count || 0}\n\n` +
            `### Received\n` +
            `- **Cancellation**: ${dashboard.cancellation_received_count || 0}\n` +
            `- **Exchange**: ${dashboard.exchange_received_count || 0}\n` +
            `- **Return**: ${dashboard.return_received_count || 0}\n\n` +
            `- **Refund Pending**: ${dashboard.refund_pending_count || 0}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_dashboard",
    {
      title: "Get Cafe24 Order Dashboard",
      description: "Retrieve dashboard statistics related to orders, claims, and sales amounts.",
      inputSchema: GetOrderDashboardParamsSchema,
    },
    cafe24_get_order_dashboard,
  );
}
