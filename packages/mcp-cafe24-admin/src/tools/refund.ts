import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type RefundDetailParams,
  RefundDetailParamsSchema,
  type RefundsSearchParams,
  RefundsSearchParamsSchema,
  type UpdateOrderRefundParams,
  UpdateOrderRefundParamsSchema,
} from "../schemas/refund.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  RefundDetailResponse,
  RefundsResponse,
  UpdateOrderRefundResponse,
} from "../types/refund.js";

async function cafe24_list_refunds(params: RefundsSearchParams) {
  try {
    const { shop_no, ...rest } = params;
    const data = await makeApiRequest<RefundsResponse>("/admin/refunds", "GET", undefined, {
      shop_no,
      ...rest,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${data.refunds.length} refunds.`,
        },
      ],
      structuredContent: {
        refunds: data.refunds,
      },
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

async function cafe24_get_refund_detail(params: RefundDetailParams) {
  try {
    const { refund_code, shop_no, ...rest } = params;
    const data = await makeApiRequest<RefundDetailResponse>(
      `/admin/refunds/${refund_code}`,
      "GET",
      undefined,
      {
        shop_no,
        ...rest,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully retrieved details for refund ${refund_code}`,
        },
      ],
      structuredContent: {
        refund: data.refund,
      },
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

async function cafe24_update_order_refund(params: UpdateOrderRefundParams) {
  try {
    const { order_id, refund_code, shop_no, request } = params;
    const data = await makeApiRequest<UpdateOrderRefundResponse>(
      `/admin/orders/${order_id}/refunds/${refund_code}`,
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
          text: `Successfully processed refund ${refund_code} for order ${order_id}.`,
        },
      ],
      structuredContent: {
        refund: data.refund,
      },
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
    "cafe24_list_refunds",
    {
      title: "List Cafe24 Refunds",
      description: "Retrieve a list of refunds with various search criteria.",
      inputSchema: RefundsSearchParamsSchema,
    },
    cafe24_list_refunds,
  );

  server.registerTool(
    "cafe24_get_refund_detail",
    {
      title: "Get Cafe24 Refund Detail",
      description: "Retrieve detailed information about a specific refund.",
      inputSchema: RefundDetailParamsSchema,
    },
    cafe24_get_refund_detail,
  );

  server.registerTool(
    "cafe24_update_order_refund",
    {
      title: "Update Cafe24 Order Refund",
      description:
        "Process a refund for a specific order. Typically used to complete a refund after approval.",
      inputSchema: UpdateOrderRefundParamsSchema,
    },
    cafe24_update_order_refund,
  );
}
