import { z } from "zod";

export const ExchangeRequestCreateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          order_id: z.string().describe("Order ID"),
          items: z
            .array(
              z.object({
                order_item_code: z.string().describe("Order item code"),
                quantity: z.number().describe("Quantity"),
              }),
            )
            .describe("List of items"),
          exchange_items: z
            .array(
              z.object({
                product_no: z.number().describe("Product number"),
                variant_code: z.string().describe("Product item code"),
                quantity: z.number().describe("Available inventory"),
              }),
            )
            .optional()
            .describe("Products for exchange"),
          request_pickup: z
            .enum(["T", "F"])
            .optional()
            .describe("Request pickup (T: Request pickup, F: Send directly)"),
          pickup: z
            .object({
              name: z.string().describe("Name"),
              phone: z.string().describe("Phone"),
              cellphone: z.string().describe("Cellphone"),
              zipcode: z.string().describe("Zipcode"),
              address1: z.string().describe("Address 1"),
              address2: z.string().describe("Address 2"),
            })
            .nullable()
            .optional()
            .describe("Pickup location details"),
          tracking_no: z.string().max(40).nullable().optional().describe("Return tracking number"),
          shipping_company_name: z
            .string()
            .max(30)
            .nullable()
            .optional()
            .describe("Return shipping carrier"),
          reason_type: z
            .enum(["A", "E", "K", "J", "I"])
            .describe(
              "Type of reason (A: Change of mind, E: Unsatisfactory product, K: Defective product, J: Shipping error, I: Others)",
            ),
          reason: z.string().max(2000).describe("Reason for exchange"),
          refund_bank_code: z
            .string()
            .nullable()
            .optional()
            .describe("Code assigned to bank for refunds"),
          refund_bank_name: z.string().max(250).nullable().optional().describe("Bank name"),
          refund_bank_account_no: z
            .string()
            .nullable()
            .optional()
            .describe("Refund account number"),
          refund_bank_account_holder: z
            .string()
            .max(15)
            .nullable()
            .optional()
            .describe("Refund Account Account Holder's Name"),
        }),
      )
      .describe("Listing of exchange requests"),
  })
  .strict();

export const ExchangeRequestUpdateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          order_id: z.string().describe("Order ID"),
          order_item_code: z.array(z.string()).describe("Order item code"),
          undone: z.enum(["T"]).describe("Rejected to accept (T: Yes)"),
          reason_type: z
            .enum(["A", "B", "J", "C", "L", "D", "E", "F", "K", "G", "H", "I"])
            .optional()
            .describe(
              "Type of reason (A: change of mind, B: shipping delay, J: shipping error, C: unavailable shipping zone, L: Export/Customs clearance issue, D: bad packaging, E: dissatisfied with product, F:product does not match the description, K: defective product, G: dissatisfied with service, H: out of stock, I: others)",
            ),
          reason: z.string().max(2000).nullable().optional().describe("Reason"),
          display_reject_reason: z
            .enum(["T", "F"])
            .optional()
            .describe("Display reason in [Storefront>My Orders] (T: yes, F: no)"),
          reject_reason: z
            .string()
            .max(2000)
            .nullable()
            .optional()
            .describe("Reason for rejection"),
        }),
      )
      .describe("Listing of exchange request updates"),
  })
  .strict();
