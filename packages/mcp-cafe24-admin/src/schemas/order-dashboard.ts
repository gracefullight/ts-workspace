import { z } from "zod";

export const GetOrderDashboardParamsSchema = z.object({
  shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number (Min 1)"),
});

export type GetOrderDashboardParams = z.infer<typeof GetOrderDashboardParamsSchema>;
