import { z } from "zod";

export const GetOrderPaymentAmountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    order_item_code: z
      .string()
      .describe("Order item code. You can search multiple item with ,(comma)"),
  })
  .strict();
