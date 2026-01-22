import { z } from "zod";

export const WebhookSettingParamsSchema = z.object({}).strict();

export const WebhookSettingUpdateParamsSchema = z
  .object({
    reception_status: z
      .enum(["T", "F"])
      .describe("Webhook reception status (T: Activated, F: Deactivated)"),
  })
  .strict();

export type WebhookSettingParams = z.infer<typeof WebhookSettingParamsSchema>;
export type WebhookSettingUpdateParams = z.infer<typeof WebhookSettingUpdateParamsSchema>;
