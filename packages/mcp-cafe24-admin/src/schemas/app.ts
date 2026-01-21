import { z } from "zod";

/**
 * Schema for getting app information (no parameters needed)
 */
export const AppDetailParamsSchema = z.object({}).strict();

export const AppUpdateParamsSchema = z
  .object({
    request: z
      .object({
        version: z.string().describe("Version"),
        extension_type: z
          .enum(["section", "embedded"])
          .describe("Extension type (section or embedded)"),
      })
      .strict()
      .describe("Update request"),
  })
  .strict();

export type AppDetailParams = z.infer<typeof AppDetailParamsSchema>;
export type AppUpdateParams = z.infer<typeof AppUpdateParamsSchema>;
