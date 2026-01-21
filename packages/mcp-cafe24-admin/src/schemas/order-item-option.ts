import { z } from "zod";

const AdditionalOptionSchema = z.object({
  additional_option_name: z.string().describe("custom text field name"),
  additional_option_value: z.string().describe("Additional option value"),
});

export const CreateOrderItemOptionsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    order_item_code: z.string().describe("Order item code"),
    request: z.object({
      product_bundle: z.enum(["T", "F"]).describe("Product bundle"),
      variant_code: z.string().describe("Variant code"),
      additional_options: z.array(AdditionalOptionSchema).describe("Additional options"),
      bundle_additional_options: z
        .string()
        .nullable()
        .optional()
        .describe("Bundle custom text field"),
    }),
  })
  .strict();

export const UpdateOrderItemOptionsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID"),
    order_item_code: z.string().describe("Order item code"),
    request: z.object({
      additional_options: z.array(AdditionalOptionSchema).describe("Additional options"),
    }),
  })
  .strict();
