import { z } from "zod";

export const OrderItemSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    supplier_id: z.string().optional().describe("Supplier ID (comma-separated for multiple)"),
  })
  .strict();

export const CreateOrderItemsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    requests: z
      .array(
        z.object({
          was_product_bundle: z.enum(["T", "F"]).default("F").describe("Was product bundled"),
          original_bundle_item_no: z.string().optional().describe("Original bundle item no"),
          variant_code: z.string().min(12).max(12).describe("Variant code (12 characters)"),
        }),
      )
      .describe("List of items to add/split"),
  })
  .strict();

export const UpdateOrderItemParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    order_item_code: z.string().describe("Order item code"),
    request: z
      .object({
        claim_type: z
          .enum(["C", "R"])
          .optional()
          .describe("cancellation/exchange/return type (C: cancel, R: return)"),
        claim_status: z
          .enum(["T", "F"])
          .optional()
          .describe("cancellation/exchange/return request status (T: submit, F: do not submit)"),
        claim_reason_type: z
          .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
          .optional()
          .describe("type of cancellation/exchange/return request reason"),
        claim_reason: z
          .string()
          .optional()
          .describe("reason for cancellation/exchange/return request"),
        claim_quantity: z
          .number()
          .int()
          .optional()
          .describe("number of cancellation/exchange/return requests"),
        multi_invoice: z
          .array(
            z.object({
              tracking_no: z.string().describe("Tracking number"),
              shipping_company_id: z.number().int().describe("Shipping company ID"),
              quantity: z.number().int().describe("Quantity for this label"),
            }),
          )
          .optional()
          .describe("Multiple shipping labels"),
        shipping_expected_date: z
          .string()
          .nullable()
          .optional()
          .describe("Scheduled shipping date"),
      })
      .describe("Update details"),
  })
  .strict();
