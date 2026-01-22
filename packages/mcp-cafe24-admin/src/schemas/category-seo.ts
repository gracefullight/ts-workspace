import { z } from "zod";

/**
 * Schema for retrieving category SEO settings
 */
export const CategorySeoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    category_no: z.number().int().min(1).describe("Category number"),
  })
  .strict();

export type CategorySeoParams = z.infer<typeof CategorySeoParamsSchema>;

/**
 * Schema for updating category SEO settings
 */
export const CategorySeoUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    category_no: z.number().int().min(1).describe("Category number"),
    search_engine_exposure: z
      .enum(["T", "F"])
      .optional()
      .describe("Exposure setting for search engine (T: Use, F: Do not use)"),
    meta_title: z.string().optional().describe("Browser title"),
    meta_author: z.string().optional().describe("Meta tag 1: Author"),
    meta_description: z.string().optional().describe("Meta tag 2: Description"),
    meta_keywords: z.string().optional().describe("Meta tag 3: Keywords"),
  })
  .strict();

export type CategorySeoUpdateParams = z.infer<typeof CategorySeoUpdateParamsSchema>;
