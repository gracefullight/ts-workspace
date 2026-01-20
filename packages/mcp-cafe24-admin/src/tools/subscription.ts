import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const SubscriptionDiscountValueSchema = z.object({
  delivery_cycle: z.number().int().describe("Delivery cycle count"),
  discount_amount: z.number().describe("Discount amount or percentage"),
});

const SubscriptionShipmentParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    subscription_no: z.number().int().optional().describe("Subscription setting number"),
  })
  .strict();

const SubscriptionShipmentCreateSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_shipments_name: z.string().max(255).describe("Subscription shipment setting name"),
    product_binding_type: z
      .enum(["A", "P", "C"])
      .describe("Product binding: A=All, P=Product, C=Category"),
    one_time_purchase: z
      .enum(["T", "F"])
      .default("T")
      .optional()
      .describe("Allow one-time purchase: T=Yes, F=No"),
    product_list: z.array(z.number().int()).optional().describe("List of product IDs"),
    category_list: z.array(z.number().int()).optional().describe("List of category IDs"),
    use_discount: z.enum(["T", "F"]).describe("Use discount: T=Yes, F=No"),
    discount_value_unit: z
      .enum(["P", "W"])
      .optional()
      .describe("Discount unit: P=Percent, W=Amount"),
    discount_values: z
      .array(SubscriptionDiscountValueSchema)
      .optional()
      .describe("Discount values per cycle"),
    related_purchase_quantity: z
      .enum(["T", "F"])
      .optional()
      .describe("Related to purchase quantity: T=Yes, F=No"),
    subscription_shipments_cycle_type: z
      .enum(["T", "F"])
      .describe("Use delivery cycle: T=Yes, F=No"),
    subscription_shipments_cycle: z.array(z.string()).describe("Delivery cycles (e.g., 1W, 1M)"),
    subscription_shipments_count_type: z
      .enum(["T", "F"])
      .optional()
      .describe("Use shipment count limit: T=Yes, F=No"),
    subscription_shipments_count: z
      .array(z.number().int())
      .optional()
      .describe("Shipment count options (e.g., 2, 3, 4)"),
    use_order_price_condition: z
      .enum(["T", "F"])
      .describe("Use order price condition: T=Yes, F=No"),
    order_price_greater_than: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Minimum order price for benefit"),
    include_regional_shipping_rate: z
      .enum(["T", "F"])
      .optional()
      .describe("Include regional shipping rate: T=Yes, F=No"),
    shipments_start_date: z
      .number()
      .int()
      .min(1)
      .max(30)
      .default(3)
      .optional()
      .describe("Days until shipment start (1-30)"),
    change_option: z
      .enum(["T", "F"])
      .default("F")
      .optional()
      .describe("Allow option change: T=Yes, F=No"),
  })
  .strict();

const SubscriptionShipmentUpdateSchema = SubscriptionShipmentCreateSchema.omit({
  shop_no: true,
})
  .partial()
  .extend({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_no: z.number().int().describe("Subscription setting number to update"),
  })
  .strict();

const SubscriptionShipmentDeleteSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    subscription_no: z.number().int().describe("Subscription setting number to delete"),
  })
  .strict();

async function cafe24_list_subscription_shipment_settings(
  params: z.infer<typeof SubscriptionShipmentParamsSchema>,
) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) queryParams.shop_no = params.shop_no;
    if (params.subscription_no) queryParams.subscription_no = params.subscription_no;

    const data = await makeApiRequest(
      "/admin/subscription/shipments/setting",
      "GET",
      undefined,
      queryParams,
    );
    const shipments = data.shipments || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${shipments.length} subscription shipment settings\n\n` +
            shipments
              .map(
                (s: any) =>
                  `## [${s.subscription_no}] ${s.subscription_shipments_name}\n` +
                  `- **Type**: ${s.product_binding_type}\n` +
                  `- **One-time Purchase**: ${s.one_time_purchase === "T" ? "Yes" : "No"}\n` +
                  `- **Discount**: ${s.use_discount === "T" ? "Yes" : "No"}\n` +
                  `- **Cycles**: ${s.subscription_shipments_cycle ? s.subscription_shipments_cycle.join(", ") : "N/A"}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: shipments.length,
        shipments: shipments,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_subscription_shipment_setting(
  params: z.infer<typeof SubscriptionShipmentCreateSchema>,
) {
  try {
    const { shop_no, ...requestData } = params;
    const requestBody = {
      shop_no,
      request: requestData,
    };

    const data = await makeApiRequest("/admin/subscription/shipments/setting", "POST", requestBody);
    const shipment = data.shipment || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created subscription shipment setting: ${shipment.subscription_shipments_name} (No: ${shipment.subscription_no})`,
        },
      ],
      structuredContent: shipment as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_subscription_shipment_setting(
  params: z.infer<typeof SubscriptionShipmentUpdateSchema>,
) {
  try {
    const { shop_no, subscription_no, ...requestData } = params;
    const requestBody = {
      shop_no,
      request: requestData,
    };

    const data = await makeApiRequest(
      `/admin/subscription/shipments/setting/${subscription_no}`,
      "PUT",
      requestBody,
    );
    const shipment = data.shipment || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated subscription shipment setting #${shipment.subscription_no}: ${shipment.subscription_shipments_name}`,
        },
      ],
      structuredContent: shipment as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_subscription_shipment_setting(
  params: z.infer<typeof SubscriptionShipmentDeleteSchema>,
) {
  try {
    await makeApiRequest(
      `/admin/subscription/shipments/setting/${params.subscription_no}`,
      "DELETE",
      undefined,
      { shop_no: params.shop_no },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted subscription shipment setting #${params.subscription_no}`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_subscription_shipment_settings",
    {
      title: "List Cafe24 Subscription Shipment Settings",
      description:
        "Retrieve a list of subscription shipment settings. Supports filtering by subscription_no.",
      inputSchema: SubscriptionShipmentParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_subscription_shipment_settings,
  );

  server.registerTool(
    "cafe24_create_subscription_shipment_setting",
    {
      title: "Create Cafe24 Subscription Shipment Setting",
      description:
        "Create a new subscription shipment setting. Requires name, binding type, cycle settings, and discount rules.",
      inputSchema: SubscriptionShipmentCreateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_subscription_shipment_setting,
  );

  server.registerTool(
    "cafe24_update_subscription_shipment_setting",
    {
      title: "Update Cafe24 Subscription Shipment Setting",
      description:
        "Update an existing subscription shipment setting. Can modify name, products, discounts, and cycles.",
      inputSchema: SubscriptionShipmentUpdateSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_subscription_shipment_setting,
  );

  server.registerTool(
    "cafe24_delete_subscription_shipment_setting",
    {
      title: "Delete Cafe24 Subscription Shipment Setting",
      description: "Delete a subscription shipment setting by its ID.",
      inputSchema: SubscriptionShipmentDeleteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_subscription_shipment_setting,
  );
}
