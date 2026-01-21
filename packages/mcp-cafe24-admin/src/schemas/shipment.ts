import { z } from "zod";

export const ListShipmentsParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number (Min 1)"),
  order_id: z.string().describe("Order ID"),
});

export const CreateShipmentParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number"),
  order_id: z.string().describe("Order ID"),
  request: z.object({
    tracking_no: z.string().max(40).describe("Tracking number"),
    shipping_company_code: z.string().describe("Shipping carrier code"),
    order_item_code: z.array(z.string()).optional().describe("Order item code"),
    status: z.enum(["standby", "shipping"]).describe("Order status (standby, shipping)"),
    shipping_code: z.string().optional().describe("Shipping code"),
    carrier_id: z.number().optional().describe("Shipping carrier ID"),
  }),
});

export const UpdateShipmentParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number"),
  order_id: z.string().describe("Order ID"),
  shipping_code: z.string().describe("Shipping code"),
  request: z.object({
    status: z.enum(["standby", "shipping", "shipped"]).optional().describe("Order status"),
    status_additional_info: z.string().max(30).optional().describe("Order status additional info"),
    tracking_no: z.string().max(40).nullable().optional().describe("Tracking number"),
    shipping_company_code: z.string().nullable().optional().describe("Shipping carrier code"),
  }),
});

export const DeleteShipmentParamsSchema = z.object({
  shop_no: z.number().optional().default(1).describe("Shop Number (Min 1)"),
  order_id: z.string().describe("Order ID"),
  shipping_code: z.string().describe("Shipping code"),
});

// Bulk Shipment Create (POST /admin/shipments)
const BulkCreateShipmentRequestSchema = z.object({
  tracking_no: z.string().max(40).describe("Tracking number"),
  shipping_company_code: z.string().describe("Shipping carrier code"),
  status: z
    .enum(["standby", "shipping"])
    .describe("Order status (standby: waiting for shipping, shipping: on delivery)"),
  order_id: z.string().optional().describe("Order ID"),
  shipping_code: z.string().optional().describe("Shipping code"),
  order_item_code: z.array(z.string()).optional().describe("Order item codes"),
  carrier_id: z.number().optional().describe("Shipping carrier ID"),
});

export const BulkCreateShipmentInputSchema = z
  .object({
    shop_no: z.number().optional().default(1).describe("Shop Number"),
    requests: z.array(BulkCreateShipmentRequestSchema).describe("List of shipment create requests"),
  })
  .strict();

// Bulk Shipment Update (PUT /admin/shipments)
const BulkUpdateShipmentRequestSchema = z.object({
  shipping_code: z.string().describe("Shipping code"),
  order_id: z.string().optional().describe("Order ID"),
  status: z
    .enum(["standby", "shipping", "shipped"])
    .optional()
    .describe("Order status (standby, shipping, shipped)"),
  status_additional_info: z
    .string()
    .max(30)
    .nullable()
    .optional()
    .describe("Order status additional info"),
  tracking_no: z
    .string()
    .max(40)
    .nullable()
    .optional()
    .describe("Tracking number (cannot be used with status)"),
  shipping_company_code: z
    .string()
    .nullable()
    .optional()
    .describe("Shipping carrier code (must be used with tracking_no)"),
});

export const BulkUpdateShipmentInputSchema = z
  .object({
    shop_no: z.number().optional().default(1).describe("Shop Number"),
    requests: z.array(BulkUpdateShipmentRequestSchema).describe("List of shipment update requests"),
  })
  .strict();

export type ListShipmentsParams = z.infer<typeof ListShipmentsParamsSchema>;
export type CreateShipmentParams = z.infer<typeof CreateShipmentParamsSchema>;
export type UpdateShipmentParams = z.infer<typeof UpdateShipmentParamsSchema>;
export type DeleteShipmentParams = z.infer<typeof DeleteShipmentParamsSchema>;
export type BulkCreateShipmentInput = z.infer<typeof BulkCreateShipmentInputSchema>;
export type BulkUpdateShipmentInput = z.infer<typeof BulkUpdateShipmentInputSchema>;
