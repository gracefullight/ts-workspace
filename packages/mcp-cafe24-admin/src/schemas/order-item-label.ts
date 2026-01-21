import { z } from "zod";

export const OrderItemLabelsBaseParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
  order_id: z.string().describe("Order ID"),
  order_item_code: z.string().describe("Order item code"),
});

export const OrderItemLabelsListParamsSchema = OrderItemLabelsBaseParamsSchema.strict();

export const OrderItemLabelsCreateParamsSchema = OrderItemLabelsBaseParamsSchema.extend({
  request: z.object({
    names: z.array(z.string()).describe("Order label names"),
  }),
}).strict();

export const OrderItemLabelsUpdateParamsSchema = OrderItemLabelsCreateParamsSchema;

export const OrderItemLabelsDeleteParamsSchema = OrderItemLabelsBaseParamsSchema.extend({
  name: z.string().describe("Order label name to delete"),
}).strict();
