import { z } from "zod";

export const CategoryDecorationImagesGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number (required)"),
  })
  .strict();

export const CategoryDecorationImagesUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number (required)"),
    use_menu_image_pc: z
      .enum(["T", "F"])
      .optional()
      .describe("Menu image settings for PC store (T: Used, F: Not used)"),
    menu_image_pc: z
      .string()
      .nullable()
      .optional()
      .describe("Default menu image for PC store (URL or data URI)"),
    menu_over_image_pc: z
      .string()
      .nullable()
      .optional()
      .describe("Overlay menu image for PC store (URL or data URI)"),
    use_top_image_pc: z
      .enum(["T", "F"])
      .optional()
      .describe("Header image settings for PC store (T: Used, F: Not used)"),
    top_images_pc: z
      .array(z.string())
      .max(3)
      .optional()
      .describe("Header images for PC store (max 3, URL or data URI)"),
    use_title_image_pc: z
      .enum(["T", "F"])
      .optional()
      .describe("Headline image settings for PC store (T: Used, F: Not used)"),
    title_image_pc: z
      .string()
      .nullable()
      .optional()
      .describe("Headline image for PC store (URL or data URI)"),
    use_menu_image_mobile: z
      .enum(["T", "F"])
      .optional()
      .describe("Menu image settings for mobile store (T: Used, F: Not used)"),
    menu_image_mobile: z
      .string()
      .nullable()
      .optional()
      .describe("Default menu image for mobile store (URL or data URI)"),
    use_top_image_mobile: z
      .enum(["T", "F"])
      .optional()
      .describe("Header image settings for mobile store (T: Used, F: Not used)"),
    top_images_mobile: z
      .array(z.string())
      .max(3)
      .optional()
      .describe("Header images for mobile store (max 3, URL or data URI)"),
    use_title_image_mobile: z
      .enum(["T", "F"])
      .optional()
      .describe("Headline image settings for mobile store (T: Used, F: Not used)"),
    title_image_mobile: z
      .string()
      .nullable()
      .optional()
      .describe("Headline image for mobile store (URL or data URI)"),
  })
  .strict();

export type CategoryDecorationImagesGetParams = z.infer<
  typeof CategoryDecorationImagesGetParamsSchema
>;
export type CategoryDecorationImagesUpdateParams = z.infer<
  typeof CategoryDecorationImagesUpdateParamsSchema
>;
