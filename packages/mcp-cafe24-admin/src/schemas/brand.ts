import { z } from "zod";

export const ListBrandsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    brand_code: z.string().optional().describe("Brand code (comma separated)"),
    brand_name: z.string().optional().describe("Brand name (comma separated)"),
    use_brand: z.enum(["T", "F"]).optional().describe("Whether to use a brand"),
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .optional()
      .default(0)
      .describe("Start location of list"),
    limit: z.number().int().min(1).max(100).optional().default(10).describe("Limit"),
  })
  .strict();

export const CountBrandsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    brand_code: z.string().optional().describe("Brand code (comma separated)"),
    brand_name: z.string().optional().describe("Brand name (comma separated)"),
    use_brand: z.enum(["T", "F"]).optional().describe("Whether to use a brand"),
  })
  .strict();

export const CreateBrandSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    request: z
      .object({
        brand_name: z.string().max(50).describe("Brand name"),
        use_brand: z.enum(["T", "F"]).optional().default("T").describe("Whether to use a brand"),
        search_keyword: z.string().max(200).optional().describe("Search keyword"),
      })
      .strict(),
  })
  .strict();

export const UpdateBrandSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    brand_code: z.string().length(8).describe("Brand code"),
    request: z
      .object({
        brand_name: z.string().max(50).optional().describe("Brand name"),
        use_brand: z.enum(["T", "F"]).optional().describe("Whether to use a brand"),
        search_keyword: z.string().max(200).optional().describe("Search keyword"),
      })
      .strict(),
  })
  .strict();

export const DeleteBrandSchema = z
  .object({
    brand_code: z.string().length(8).describe("Brand code"),
  })
  .strict();

export type ListBrands = z.infer<typeof ListBrandsSchema>;
export type CountBrands = z.infer<typeof CountBrandsSchema>;
export type CreateBrand = z.infer<typeof CreateBrandSchema>;
export type UpdateBrand = z.infer<typeof UpdateBrandSchema>;
export type DeleteBrand = z.infer<typeof DeleteBrandSchema>;
