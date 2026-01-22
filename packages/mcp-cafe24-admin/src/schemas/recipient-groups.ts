import { z } from "zod";

export const RecipientGroupsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
    offset: z.number().int().max(10000).default(0).describe("Start location of list"),
  })
  .strict();

export const RecipientGroupDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    group_no: z.number().int().min(1).describe("Distribution group number"),
  })
  .strict();

export const CreateRecipientGroupParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        group_name: z.string().max(40).describe("Distribution group name"),
        group_description: z
          .string()
          .max(255)
          .optional()
          .describe("Distribution group description"),
        news_mail: z.enum(["T", "F", "D"]).optional().describe("Whether to receive news mails"),
        sms: z.enum(["T", "F"]).optional().describe("Whether to receive SMS"),
        member_group_no: z.number().int().min(1).optional().describe("Group number"),
        member_class: z.enum(["P", "C", "F", "p", "c", "f"]).optional().describe("Member class"),
        member_type: z.string().optional().describe("Member type (e.g., VIP, Poor)"),
        join_path: z.enum(["P", "M"]).optional().describe("Sign up medium"),
        inflow_path: z.string().optional().describe("Traffic source"),
        inflow_path_detail: z.string().optional().describe("Traffic source details"),
        date_type: z
          .enum([
            "Join",
            "Birthday",
            "Wedding",
            "Partner",
            "join",
            "birthday",
            "wedding",
            "partner",
          ])
          .optional()
          .describe("Date type"),
        start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
        end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
        solar_calendar: z.enum(["T", "F"]).optional().describe("Whether it is a solar calendar"),
        age_min: z
          .number()
          .int()
          .min(1)
          .max(99)
          .optional()
          .describe("Minimum search value for age"),
        age_max: z
          .number()
          .int()
          .min(1)
          .max(99)
          .optional()
          .describe("Maximum search value for age"),
        gender: z.enum(["M", "F"]).optional().describe("Gender"),
        available_points_min: z
          .number()
          .int()
          .min(0)
          .max(999999999)
          .optional()
          .describe("Minimum search value for points"),
        available_points_max: z
          .number()
          .int()
          .min(0)
          .max(999999999)
          .optional()
          .describe("Maximum search value for points"),
        use_mobile_app: z.enum(["T", "F"]).optional().describe("Whether to use mobile app"),
        plusapp_member_join: z
          .enum(["T", "F"])
          .optional()
          .describe("Check whether the customer has created an account via Plus App"),
      })
      .strict(),
  })
  .strict();

export const UpdateRecipientGroupParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    group_no: z.number().int().min(1).describe("Distribution group number"),
    request: z
      .object({
        group_name: z.string().max(40).describe("Distribution group name"),
        group_description: z
          .string()
          .max(255)
          .optional()
          .describe("Distribution group description"),
        news_mail: z.enum(["T", "F", "D"]).optional().describe("Whether to receive news mails"),
        sms: z.enum(["T", "F"]).optional().describe("Whether to receive SMS"),
        member_group_no: z.number().int().min(1).optional().describe("Group number"),
        member_class: z.enum(["P", "C", "F", "p", "c", "f"]).optional().describe("Member class"),
        member_type: z.string().optional().describe("Member type"),
        join_path: z.enum(["P", "M"]).optional().describe("Sign up medium"),
        inflow_path: z.string().optional().describe("Traffic source"),
        inflow_path_detail: z.string().optional().describe("Traffic source details"),
        date_type: z
          .enum([
            "Join",
            "Birthday",
            "Wedding",
            "Partner",
            "join",
            "birthday",
            "wedding",
            "partner",
          ])
          .optional()
          .describe("Date type"),
        start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
        end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
        solar_calendar: z.enum(["T", "F"]).optional().describe("Whether it is a solar calendar"),
        age_min: z
          .number()
          .int()
          .min(1)
          .max(99)
          .optional()
          .describe("Minimum search value for age"),
        age_max: z
          .number()
          .int()
          .min(1)
          .max(99)
          .optional()
          .describe("Maximum search value for age"),
        gender: z.enum(["M", "F"]).optional().describe("Gender"),
        available_points_min: z
          .number()
          .int()
          .min(0)
          .max(999999999)
          .optional()
          .describe("Minimum search value for points"),
        available_points_max: z
          .number()
          .int()
          .min(0)
          .max(999999999)
          .optional()
          .describe("Maximum search value for points"),
        use_mobile_app: z.enum(["T", "F"]).optional().describe("Whether to use mobile app"),
        plusapp_member_join: z
          .enum(["T", "F"])
          .optional()
          .describe("Check whether the customer has created an account via Plus App"),
      })
      .strict(),
  })
  .strict();

export const DeleteRecipientGroupParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    group_no: z.number().int().min(1).describe("Distribution group number"),
  })
  .strict();
