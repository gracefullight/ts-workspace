import { z } from "zod";

export const ExchangeDetailParamsSchema = z.object({
  shop_no: z.number().default(1),
  claim_code: z.string().describe("Exchange number"),
});

export const ExchangeCreateParamsSchema = z.object({
  shop_no: z.number().min(1).default(1),
  requests: z.array(
    z.object({
      order_id: z.string(),
      status: z.enum(["accepted", "exchanged"]),
      recover_inventory: z.enum(["T", "F"]).default("F"),
      add_memo_too: z.enum(["T", "F"]).default("F"),
      items: z.array(
        z.object({
          order_item_code: z.string(),
          quantity: z.number(),
          exchange_variant_code: z.string().nullable().optional(),
        }),
      ),
      same_product: z.enum(["T", "F"]),
    }),
  ),
});

export const ExchangeUpdateParamsSchema = z.object({
  shop_no: z.number().default(1),
  requests: z.array(
    z.object({
      order_id: z.string(),
      claim_code: z.string(),
      items: z.array(
        z.object({
          order_item_code: z.string(),
        }),
      ),
      status: z.enum(["processing", "exchanged"]).optional(),
      pickup_completed: z.enum(["T", "F"]).optional(),
      carrier_id: z.string().nullable().optional(),
      return_invoice_no: z.string().max(40).nullable().optional(),
      return_invoice_success: z.enum(["T", "F", "N"]).nullable().optional(),
      return_invoice_fail_reason: z.string().max(100).nullable().optional(),
      recover_inventory: z.enum(["T", "F"]).optional(),
      exchanged_after_collected: z.enum(["T", "F"]).nullable().optional(),
      undone: z.enum(["T"]).nullable().optional(),
      add_memo_too: z.enum(["T", "F"]).nullable().optional(),
      undone_reason_type: z
        .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
        .nullable()
        .optional(),
      undone_reason: z.string().max(2000).nullable().optional(),
      expose_order_detail: z.enum(["T", "F"]).nullable().optional(),
      exposed_undone_reason: z.string().max(2000).nullable().optional(),
    }),
  ),
});
