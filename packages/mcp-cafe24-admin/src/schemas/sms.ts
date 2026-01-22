import { z } from "zod";

export const SendSMSSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        sender_no: z.number().int().describe("Sender ID (Unique number of sender)"),
        content: z
          .string()
          .describe("Message content. Single SMS max 90 bytes, LMS max 2000 bytes."),
        recipients: z.array(z.string()).max(100).optional().describe("Array of recipient numbers"),
        member_id: z.array(z.string()).max(100).optional().describe("Array of member IDs"),
        group_no: z.number().int().optional().describe("Group number (0: All customer tiers)"),
        exclude_unsubscriber: z
          .enum(["T", "F"])
          .default("T")
          .describe("Whether to exclude SMS rejected recipients (T: exclude, F: include)"),
        type: z
          .enum(["SMS", "LMS"])
          .default("SMS")
          .describe("Type of SMS (SMS: short message, LMS: long message)"),
        title: z.string().optional().describe("Title for LMS messages"),
      })
      .strict(),
  })
  .strict()
  .describe("Parameters for sending SMS/LMS");

export type SendSMS = z.infer<typeof SendSMSSchema>;
