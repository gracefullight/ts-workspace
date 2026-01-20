import { z } from "zod";

const OrderformPropertyInputTypeSchema = z.enum(["T", "M", "R", "C", "S", "D", "I"]);
const OrderformPropertyIsRequiredSchema = z.enum(["T", "F"]);
const OrderformPropertyAvailableProductTypeSchema = z.enum(["A", "C", "P"]);
const OrderformPropertyInputScopeSchema = z.enum(["A", "P"]);

export const OrderformPropertiesListParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
  })
  .strict();

export const OrderformPropertyCreateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          input_type: OrderformPropertyInputTypeSchema.describe(
            "Field type (T: Text box (single line), M: Text box (multiple lines), R: Radio button, C: Checkbox, S: Select box, D: Calendar, I: Time)",
          ),
          is_required: OrderformPropertyIsRequiredSchema.describe(
            "Whether the checkout field is mandatory",
          ),
          subject: z.string().describe("Field name"),
          available_product_type: OrderformPropertyAvailableProductTypeSchema.describe(
            "Product settings (A: All products, C: By product category, P: Individual products)",
          ),
          input_scope: OrderformPropertyInputScopeSchema.describe(
            "Information collection settings (A: Collect information at once, P: Collect information by product)",
          ),
          description: z.string().max(500).nullable().optional().describe("Description"),
          field_length: z
            .number()
            .min(1)
            .max(250)
            .nullable()
            .optional()
            .describe("Field length (text box) - only for input_type T"),
          max_input_length: z
            .number()
            .min(1)
            .max(250)
            .nullable()
            .optional()
            .describe("Maximum number of characters allowed - only for input_type T"),
          textarea_rows: z
            .number()
            .min(1)
            .max(70)
            .nullable()
            .optional()
            .describe("Number of rows - only for input_type M"),
          width_percentage: z
            .number()
            .min(1)
            .max(100)
            .nullable()
            .optional()
            .describe("Width (%) - only for input_type T"),
          option_values: z
            .string()
            .nullable()
            .optional()
            .describe(
              'Input value for R, C, S (delimiter /) or I (JSON string like {"time_start":"00:00","time_end":"01:00","time_interval":"60"})',
            ),
          display_lines_desktop: z
            .number()
            .min(1)
            .max(999)
            .nullable()
            .optional()
            .describe("Options displayed per row (PC) - only for input_type R or C"),
          display_lines_mobile: z
            .number()
            .min(1)
            .max(999)
            .nullable()
            .optional()
            .describe("Options displayed per row (Mobile) - only for input_type R or C"),
          category_no: z
            .number()
            .nullable()
            .optional()
            .describe("Applicable product category no. (for type C or P)"),
          product_no: z
            .string()
            .nullable()
            .optional()
            .describe("Applicable product no. (for type C or P)"),
        }),
      )
      .describe("Listing of orderform property requests"),
  })
  .strict();

export const OrderformPropertyUpdateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    orderform_property_id: z.number().describe("Field ID"),
    request: z.object({
      input_type: OrderformPropertyInputTypeSchema.optional().describe("Field type"),
      is_required: OrderformPropertyIsRequiredSchema.optional().describe(
        "Whether the checkout field is mandatory",
      ),
      subject: z.string().optional().describe("Field name"),
      description: z.string().max(500).nullable().optional().describe("Description"),
      field_length: z
        .number()
        .min(1)
        .max(250)
        .nullable()
        .optional()
        .describe("Field length (text box)"),
      max_input_length: z
        .number()
        .min(1)
        .max(250)
        .nullable()
        .optional()
        .describe("Maximum number of characters allowed"),
      textarea_rows: z
        .number()
        .min(1)
        .max(70)
        .nullable()
        .optional()
        .describe("Number of rows (multiple lines)"),
      width_percentage: z.number().min(1).max(100).nullable().optional().describe("Width (%)"),
      option_values: z.string().nullable().optional().describe("Input value"),
      display_lines_desktop: z
        .number()
        .min(1)
        .max(999)
        .nullable()
        .optional()
        .describe("Options displayed per row (PC)"),
      display_lines_mobile: z
        .number()
        .min(1)
        .max(999)
        .nullable()
        .optional()
        .describe("Options displayed per row (Mobile)"),
      available_product_type:
        OrderformPropertyAvailableProductTypeSchema.optional().describe("Product settings"),
      input_scope: OrderformPropertyInputScopeSchema.optional().describe(
        "Information collection settings",
      ),
      category_no: z.number().nullable().optional().describe("Applicable product category no."),
      product_no: z.string().nullable().optional().describe("Applicable product no."),
    }),
  })
  .strict();

export const OrderformPropertyDeleteParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    orderform_property_id: z.number().describe("Field ID"),
  })
  .strict();
