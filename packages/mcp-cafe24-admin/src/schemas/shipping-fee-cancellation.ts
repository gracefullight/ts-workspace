import { z } from "zod";

export const ShippingFeeCancellationSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
  })
  .strict();

export const CreateShippingFeeCancellationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    request: z
      .object({
        reason: z.string().max(2000).optional().describe("Reason for cancellation"),
        claim_reason_type: z
          .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
          .optional()
          .describe("Type of reason for cancellation"),
        recover_coupon: z.enum(["T", "F"]).default("F").describe("Restore a coupon"),
        refund_method_code: z
          .array(z.enum(["T", "F", "M", "G", "C", "D", "Z", "O", "V", "J", "K", "I"]))
          .optional()
          .describe("Refund method codes"),
        refund_bank_code: z.string().optional().describe("Refund bank code"),
        refund_bank_name: z.string().max(250).optional().describe("Refund bank name"),
        refund_bank_account_no: z.string().optional().describe("Refund bank account number"),
        refund_bank_account_holder: z
          .string()
          .max(30)
          .optional()
          .describe("Refund account holder name"),
        payment_gateway_cancel: z.enum(["T", "F"]).default("F").describe("PG cancellation request"),
      })
      .describe("Cancellation request details"),
  })
  .strict();
