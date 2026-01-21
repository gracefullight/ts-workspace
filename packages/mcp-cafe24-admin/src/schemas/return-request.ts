import { z } from "zod";

export const ReturnRequestItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
  quantity: z.number().int().min(1).describe("Available inventory"),
});

export const ReturnRequestPickupSchema = z.object({
  name: z.string().nullable().describe("Name"),
  phone: z.string().nullable().describe("Phone number"),
  cellphone: z.string().nullable().describe("Mobile number"),
  zipcode: z.string().nullable().describe("Zip code"),
  address1: z.string().nullable().describe("Address 1"),
  address2: z.string().nullable().describe("Address 2"),
});

export const ReturnRequestCreateRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  items: z.array(ReturnRequestItemSchema).min(1).describe("List of items"),
  request_pickup: z.enum(["T", "F"]).describe("Request pickup"),
  pickup: ReturnRequestPickupSchema.optional().nullable().describe("Pickup location details"),
  tracking_no: z.string().max(40).optional().nullable().describe("Return tracking number"),
  shipping_company_name: z
    .string()
    .max(30)
    .optional()
    .nullable()
    .describe("Return shipping carrier"),
  reason_type: z
    .enum(["A", "E", "K", "J", "I"])
    .optional()
    .describe(
      "Type of reason (A: Change of mind, E: Unsatisfactory product, K: Defective product, J: Shipping error, I: Others)",
    ),
  reason: z.string().max(2000).optional().describe("Reason"),
  refund_bank_name: z.string().max(250).optional().nullable().describe("Bank name"),
  refund_bank_code: z.string().optional().nullable().describe("Code assigned to bank for refunds"),
  refund_bank_account_no: z.string().optional().nullable().describe("Refund account number"),
  refund_bank_account_holder: z
    .string()
    .max(15)
    .optional()
    .nullable()
    .describe("Refund Account Account Holder's Name"),
});

export const ReturnRequestCreatePayloadSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z.array(ReturnRequestCreateRequestSchema).min(1).describe("List of return requests"),
  })
  .strict();

export const ReturnRequestUpdateRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  undone: z.literal("T").describe("Rejected to accept (T: Yes)"),
  reason_type: z
    .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
    .optional()
    .describe(
      "Type of reason (A: change of mind, B: shipping delay, J: shipping error, C: unavailable shipping zone, L: Export/Customs clearance issue, D: bad packaging, E: dissatisfied with product, F: product does not match the description, K: defective product, G: dissatisfied with service, H: out of stock, I: others)",
    ),
  reason: z.string().max(2000).optional().nullable().describe("Reason"),
  display_reject_reason: z
    .enum(["T", "F"])
    .default("F")
    .optional()
    .describe("Display reason in [Storefront>My Orders]"),
  reject_reason: z.string().max(2000).optional().nullable().describe("Reason for rejection"),
  order_item_code: z.array(z.string()).min(1).describe("Order item code"),
});

export const ReturnRequestUpdatePayloadSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(ReturnRequestUpdateRequestSchema)
      .min(1)
      .describe("List of return requests to update"),
  })
  .strict();

export type ReturnRequestCreatePayload = z.infer<typeof ReturnRequestCreatePayloadSchema>;
export type ReturnRequestUpdatePayload = z.infer<typeof ReturnRequestUpdatePayloadSchema>;
