import { z } from "zod";

export const LabelsSearchParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    limit: z.number().min(1).max(1000).default(100).describe("Limit the number of results"),
    offset: z.number().max(15000).default(0).describe("Start location of list"),
  })
  .strict();

export const LabelsCreateParamsSchema = z
  .object({
    shop_no: z.number().min(1).default(1).describe("Shop Number"),
    requests: z
      .array(
        z.object({
          name: z.string().describe("Order label name"),
          order_item_code: z.array(z.string()).describe("Order item code"),
        }),
      )
      .describe("Listing of label requests"),
  })
  .strict();
