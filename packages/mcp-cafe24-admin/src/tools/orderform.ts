import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const SettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

const ShippingOrderInfoSchema = z.object({
  key: z.string().describe("Field key (e.g., name, address, phone)"),
  use: z.enum(["T", "F"]).describe("Use field"),
  required: z.enum(["T", "F"]).describe("Is field required"),
});

const PrintTypeSchema = z.object({
  invoice_print: z.enum(["T", "F"]).optional().describe("Invoice print button"),
  receipt_print: z.enum(["T", "F"]).optional().describe("Receipt print button"),
  address_print: z.enum(["T", "F"]).optional().describe("Address print button"),
});

const UpdateSettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    buy_limit_type: z
      .enum(["M", "A"])
      .optional()
      .describe("Buy limit type (M: Member only, A: All)"),
    guest_purchase_button_display: z
      .enum(["T", "F"])
      .optional()
      .describe("Display guest purchase button"),
    junior_purchase_block: z.enum(["T", "F"]).optional().describe("Block purchase for under 14"),
    reservation_order: z.enum(["T", "F"]).optional().describe("Reservation order"),
    discount_amount_display: z.enum(["T", "F"]).optional().describe("Display discount amount"),
    order_item_delete: z.enum(["T", "F"]).optional().describe("Allow deleting order items"),
    quick_signup: z.enum(["T", "F"]).optional().describe("Quick signup in order form"),
    check_order_info: z.enum(["T", "F"]).optional().describe("Check order info"),
    order_form_input_type: z
      .enum(["A", "S"])
      .optional()
      .describe("Order form input type (A: Shipping only, S: Separate)"),
    shipping_info: z
      .array(ShippingOrderInfoSchema)
      .optional()
      .describe("Shipping info fields settings"),
    order_info: z.array(ShippingOrderInfoSchema).optional().describe("Order info fields settings"),
    china_taiwan_id_input: z.enum(["T", "F"]).optional().describe("Input ID for China/Taiwan"),
    print_type: PrintTypeSchema.optional().describe("Print button settings"),
    orderform_additional_enabled: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable additional order form fields"),
  })
  .strict();

async function cafe24_get_orderform_setting(params: z.infer<typeof SettingsParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/orderform/setting", "GET", undefined, {
      shop_no: params.shop_no,
    });
    const settings = data.orderform || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Order Form Settings (Shop #${settings.shop_no})\n\n` +
            `- **Buy Limit**: ${settings.buy_limit_type === "M" ? "Members Only" : "Everyone"}\n` +
            `- **Guest Purchase Button**: ${settings.guest_purchase_button_display === "T" ? "Show" : "Hide"}\n` +
            `- **Input Type**: ${settings.order_form_input_type === "A" ? "Shipping Info Only" : "Separate Order/Shipping Info"}\n` +
            `- **Quick Signup**: ${settings.quick_signup === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: settings as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_orderform_setting(params: z.infer<typeof UpdateSettingsParamsSchema>) {
  try {
    const { shop_no, ...requestParams } = params;
    const data = await makeApiRequest("/admin/orderform/setting", "PUT", {
      shop_no,
      request: requestParams,
    });
    const settings = data.orderform || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Order form settings updated for Shop #${settings.shop_no}`,
        },
      ],
      structuredContent: settings as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_orderform_setting",
    {
      title: "Get Order Form Settings",
      description:
        "Retrieve configuration for the order form, including purchase limits, input fields, and display options.",
      inputSchema: SettingsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_orderform_setting,
  );

  server.registerTool(
    "cafe24_update_orderform_setting",
    {
      title: "Update Order Form Settings",
      description: "Update configuration for the order form. Only provided fields will be updated.",
      inputSchema: UpdateSettingsParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_orderform_setting,
  );
}
