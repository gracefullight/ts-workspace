import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { GetOrderPaymentAmountParamsSchema } from "../schemas/order-payment-amount.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { GetOrderPaymentAmountResponse } from "../types/index.js";

async function cafe24_get_order_payment_amount(
  params: z.infer<typeof GetOrderPaymentAmountParamsSchema>,
) {
  try {
    const { order_item_code, shop_no } = params;
    const data = await makeApiRequest<GetOrderPaymentAmountResponse>(
      "/admin/orders/paymentamount",
      "GET",
      undefined,
      {
        order_item_code,
        shop_no,
      },
    );

    const paymentAmounts = data.paymentamount || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Payment Amount Details (Total: ${paymentAmounts.length})\n\n` +
            paymentAmounts
              .map(
                (item) =>
                  `## Item Code: ${item.order_item_code}\n` +
                  `- **Product Price**: ${item.items.product_price} (Option: ${item.items.option_price}, Qty: ${item.items.quantity})\n` +
                  `- **Order Price**: ${item.order_price_amount}\n` +
                  `- **Payment Amount**: ${item.payment_amount}\n` +
                  `- **Additional Payment**: ${item.additional_payment_amount}\n` +
                  `- **Order Discount**: Membership: ${item.order_discount_amount.membership_discount_amount}, Coupon: ${item.order_discount_amount.coupon_discount_price}, App: ${item.order_discount_amount.app_discount_amount}\n` +
                  `- **Item Discount**: Additional: ${item.item_discount_amount.additional_discount_price}, Coupon: ${item.item_discount_amount.coupon_discount_price}, App: ${item.item_discount_amount.app_discount_amount}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { paymentamount: paymentAmounts },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_payment_amount",
    {
      title: "Get Order Payment Amount",
      description: "Retrieve payment amount details for specific order item codes.",
      inputSchema: GetOrderPaymentAmountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order_payment_amount,
  );
}
