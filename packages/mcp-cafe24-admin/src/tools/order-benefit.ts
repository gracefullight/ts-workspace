import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { ListOrderBenefitsResponse, ListOrderCouponsResponse } from "@/types/index.js";
import {
  OrderBenefitsSearchParamsSchema,
  OrderCouponsSearchParamsSchema,
} from "../schemas/order-benefit.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_order_benefits(params: z.infer<typeof OrderBenefitsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<ListOrderBenefitsResponse>(
      "/admin/orders/benefits",
      "GET",
      undefined,
      params,
    );

    const benefits = data.benefits || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Cafe24 Order Benefits (Total: ${benefits.length})\n\n` +
            benefits
              .map(
                (b) =>
                  `## Benefit #${b.benefit_no} - ${b.benefit_title}\n` +
                  `- **Order ID**: ${b.order_id}\n` +
                  `- **Item Code**: ${b.order_item_code}\n` +
                  `- **Name**: ${b.benefit_name}\n` +
                  `- **Code**: ${b.benefit_code}\n` +
                  `- **Value**: ${b.benefit_value}${b.benefit_percent ? ` (${b.benefit_percent})` : ""}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { benefits },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_order_coupons(params: z.infer<typeof OrderCouponsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<ListOrderCouponsResponse>(
      "/admin/orders/coupons",
      "GET",
      undefined,
      params,
    );

    const coupons = data.coupons || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Cafe24 Order Coupons (Total: ${coupons.length})\n\n` +
            coupons
              .map(
                (c) =>
                  `## Coupon: ${c.coupon_name} (${c.coupon_code})\n` +
                  `- **Order ID**: ${c.order_id}\n` +
                  `- **Item Code**: ${c.order_item_code}\n` +
                  `- **Value**: ${c.coupon_value}${c.coupon_percent ? ` (${c.coupon_percent})` : ""}\n` +
                  `- **Final Discount**: ${c.coupon_value_final}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { coupons },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_order_benefits",
    {
      title: "List Cafe24 Order Benefits",
      description: "Retrieve benefit information applied to orders, such as discounts.",
      inputSchema: OrderBenefitsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_benefits,
  );

  server.registerTool(
    "cafe24_list_order_coupons",
    {
      title: "List Cafe24 Order Coupons",
      description: "Retrieve coupon information applied to orders.",
      inputSchema: OrderCouponsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_order_coupons,
  );
}
