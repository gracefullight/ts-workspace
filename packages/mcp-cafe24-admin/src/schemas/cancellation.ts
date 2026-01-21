import { z } from "zod";

export const CancellationDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    claim_code: z.string().describe("Cancellation number (claim_code)"),
  })
  .strict();

export const CancellationItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
  quantity: z.number().int().describe("Available inventory"),
});

export const CancellationCreateRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  status: z.enum(["canceled", "canceling"]).describe("Order status"),
  reason: z.string().max(2000).optional().describe("Reason for cancellation"),
  claim_reason_type: z
    .enum(["A", "B", "C", "L", "D", "E", "F", "G", "H", "I"])
    .optional()
    .describe(
      "Type of reason for cancellation (A: change of mind, B: shipping delay, C: unavailable shipping zone, L: Export/Customs clearance issue, D: bad packaging, E: dissatisfied with product, F: product does not match description, G: dissatisfied with service, H: out of stock, I: others)",
    ),
  naverpay_cancel_reason_type: z
    .enum(["51", "52", "53", "54", "55", "56", "60"])
    .optional()
    .describe("Reason for NAVER Pay order cancellation"),
  kakaopay_cancel_reason_type: z
    .enum(["K1", "K2", "K3", "K4", "K5", "K6", "K7"])
    .optional()
    .describe("Reason for Kakaopay order cancellation"),
  add_memo_too: z
    .enum(["T", "F"])
    .default("F")
    .describe("Add to admin memo (T: Enable, F: Disable)"),
  recover_inventory: z
    .enum(["T", "F"])
    .default("F")
    .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
  recover_coupon: z.enum(["T", "F"]).default("F").describe("Restore a coupon"),
  recover_coupon_no: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .describe("Coupon number to be recovered"),
  refund_method_code: z
    .array(z.enum(["T", "F", "M", "G", "C", "D", "Z", "O", "V", "J", "K", "I"]))
    .optional()
    .describe("Refund method codes"),
  refund_bank_code: z.string().optional().describe("Code assigned to bank for refunds"),
  refund_bank_name: z.string().max(250).optional().describe("Bank name"),
  refund_bank_account_no: z.string().optional().describe("Refund account number"),
  refund_bank_account_holder: z
    .string()
    .max(15)
    .optional()
    .describe("Refund Account Account Holder's Name"),
  items: z.array(CancellationItemSchema).describe("Order item codes and quantities"),
});

export const CancellationCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    requests: z.array(CancellationCreateRequestSchema).describe("List of cancellation requests"),
  })
  .strict();

export const CancellationUpdateItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
});

export const CancellationUpdateRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  claim_code: z.string().describe("Cancellation number"),
  recover_inventory: z
    .enum(["T", "F"])
    .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
  undone: z.enum(["T"]).describe("Undo (T: Yes)"),
  add_memo_too: z.enum(["T", "F"]).describe("Add to admin memo"),
  undone_reason_type: z
    .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
    .describe("Reason for undoing"),
  undone_reason: z.string().max(2000).optional().describe("Reason for undoing (Details)"),
  expose_order_detail: z.enum(["T", "F"]).describe("Display reason in order details"),
  exposed_undone_reason: z
    .string()
    .max(2000)
    .optional()
    .describe("Reason for undoing (Storefront)"),
  items: z.array(CancellationUpdateItemSchema).optional().describe("Order item codes"),
});

export const CancellationUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    requests: z.array(CancellationUpdateRequestSchema).describe("List of update requests"),
  })
  .strict();

export const CancellationRequestItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
  quantity: z.number().int().describe("Quantity to cancel"),
});

export const CancellationRequestCreateSchema = z.object({
  order_id: z.string().describe("Order ID"),
  reason_type: z
    .enum(["A", "B", "G", "I"])
    .describe("Type of reason for cancellation (A, B, G, I)"),
  reason: z.string().max(2000).describe("Reason for cancellation"),
  refund_bank_code: z.string().optional().describe("Bank code for refund"),
  refund_bank_name: z.string().max(250).optional().describe("Bank name for refund"),
  refund_bank_account_no: z.string().optional().describe("Bank account number for refund"),
  refund_bank_account_holder: z.string().max(15).optional().describe("Account holder name"),
  items: z.array(CancellationRequestItemSchema).describe("List of items to cancel"),
});

export const CancellationRequestCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    requests: z.array(CancellationRequestCreateSchema).describe("List of cancellation requests"),
  })
  .strict();

export const CancellationRequestRejectSchema = z.object({
  order_id: z.string().describe("Order ID"),
  undone: z.enum(["T"]).describe("Rejected to accept (T)"),
  reason_type: z
    .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
    .optional()
    .describe("Type of reason"),
  reason: z.string().max(2000).optional().describe("Reason"),
  display_reject_reason: z
    .enum(["T", "F"])
    .default("F")
    .describe("Display reason in storefront (T/F)"),
  reject_reason: z.string().max(2000).optional().describe("Reason for rejection"),
  order_item_code: z.array(z.string()).describe("List of order item codes"),
});

export const CancellationRequestRejectParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    requests: z.array(CancellationRequestRejectSchema).describe("List of rejection requests"),
  })
  .strict();

export const OrderCancellationCreateRequestSchema = z.object({
  status: z.enum(["canceled", "canceling"]).describe("Order status"),
  reason: z.string().max(2000).optional().describe("Reason for cancellation"),
  claim_reason_type: z
    .enum(["A", "B", "C", "L", "D", "E", "F", "G", "H", "I"])
    .optional()
    .describe(
      "Type of reason for cancellation (A: change of mind, B: shipping delay, C: unavailable shipping zone, L: Export/Customs clearance issue, D: bad packaging, E: dissatisfied with product, F: product does not match description, G: dissatisfied with service, H: out of stock, I: others)",
    ),
  naverpay_cancel_reason_type: z
    .enum(["51", "52", "53", "54", "55", "56", "60"])
    .optional()
    .describe("Reason for NAVER Pay order cancellation"),
  kakaopay_cancel_reason_type: z
    .enum(["K1", "K2", "K3", "K4", "K5", "K6", "K7"])
    .optional()
    .describe("Reason for Kakaopay order cancellation"),
  add_memo_too: z
    .enum(["T", "F"])
    .default("F")
    .describe("Add to admin memo (T: Enable, F: Disable)"),
  recover_inventory: z
    .enum(["T", "F"])
    .default("F")
    .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
  recover_coupon: z.enum(["T", "F"]).default("F").describe("Restore a coupon"),
  recover_coupon_no: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .describe("Coupon number to be recovered"),
  refund_method_code: z
    .array(z.enum(["T", "F", "M", "G", "C", "D", "Z", "O", "V", "J", "K", "I"]))
    .optional()
    .describe("Refund method codes"),
  refund_bank_code: z.string().optional().describe("Code assigned to bank for refunds"),
  refund_bank_name: z.string().max(250).optional().describe("Bank name"),
  refund_bank_account_no: z.string().optional().describe("Refund account number"),
  refund_bank_account_holder: z
    .string()
    .max(15)
    .optional()
    .describe("Refund Account Account Holder's Name"),
  payment_gateway_cancel: z
    .enum(["T", "F"])
    .default("F")
    .describe("PG cancellation request settings (T: cancel, F: do not cancel)"),
  items: z.array(CancellationItemSchema).describe("Order item codes and quantities"),
});

export const OrderCancellationCreateParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    request: OrderCancellationCreateRequestSchema.describe("Order cancellation request details"),
  })
  .strict();

export const OrderCancellationUpdateRequestSchema = z.object({
  recover_inventory: z
    .enum(["T", "F"])
    .describe("Inventory Recovery (T: Recover, F: Do not recover)"),
  undone: z.enum(["T"]).describe("Undo (T: Yes)"),
  add_memo_too: z.enum(["T", "F"]).describe("Add to admin memo"),
  undone_reason_type: z
    .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
    .describe("Reason for undoing"),
  undone_reason: z.string().max(2000).optional().describe("Reason for undoing (Details)"),
  expose_order_detail: z.enum(["T", "F"]).describe("Display reason in order details"),
  exposed_undone_reason: z
    .string()
    .max(2000)
    .optional()
    .describe("Reason for undoing (Storefront)"),
});

export const OrderCancellationUpdateParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    claim_code: z.string().describe("Cancellation number"),
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    request: OrderCancellationUpdateRequestSchema.describe("Order cancellation update details"),
  })
  .strict();
