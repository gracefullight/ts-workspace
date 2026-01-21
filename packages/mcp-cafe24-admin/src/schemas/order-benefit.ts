import { z } from "zod";

export const OrderBenefitsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID. You can search multiple item with ,(comma)"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit (1-500)"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export const OrderCouponsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_id: z.string().describe("Order ID. You can search multiple item with ,(comma)"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit (1-500)"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
  })
  .strict();
