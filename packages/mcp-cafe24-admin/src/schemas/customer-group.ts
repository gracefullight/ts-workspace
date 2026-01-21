import { z } from "zod";

export const CustomerGroupsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().default(1).describe("Shop Number. Defaults to 1."),
    group_no: z
      .string()
      .optional()
      .describe("Group number. You can search multiple items with ,(comma)."),
    group_name: z
      .string()
      .max(200) // Increased slightly to allow for multiple group names separated by comma
      .optional()
      .describe("Group Name. You can search multiple items with ,(comma)."),
  })
  .strict();

export const CustomerGroupsCountParamsSchema = z
  .object({
    shop_no: z.number().int().default(1).describe("Shop Number. Defaults to 1."),
    group_no: z
      .string()
      .optional()
      .describe("Group number. You can search multiple items with ,(comma)."),
    group_name: z
      .string()
      .max(200)
      .optional()
      .describe("Group Name. You can search multiple items with ,(comma)."),
  })
  .strict();

export const CustomerGroupParamsSchema = z
  .object({
    shop_no: z.number().int().default(1).describe("Shop Number. Defaults to 1."),
    group_no: z.number().int().describe("Group number."),
  })
  .strict();

export const MoveCustomerToGroupParamsSchema = z
  .object({
    shop_no: z.number().int().default(1).describe("Shop Number. Defaults to 1."),
    group_no: z.number().int().describe("Group number of the target tier."),
    requests: z
      .array(
        z.object({
          member_id: z.string().max(20).describe("Member ID to move."),
          fixed_group: z
            .enum(["T", "F"])
            .default("F")
            .describe(
              "Whether the rating is fixed so that a specific member does not apply to automatic member rating change. T: fix, F: do not fix. Default: F.",
            ),
        }),
      )
      .describe("List of customers to move to the specified group."),
  })
  .strict();

export const CommonParamsSchema = z
  .object({
    shop_no: z.number().int().default(1).describe("Shop Number. Defaults to 1."),
  })
  .strict();
