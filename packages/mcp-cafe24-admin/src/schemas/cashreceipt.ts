import { z } from "zod";

export const CashReceiptSearchParamsSchema = z
  .object({
    start_date: z.string().describe("Search Start Date (YYYY-MM-DD or ISO8601)"),
    end_date: z.string().describe("Search End Date (YYYY-MM-DD or ISO8601)"),
    order_id: z.string().optional().describe("Order ID (comma-separated for multi-search)"),
    approval_no: z.string().max(9).optional().describe("Approval Number"),
    name: z.string().max(20).optional().describe("Requester Name"),
    member_id: z.string().max(20).optional().describe("Member ID"),
    status: z
      .enum([
        "all",
        "request",
        "issued",
        "canceled_request",
        "canceled_issuance",
        "failed_issuance",
      ])
      .default("all")
      .describe("Status filter"),
    limit: z.number().int().min(1).max(500).default(10).describe("Limit (1-500)"),
    offset: z.number().int().max(8000).default(0).describe("Start location of list"),
  })
  .strict();

export const CashReceiptCreateSchema = z.object({
  order_id: z.string().describe("Order ID"),
  type: z.enum(["personal", "business"]).describe("Issuance type"),
  company_registration_no: z
    .string()
    .max(10)
    .optional()
    .describe("Company registration number (for business)"),
  cellphone: z.string().max(11).optional().describe("Mobile/Cell phone number"),
});

export const CashReceiptCreateParamsSchema = z
  .object({
    request: CashReceiptCreateSchema,
  })
  .strict();

export const CashReceiptUpdateParamsSchema = z
  .object({
    cashreceipt_no: z.number().int().min(1).describe("Cash receipt number"),
    request: CashReceiptCreateSchema,
  })
  .strict();

export const CashReceiptCancelParamsSchema = z
  .object({
    cashreceipt_no: z.number().int().min(1).describe("Cash receipt number"),
    request: z.object({
      order_id: z.string().describe("Order ID"),
      type: z
        .enum(["request", "issue"])
        .describe("Cancellation type (request: Cancel request, issue: Cancel issuance)"),
    }),
  })
  .strict();
