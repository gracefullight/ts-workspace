import { z } from "zod";

export const ExchangeDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    claim_code: z.string().describe("Exchange number"),
  })
  .strict();

export const ExchangeItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
  quantity: z.number().int().min(1).describe("Quantity to exchange"),
  exchange_variant_code: z.string().nullable().optional().describe("New variant code for exchange"),
});

export const ExchangeCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    request: z
      .object({
        status: z.enum(["accepted", "exchanged"]).describe("Order status"),
        recover_inventory: z
          .enum(["T", "F"])
          .default("F")
          .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
        add_memo_too: z
          .enum(["T", "F"])
          .default("F")
          .describe("Add to admin memo (T: Enable, F: Disable)"),
        items: z.array(ExchangeItemSchema).describe("Items to exchange"),
        same_product: z
          .enum(["T", "F"])
          .describe("Exchange status (T: Same product, F: Different product)"),
      })
      .describe("Exchange request details"),
  })
  .strict();

export const ExchangeUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    claim_code: z.string().describe("Exchange number (Claim code)"),
    request: z
      .object({
        status: z.enum(["exchanged"]).optional().describe("Order status"),
        pickup_completed: z.enum(["T", "F"]).optional().describe("Whether pickup is complete"),
        carrier_id: z.number().nullable().optional().describe("Shipping carrier ID"),
        return_invoice_no: z
          .string()
          .max(40)
          .nullable()
          .optional()
          .describe("Return tracking number"),
        return_shipping_company_name: z
          .string()
          .max(30)
          .nullable()
          .optional()
          .describe("Return shipping carrier"),
        return_invoice_success: z
          .enum(["T", "F", "N"])
          .nullable()
          .optional()
          .describe("Return invoice successfully processed (T: yes, F: no, N: pickup failed)"),
        return_invoice_fail_reason: z
          .string()
          .max(100)
          .nullable()
          .optional()
          .describe("Reason for return invoice processing failure"),
        recover_inventory: z
          .enum(["T", "F"])
          .optional()
          .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
        exchanged_after_collected: z
          .enum(["T", "F"])
          .nullable()
          .optional()
          .describe("Exchange status after pickup (T: Used, F: Not used)"),
        items: z
          .array(z.object({ order_item_code: z.string() }))
          .optional()
          .describe("Order item codes"),
        request_pickup: z
          .enum(["T", "F"])
          .nullable()
          .optional()
          .describe("Request pickup (T: Used, F: Not used)"),
        pickup: z
          .object({
            name: z.string().nullable().optional(),
            phone: z.string().nullable().optional(),
            cellphone: z.string().nullable().optional(),
            zipcode: z.string().nullable().optional(),
            address1: z.string().nullable().optional(),
            address2: z.string().nullable().optional(),
          })
          .nullable()
          .optional()
          .describe("Pickup location details"),
        undone: z.enum(["T"]).nullable().optional().describe("Undo exchange (T: Yes)"),
        add_memo_too: z
          .enum(["T", "F"])
          .nullable()
          .optional()
          .describe("Add to admin memo (T: Enable, F: Disable)"),
        undone_reason_type: z
          .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
          .nullable()
          .optional()
          .describe("Reason for undoing (A: change of mind, B: shipping delay, ..., I: others)"),
        undone_reason: z
          .string()
          .max(2000)
          .nullable()
          .optional()
          .describe("Reason for undoing (Details)"),
        expose_order_detail: z
          .enum(["T", "F"])
          .nullable()
          .optional()
          .describe("Display reason in order details"),
        exposed_undone_reason: z
          .string()
          .max(2000)
          .nullable()
          .optional()
          .describe("Reason for undoing (Storefront)"),
      })
      .describe("Exchange update details"),
  })
  .strict();
