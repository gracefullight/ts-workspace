import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type {
  CreateShippingFeeCancellationResponse,
  ListShippingFeeCancellationsResponse,
} from "@/types/index.js";
import {
  CreateShippingFeeCancellationParamsSchema,
  ShippingFeeCancellationSearchParamsSchema,
} from "../schemas/shipping-fee-cancellation.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_shipping_fee_cancellations(
  params: z.infer<typeof ShippingFeeCancellationSearchParamsSchema>,
) {
  try {
    const { order_id, ...queryParams } = params;
    const data = await makeApiRequest<ListShippingFeeCancellationsResponse>(
      `/admin/orders/${order_id}/shippingfeecancellation`,
      "GET",
      undefined,
      queryParams,
    );

    const cancellations = data.shippingfeecancellation || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Shipping Fee Cancellations for Order #${order_id} (Total: ${cancellations.length})\n\n` +
            cancellations
              .map(
                (c) =>
                  `## Cancellation #${c.claim_code}\n` +
                  `- **Status**: ${c.status}\n` +
                  `- **Reason**: ${c.claim_reason} (${c.claim_reason_type})\n` +
                  `- **Amount**: ${c.refund_amount}\n` +
                  `- **Method**: ${c.refund_method}\n` +
                  `- **Default Fee**: ${c.default_shipping_fee}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { shippingfeecancellation: cancellations },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_shipping_fee_cancellation(
  params: z.infer<typeof CreateShippingFeeCancellationParamsSchema>,
) {
  try {
    const { order_id, shop_no, request } = params;
    const data = await makeApiRequest<CreateShippingFeeCancellationResponse>(
      `/admin/orders/${order_id}/shippingfeecancellation`,
      "POST",
      {
        shop_no,
        request,
      },
    );

    const result = data.shippingfeecancellation;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created shipping fee cancellation for Order #${order_id}. Claim Code: ${result.claim_code}`,
        },
      ],
      structuredContent: { shippingfeecancellation: result },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_shipping_fee_cancellations",
    {
      title: "List Cafe24 Shipping Fee Cancellations",
      description: "Retrieve shipping fee cancellation details for a specific order.",
      inputSchema: ShippingFeeCancellationSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_shipping_fee_cancellations,
  );

  server.registerTool(
    "cafe24_create_shipping_fee_cancellation",
    {
      title: "Create Cafe24 Shipping Fee Cancellation",
      description: "Submit a request to cancel the shipping fee for an order.",
      inputSchema: CreateShippingFeeCancellationParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_shipping_fee_cancellation,
  );
}
