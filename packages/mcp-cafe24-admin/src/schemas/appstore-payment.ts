import { z } from "zod";

export const AppstorePaymentsSearchParamsSchema = z
  .object({
    order_id: z
      .string()
      .optional()
      .describe("App store order ID(s). You can search multiple with comma."),
    start_date: z.string().describe("Search start date (YYYY-MM-DD or ISO8601)"),
    end_date: z.string().describe("Search end date (YYYY-MM-DD or ISO8601)"),
    currency: z.enum(["KRW", "USD", "JPY", "PHP"]).optional().describe("Currency"),
    limit: z.number().int().min(1).max(50).default(20).describe("Limit (1-50)"),
    offset: z.number().int().max(10000).default(0).describe("Offset (max 10000)"),
  })
  .strict();

export const AppstorePaymentsCountParamsSchema = z
  .object({
    order_id: z
      .string()
      .optional()
      .describe("App store order ID(s). You can search multiple with comma."),
    start_date: z.string().describe("Search start date (YYYY-MM-DD or ISO8601)"),
    end_date: z.string().describe("Search end date (YYYY-MM-DD or ISO8601)"),
    currency: z.enum(["KRW", "USD", "JPY", "PHP"]).optional().describe("Currency"),
  })
  .strict();

export type AppstorePaymentsSearchParams = z.infer<typeof AppstorePaymentsSearchParamsSchema>;
export type AppstorePaymentsCountParams = z.infer<typeof AppstorePaymentsCountParamsSchema>;
