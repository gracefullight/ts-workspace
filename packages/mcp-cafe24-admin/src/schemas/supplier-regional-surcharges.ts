import { z } from "zod";

export const supplierRegionalSurchargeSchema = z.object({
  shop_no: z.number(),
  regional_surcharge_no: z.number(),
  supplier_id: z.string(),
  country_code: z.string(),
  region_name: z.string(),
  surcharge_region_name: z.string().nullable().optional(),
  start_zipcode: z.string().optional(),
  end_zipcode: z.string().optional(),
  regional_surcharge_amount: z.string(),
  use_regional_surcharge: z.enum(["T", "F"]).optional(),
});

export const listSupplierRegionalSurchargesParametersSchema = z.object({
  shop_no: z.number().optional(),
  supplier_id: z.string().max(20),
  offset: z.number().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const createSupplierRegionalSurchargeParametersSchema = z.object({
  shop_no: z.number().optional(),
  supplier_id: z.string().max(20),
  country_code: z.string().max(2),
  region_name: z.string().max(255),
  use_regional_surcharge: z.enum(["T", "F"]),
  surcharge_region_name: z.string().max(300).optional(),
  start_zipcode: z.string().max(8).optional(),
  end_zipcode: z.string().max(8).optional(),
  regional_surcharge_amount: z.string(), // Provide as string representing the amount
});

export const deleteSupplierRegionalSurchargeParametersSchema = z.object({
  shop_no: z.number().optional(),
  supplier_id: z.string().max(20),
  regional_surcharge_no: z.number(),
});
