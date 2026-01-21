import { z } from "zod";

export const OrderMemoSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID. You can search multiple item with ,(comma)"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export const OrderMemoProductSchema = z.object({
  product_no: z.number(),
  option_code: z.string(),
});

export const CreateOrderMemoParamsSchema = z
  .object({
    shop_no: z.number().optional().default(1).describe("Shop number"),
    order_id: z.string().describe("Order ID"),
    request: z.object({
      use_customer_inquiry: z
        .enum(["T", "F"])
        .optional()
        .default("F")
        .describe("Add to customer inquiries (T: Used, F: Not used)"),
      topic_type: z
        .enum(["cs_01", "cs_02", "cs_03", "cs_04", "cs_05"])
        .nullable()
        .optional()
        .describe(
          "Inquiry type (cs_01: shipping, cs_02: product, cs_03: payment, cs_04: order cancellation, cs_05: change in product to order)",
        ),
      status: z
        .enum(["F", "T"])
        .nullable()
        .optional()
        .describe("Response status (F: in progress, T: resolved)"),
      attach_type: z
        .enum(["O", "P"])
        .optional()
        .default("O")
        .describe("Attached to (O: order number, P: item code)"),
      content: z.string().max(1000).describe("Memo description"),
      starred_memo: z
        .enum(["T", "F"])
        .optional()
        .default("F")
        .describe("Important memo (T: Important, F: General)"),
      fixed: z
        .enum(["T", "F"])
        .optional()
        .default("F")
        .describe("Pinned to top (T: Used, F: Not used)"),
      product_list: z
        .array(OrderMemoProductSchema)
        .optional()
        .describe("Product list (required if attach_type is P)"),
    }),
  })
  .strict();

export const UpdateOrderMemoParamsSchema = z
  .object({
    shop_no: z.number().optional().default(1).describe("Shop number"),
    order_id: z.string().describe("Order ID"),
    memo_no: z.number().describe("Memo number"),
    request: z.object({
      use_customer_inquiry: z
        .enum(["T", "F"])
        .optional()
        .default("F")
        .describe("Add to customer inquiries (T: Used, F: Not used)"),
      topic_type: z
        .enum(["cs_01", "cs_02", "cs_03", "cs_04", "cs_05"])
        .nullable()
        .optional()
        .describe("Inquiry type"),
      status: z.enum(["F", "T"]).nullable().optional().describe("Response status"),
      attach_type: z.enum(["O", "P"]).optional().default("O").describe("Attached to"),
      content: z.string().max(1000).optional().describe("Memo description"),
      starred_memo: z.enum(["T", "F"]).optional().default("F").describe("Important memo"),
      fixed: z.enum(["T", "F"]).optional().default("F").describe("Pinned to top"),
      product_list: z.array(OrderMemoProductSchema).optional().describe("Product list"),
    }),
  })
  .strict();

export const DeleteOrderMemoParamsSchema = z
  .object({
    shop_no: z.number().optional().default(1).describe("Shop number"),
    order_id: z.string().describe("Order ID"),
    memo_no: z.number().describe("Memo number"),
  })
  .strict();
