import { z } from "zod";

export const FulfillmentCreateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          tracking_no: z.string().max(30).describe("Tracking number"),
          shipping_company_code: z.string().describe("shipping carrier code"),
          status: z
            .enum(["standby", "shipping"])
            .describe("Order status (standby: waiting for shipping, shipping: on delivery)"),
          order_id: z.string().optional().describe("Order ID"),
          shipping_code: z.string().optional().describe("Shipping code"),
          order_item_code: z.array(z.string()).optional().describe("Order item code"),
          carrier_id: z.number().optional().describe("shipping carrier ID"),
          post_express_flag: z
            .enum(["S"])
            .optional()
            .describe("Korea Post (S: Tracking number transferred)"),
        }),
      )
      .describe("Listing of fulfillment requests"),
  })
  .strict();
