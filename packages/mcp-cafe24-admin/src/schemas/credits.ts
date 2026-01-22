import { z } from "zod";

export const ListCreditsSchema = z.object({
  shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
  start_date: z.string().describe("Search Start Date (Format: YYYY-MM-DD)"),
  end_date: z.string().describe("Search End Date (Format: YYYY-MM-DD)"),
  type: z
    .enum(["I", "D"])
    .optional()
    .describe("Whether increase/decrease credits (I: payment history, D: deduction details)"),
  case: z
    .enum(["A", "B", "C", "D", "E", "G"])
    .optional()
    .describe(
      "Cases for issuing credits (A: cancel order, B: refund deposit, C: purchase goods, D: arbitrary adjustment, E: cash refund, G: charge)",
    ),
  admin_id: z.string().optional().describe("Manager ID"),
  order_id: z.string().optional().describe("Order ID"),
  search_field: z
    .enum(["id", "reason"])
    .optional()
    .describe("Search field (id: ID, reason: Reason for processing)"),
  keyword: z.string().optional().describe("Keyword"),
  limit: z.number().min(1).max(200).optional().describe("Limit (Default: 50)"),
  offset: z.number().max(10000).optional().describe("Start location of list (Default: 0)"),
});

export const GetCreditsReportSchema = z.object({
  shop_no: z.number().optional().describe("Shop Number (Default: 1)"),
  start_date: z.string().describe("Search Start Date (Format: YYYY-MM-DD)"),
  end_date: z.string().describe("Search End Date (Format: YYYY-MM-DD)"),
  type: z
    .enum(["I", "D"])
    .optional()
    .describe("Whether increase/decrease credits (I: payment history, D: deduction details)"),
  case: z
    .enum(["A", "B", "C", "D", "E", "G"])
    .optional()
    .describe(
      "Cases for issuing credits (A: cancel order, B: refund deposit, C: purchase goods, D: arbitrary adjustment, E: cash refund, G: charge)",
    ),
  admin_id: z.string().optional().describe("Manager ID"),
  search_field: z
    .enum(["id", "reason"])
    .optional()
    .describe("Search field (id: ID, reason: Reason for processing)"),
  keyword: z.string().optional().describe("Keyword"),
});
