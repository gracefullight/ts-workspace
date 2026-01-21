import { z } from "zod";

const ReturnItemSchema = z
  .object({
    shop_no: z.number().optional(),
    item_no: z.number().optional(),
    order_item_code: z.string().describe("Order item code"),
    variant_code: z.string().optional(),
    product_no: z.number().optional(),
    product_code: z.string().optional(),
    product_name: z.string().optional(),
    quantity: z.number().optional(),
    status_text: z.string().optional(),
  })
  .passthrough(); // Allow other fields

const ReturnPickupSchema = z.object({
  use_pickup: z.string().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  cellphone: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  address1: z.string().nullable().optional(),
  address2: z.string().nullable().optional(),
});

export const ReturnResponseSchema = z
  .object({
    shop_no: z.number(),
    order_id: z.string(),
    claim_code: z.string(),
    claim_reason_type: z.string(),
    claim_reason: z.string(),
    claim_due_date: z.string(),
    items: z.array(ReturnItemSchema),
    pickup: ReturnPickupSchema.optional(),
    refund_amounts: z
      .array(
        z.object({
          payment_method: z.string(),
          amount: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough(); // Allow all the other fields from the API

// --- GET Request ---
export const GetReturnParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    claim_code: z.string().describe("Return number (Claim code)"),
  })
  .strict();

// --- POST Request ---
const CreateReturnRequestItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
  quantity: z.number().int().describe("Quantity"),
});

const CreateReturnRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  status: z.enum(["accepted", "processing", "returned"]).describe("Order status"),
  reason: z.string().max(2000).optional().describe("Refund reason"),
  claim_reason_type: z
    .enum(["A", "B", "C", "L", "D", "E", "F", "G", "H", "I"])
    .optional()
    .describe("Type of refund reason"),
  add_memo_too: z.enum(["T", "F"]).optional().describe("Add to admin memo"),
  recover_coupon: z.enum(["T", "F"]).optional().describe("Restore a coupon"),
  recover_coupon_no: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .describe("Coupon numbers to be recovered"),
  recover_inventory: z.enum(["T", "F"]).optional().describe("Inventory Recovery"),
  refund_method_code: z.array(z.string()).optional().describe("Refund method codes"),
  refund_bank_code: z.string().optional().describe("Bank code assigned for refunds"),
  refund_bank_account_no: z.string().optional().describe("Refund account number"),
  refund_bank_account_holder: z
    .string()
    .max(15)
    .optional()
    .describe("Refund account holder's name"),
  pickup_completed: z.enum(["T", "F"]).optional().describe("Whether pickup is complete"),
  items: z.array(CreateReturnRequestItemSchema).describe("Order items to return"),
  request_pickup: z.enum(["T", "F"]).optional().describe("Request pickup"),
  pickup: ReturnPickupSchema.optional().describe("Pickup location details"),
  return_invoice_no: z.string().max(40).optional().describe("Return tracking number"),
  return_shipping_company_name: z.string().max(30).optional().describe("Return shipping carrier"),
});

export const CreateReturnInputSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z.array(CreateReturnRequestSchema).describe("List of return requests"),
  })
  .strict();

// --- PUT Request ---
const UpdateReturnRequestItemSchema = z.object({
  order_item_code: z.string().describe("Order item code"),
});

const UpdateReturnRequestSchema = z.object({
  order_id: z.string().describe("Order ID"),
  claim_code: z.string().describe("Return number (Claim code)"),
  status: z.enum(["processing", "returned"]).optional().describe("Order status"),
  pickup_completed: z.enum(["T", "F"]).optional().describe("Whether pickup is complete"),
  carrier_id: z.number().int().nullable().optional().describe("Shipping carrier ID"),
  return_invoice_no: z.string().max(40).nullable().optional().describe("Return tracking number"),
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
    .describe("Return invoice successfully processed"),
  return_invoice_fail_reason: z
    .string()
    .max(100)
    .nullable()
    .optional()
    .describe("Reason for return invoice processing failure"),
  items: z.array(UpdateReturnRequestItemSchema).optional().describe("Order item codes to update"),
  refund_method_code: z.array(z.string()).optional().describe("Refund method codes"),
  refund_bank_code: z.string().nullable().optional().describe("Bank code assigned for refunds"),
  refund_bank_account_no: z.string().nullable().optional().describe("Refund account number"),
  refund_bank_account_holder: z
    .string()
    .max(15)
    .optional()
    .describe("Refund account holder's name"),
  recover_inventory: z.enum(["T", "F"]).optional().describe("Inventory Recovery"),
  request_pickup: z.enum(["T", "F"]).nullable().optional().describe("Request pickup"),
  pickup: ReturnPickupSchema.nullable().optional().describe("Pickup location details"),
  undone: z.enum(["T"]).nullable().optional().describe("Undo (철회함)"),
  add_memo_too: z.enum(["T", "F"]).nullable().optional().describe("Add to admin memo"),
  undone_reason_type: z
    .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
    .nullable()
    .optional()
    .describe("Reason for undoing"),
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
  recover_coupon: z.enum(["T", "F"]).optional().describe("Restore a coupon"),
  recover_coupon_no: z
    .array(z.union([z.string(), z.number()]))
    .optional()
    .describe("Coupon numbers to be recovered"),
  refund_bank_name: z.string().max(250).nullable().optional().describe("Bank name"),
});

export const UpdateReturnInputSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    requests: z.array(UpdateReturnRequestSchema).describe("List of return update requests"),
  })
  .strict();
