import { z } from "zod";

export const CustomersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    member_id: z.string().optional().describe("Filter by member ID"),
    email: z.string().optional().describe("Filter by email"),
    name: z.string().optional().describe("Filter by name"),
  })
  .strict();

export const CustomerDetailParamsSchema = z
  .object({
    member_id: z.string().describe("Member ID"),
  })
  .strict();

export const CustomerSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const CustomerSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    simple_member_join: z
      .enum(["T", "F"])
      .optional()
      .describe("Join form display: T=Basic, F=Detailed"),
    member_authentication: z
      .enum(["T", "F"])
      .optional()
      .describe("Member authentication: T=Yes, F=No"),
    minimum_age_restriction: z
      .enum(["M", "T", "F"])
      .optional()
      .describe("Under 14 restriction: M=After auth, T=Direct use, F=No join"),
    join_standard: z.enum(["id", "email"]).optional().describe("Join standard: id or email"),
    use_update_birthday: z
      .enum(["T", "F"])
      .optional()
      .describe("Allow birthday update: T=Yes, F=No"),
  })
  .strict();

export const CustomerPrivacyParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number (default: 1)"),
    member_id: z.string().max(200).optional().describe("Member ID(s), comma-separated"),
    cellphone: z.string().max(200).optional().describe("Mobile number(s), comma-separated"),
  })
  .strict()
  .refine((data) => data.member_id || data.cellphone, {
    message: "Either member_id or cellphone must be provided",
    path: ["member_id"],
  });
