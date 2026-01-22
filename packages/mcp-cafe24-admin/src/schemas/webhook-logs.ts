import { z } from "zod";

export const WebhookLogsSearchParamsSchema = z
  .object({
    event_no: z.number().int().optional().describe("Event number"),
    requested_start_date: z
      .string()
      .optional()
      .describe("Requested start date (YYYY-MM-DD or ISO 8601)"),
    requested_end_date: z
      .string()
      .optional()
      .describe("Requested end date (YYYY-MM-DD or ISO 8601)"),
    success: z.enum(["T", "F"]).optional().describe("Webhook sent successfully (T: Yes, F: No)"),
    log_type: z
      .enum(["G", "R", "T"])
      .optional()
      .describe("Log type (G: Sent, R: Resent, T: Test sent)"),
    since_log_id: z.string().optional().describe("Search after this log ID"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10000)
      .default(100)
      .describe("Search result limit (1-10000)"),
  })
  .strict();

export type WebhookLogsSearchParams = z.infer<typeof WebhookLogsSearchParamsSchema>;
