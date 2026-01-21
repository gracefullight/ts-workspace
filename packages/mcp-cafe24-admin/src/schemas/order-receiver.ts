import { z } from "zod";

export const OrderReceiverSearchParamsSchema = z
  .object({
    shop_no: z.number().describe("Shop Number (default: 1)"),
    order_id: z.string().describe("Order ID"),
    shipping_code: z
      .string()
      .optional()
      .describe("Shipping code. You can search multiple item with ,(comma)"),
  })
  .strict();

export const OrderReceiverUpdateRequestSchema = z
  .object({
    name: z.string().max(20).optional().describe("Receiver name"),
    name_furigana: z
      .string()
      .optional()
      .describe("Receiver name (Pronunciation). Required for Japanese stores only"),
    name_en: z.string().optional().describe("Receiver name (English)"),
    phone: z.string().max(20).optional().describe("Receiver phone number"),
    cellphone: z.string().max(20).optional().describe("Receiver mobile phone number"),
    virtual_phone_no: z.string().optional().describe("Receiver virtual number"),
    zipcode: z.string().min(2).max(14).optional().describe("Zipcode"),
    address1: z.string().max(255).optional().describe("Address 1"),
    address2: z.string().max(255).optional().describe("Address 2"),
    address_state: z.string().optional().describe("state. Required for international stores"),
    address_city: z.string().optional().describe("City / Town. Required for international stores"),
    city_en: z.string().optional().describe("Receiver city (English)"),
    state_en: z.string().optional().describe("Receiver state (English)"),
    street_en: z.string().optional().describe("Receiver address (English)"),
    country_code: z.string().optional().describe("Country code"),
    shipping_message: z.string().optional().describe("Shipping message"),
    clearance_information_type: z
      .enum(["I", "P", "C"])
      .optional()
      .describe(
        "customs clearance information. I: ID, P: Passport number, C: Personal Customs Clearance Code",
      ),
    clearance_information: z.string().optional().describe("customs clearance information"),
    change_default_shipping_address: z
      .enum(["T", "F"])
      .optional()
      .describe("Change default shipping address. T: Yes, F: No (Default: F)"),
    wished_delivery_date: z.string().optional().describe("Desired delivery date"),
    use_fast_delivery_date: z.enum(["T", "F"]).optional().describe("Select ASAP delivery date"),
    wished_delivery_time: z
      .object({
        start_hour: z.string().describe("Desired delivery start time (00-23)"),
        end_hour: z.string().describe("Desired delivery end time (00-23)"),
      })
      .optional()
      .describe("Desired delivery time"),
    use_fast_delivery_time: z.enum(["T", "F"]).optional().describe("Select ASAP delivery time"),
    receiver_direct_input_check: z
      .enum(["T", "F"])
      .optional()
      .describe("Address direct input check"),
    shipping_code: z.string().optional().describe("Shipping code"),
  })
  .strict();

export const OrderReceiversUpdateParamsSchema = z
  .object({
    shop_no: z.number().describe("Shop Number (default: 1)"),
    order_id: z.string().describe("Order ID"),
    requests: z
      .array(OrderReceiverUpdateRequestSchema)
      .describe("List of receiver update requests"),
  })
  .strict();

export const OrderReceiverUpdateParamsSchema = z
  .object({
    shop_no: z.number().describe("Shop Number (default: 1)"),
    order_id: z.string().describe("Order ID"),
    shipping_code: z.string().describe("Shipping code"),
    request: OrderReceiverUpdateRequestSchema.describe("Receiver update request"),
  })
  .strict();

export const ReceiverHistorySearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
  })
  .strict();
