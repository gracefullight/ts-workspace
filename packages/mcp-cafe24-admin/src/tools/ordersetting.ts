import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const OrderSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const IndividualStockRecoverSchema = z
  .object({
    cancel_before: z
      .enum(["T", "F", "M"])
      .optional()
      .nullable()
      .describe("Cancel before payment: T=Auto, F=No Auto, M=Check"),
    cancel_after: z
      .enum(["T", "F", "M"])
      .optional()
      .nullable()
      .describe("Cancel after payment: T=Auto, F=No Auto, M=Check"),
    cancel_return: z
      .enum(["T", "F", "M"])
      .optional()
      .nullable()
      .describe("Return: T=Auto, F=No Auto, M=Check"),
  })
  .strict();

const OrderSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    claim_request: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable buyer claim request: T=Yes, F=No"),
    claim_request_type: z
      .enum(["S", "D"])
      .optional()
      .describe("Claim request type: S=Standard, D=Detailed"),
    claim_request_button_exposure: z
      .array(z.string())
      .optional()
      .describe("Claim button exposure range (e.g., cancel_N10, return_N40)"),
    claim_request_button_date_type: z
      .enum(["order_date", "shipend_date"])
      .optional()
      .describe("Claim button date type"),
    claim_request_button_period: z
      .number()
      .int()
      .min(1)
      .max(365)
      .optional()
      .describe("Claim button exposure period (days)"),
    stock_recover: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto stock recover: T=Basic, F=Individual"),
    stock_recover_base: z
      .enum(["T", "F", "M"])
      .optional()
      .describe("Basic stock recover: T=Yes, F=No, M=Check"),
    stock_recover_individual: IndividualStockRecoverSchema.optional().describe(
      "Individual stock recover settings",
    ),
    refund_processing_setting: z
      .enum(["S", "D"])
      .optional()
      .describe("Refund processing: S=Simultaneous, D=Separate"),
    claim_request_auto_accept: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto accept buyer claims: T=Yes, F=No"),
    refund_benefit_setting: z
      .enum(["F", "T", "U"])
      .optional()
      .describe("Refund benefit: F=Total, T=Selected, U=Auto Calc"),
    use_product_prepare_status: z
      .enum(["T", "F"])
      .optional()
      .describe("Use 'Preparing Product' status: T=Yes, F=No"),
    use_purchase_confirmation_button: z
      .enum(["T", "F"])
      .optional()
      .describe("Use purchase confirmation button: T=Yes, F=No"),
    purchase_confirmation_button_set_date: z
      .string()
      .optional()
      .nullable()
      .describe("Purchase confirmation button set date (YYYY-MM-DD)"),
    use_purchase_confirmation_auto_check: z
      .enum(["T", "F"])
      .optional()
      .describe("Use auto purchase confirmation check: T=Yes, F=No"),
    purchase_confirmation_auto_check_day: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .nullable()
      .describe("Auto purchase confirmation check days"),
    purchase_confirmation_auto_check_set_date: z
      .string()
      .optional()
      .nullable()
      .describe("Auto purchase confirmation check set date (YYYY-MM-DD)"),
    use_additional_fields: z
      .enum(["T", "F"])
      .optional()
      .describe("Use additional fields: T=Yes, F=No"),
    customer_pays_return_shipping: z
      .enum(["T", "F"])
      .optional()
      .describe("Customer pays return shipping: T=Yes, F=No"),
    refund_bank_account_required: z
      .enum(["T", "F"])
      .optional()
      .describe("Refund bank account required: T=Yes, F=No"),
    exchange_shipping_fee: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Exchange shipping fee (round trip)"),
    return_shipping_fee: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Return shipping fee (one way)"),
    auto_delivery_completion: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto delivery completion check: T=Yes, F=No"),
    delivery_completion_after_days: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .describe("Days after delivery to complete"),
    receiver_address_modify_button_exposure: z
      .array(z.string())
      .optional()
      .describe("Address modify button exposure range"),
    auto_cancel: z.enum(["T", "F"]).optional().describe("Auto cancel unpaid orders: T=Yes, F=No"),
    auto_cancel_cash_unit: z
      .enum(["D", "T"])
      .optional()
      .describe("Auto cancel unit: D=Days, T=Hours"),
    auto_cancel_cash_period: z
      .number()
      .int()
      .min(1)
      .max(23)
      .optional()
      .describe("Auto cancel period (cash)"),
    auto_cancel_virtual_account_period: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Auto cancel period (virtual account)"),
    auto_cancel_cvs_period: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Auto cancel period (CVS)"),
    use_shipped_auto_check_start_day: z
      .enum(["T", "F"])
      .optional()
      .describe("Use shipped auto check start date: T=Yes, F=No"),
    shipped_auto_check_start_day: z
      .string()
      .optional()
      .nullable()
      .describe("Shipped auto check start date (YYYY-MM-DD)"),
  })
  .strict();

async function cafe24_get_order_setting(params: z.infer<typeof OrderSettingParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/orders/setting", "GET", undefined, queryParams);
    const order = data.order || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Settings (Shop #${order.shop_no || 1})\n\n` +
            `- **Buyer Claim Request**: ${order.claim_request === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Auto Stock Recover**: ${order.stock_recover === "T" ? "Basic" : "Individual"}\n` +
            `- **Auto Delivery Completion**: ${order.auto_delivery_completion === "T" ? "Enabled" : "Disabled"} (${order.delivery_completion_after_days} days)\n` +
            `- **Auto Cancel Unpaid**: ${order.auto_cancel === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Exchange Fee**: ${order.exchange_shipping_fee}\n` +
            `- **Return Fee**: ${order.return_shipping_fee}\n`,
        },
      ],
      structuredContent: order as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_order_setting(params: z.infer<typeof OrderSettingUpdateParamsSchema>) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/orders/setting", "PUT", requestBody);
    const order = data.order || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Settings Updated (Shop #${order.shop_no || 1})\n\n` +
            `- **Buyer Claim Request**: ${order.claim_request === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Auto Stock Recover**: ${order.stock_recover === "T" ? "Basic" : "Individual"}\n`,
        },
      ],
      structuredContent: order as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_order_setting",
    {
      title: "Get Cafe24 Order Settings",
      description:
        "Retrieve order settings regarding buyer claims, stock recovery, refund processing, purchase confirmation, and auto-cancellation policies.",
      inputSchema: OrderSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_order_setting,
  );

  server.registerTool(
    "cafe24_update_order_setting",
    {
      title: "Update Cafe24 Order Settings",
      description:
        "Update order settings. Configure buyer claim requests, stock recovery options, refund policies, purchase confirmation automation, shipping fees, and auto-cancellation rules.",
      inputSchema: OrderSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_order_setting,
  );
}
