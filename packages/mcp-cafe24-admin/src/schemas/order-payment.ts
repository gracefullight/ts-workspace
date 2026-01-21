import { z } from "zod";

export const UpdateOrderPaymentParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    request: z.object({
      change_payment_amount: z.enum(["T", "F"]).describe("Change payment amount"),
      change_payment_method: z.enum(["T", "F"]).describe("Change payment method"),
      payment_method: z
        .enum(["cash", "daibiki"])
        .optional()
        .describe("Payment Method (cash: Bank transfer, daibiki: Daibiki (COD))"),
      billing_name: z.string().max(40).optional().describe("Depositor name"),
      bank_account_id: z.number().int().optional().describe("Bank ID"),
      admin_additional_amount: z
        .string()
        .optional()
        .describe("Manually input amount (Min 0, Max 10000000)"),
      commission: z.string().optional().describe("Transaction fee (Min 0, Max 10000000)"),
      change_payment_amount_reason: z
        .string()
        .max(255)
        .optional()
        .describe("Reason for change in payment amount"),
    }),
  })
  .strict();

export const OrderPaymentTimelineSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD or ISO 8601)"),
    end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD or ISO 8601)"),
    date_type: z
      .enum(["created_datetime", "payment_datetime"])
      .optional()
      .describe("Date type for search"),
  })
  .strict();

export const OrderPaymentTimelineDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    payment_no: z.number().int().min(1).describe("Payment Number"),
  })
  .strict();

export const UpdatePaymentsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          order_id: z.string().describe("Order ID"),
          status: z
            .enum(["paid", "unpaid", "canceled"])
            .describe("Payment status (paid: confirmed, unpaid: awaiting, canceled: canceled)"),
          payment_no: z.number().int().min(1).optional().describe("Payment number"),
          auto_paid: z
            .enum(["T", "F"])
            .optional()
            .describe("Whether payment was auto-transferred (T/F)"),
          recover_inventory: z.enum(["T", "F"]).optional().describe("Inventory Recovery (T/F)"),
          cancel_request: z
            .object({
              refund_status: z
                .enum(["P", "F"])
                .default("F")
                .describe("Refund status (P: refunded, F: failed)"),
              partial_cancel: z.enum(["T", "F"]).default("F").describe("Partially cancel (T/F)"),
              payment_gateway_name: z.string().optional().describe("Payment Gateway Name"),
              payment_method: z.string().optional().describe("Payment Method Code"),
              response_code: z.string().optional().describe("Response code from PG"),
              response_message: z.string().optional().describe("Response message from PG"),
            })
            .optional()
            .describe("Payment cancellation request details"),
        }),
      )
      .describe("List of payment updates"),
  })
  .strict();
