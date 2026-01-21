import { z } from "zod";

export const UpdateOrderRefundParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number"),
  order_id: z.string().describe("Order ID"),
  refund_code: z.string().describe("Refund Number"),
  request: z.object({
    status: z.literal("complete").describe("Status of refund (complete)"),
    reason: z.string().max(2000).optional().describe("Reason for processing"),
    send_sms: z
      .enum(["T", "F"])
      .optional()
      .default("T")
      .describe("Whether to send SMS after processing refund"),
    send_mail: z
      .enum(["T", "F"])
      .optional()
      .default("T")
      .describe("Whether to send mail after processing refund"),
    payment_gateway_cancel: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("PG cancellation request settings"),
  }),
});

export const RefundsSearchParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number"),
  start_date: z.string().describe("Search Start Date (YYYY-MM-DD)"),
  end_date: z.string().describe("Search End Date (YYYY-MM-DD)"),
  date_type: z
    .enum(["accepted_refund_date", "refund_date"])
    .optional()
    .default("refund_date")
    .describe("Date type for search"),
  member_id: z.string().max(20).optional().describe("Member ID"),
  member_email: z.string().optional().describe("Customer Email"),
  buyer_email: z.string().optional().describe("Buyer Email"),
  order_id: z.string().optional().describe("Order ID"),
  refund_status: z
    .string()
    .optional()
    .describe("Refund status (F: Awaiting, T: Refunded, M: Hold). Comma separated."),
  limit: z.number().min(1).max(500).optional().default(10).describe("Limit"),
  offset: z.number().max(15000).optional().default(0).describe("Offset"),
});

export type RefundsSearchParams = z.infer<typeof RefundsSearchParamsSchema>;

export const RefundDetailParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number"),
  refund_code: z.string().describe("Refund Number"),
  items: z.string().optional().describe("Item Resource (e.g. for filtering items)"),
  embed: z.string().optional().describe("Embed Resource (e.g. 'items' to include item details)"),
});

export type RefundDetailParams = z.infer<typeof RefundDetailParamsSchema>;

export type UpdateOrderRefundParams = z.infer<typeof UpdateOrderRefundParamsSchema>;
