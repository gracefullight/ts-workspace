import { z } from "zod";

export const supplierUserSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string(),
  supplier_code: z.string(),
  supplier_name: z.string(),
  user_name: z
    .union([
      z.string(),
      z.array(
        z.object({
          shop_no: z.number(),
          user_name: z.string(),
        }),
      ),
    ])
    .optional(),
  nick_name: z
    .union([
      z.string(),
      z.array(
        z.object({
          shop_no: z.number(),
          nick_name: z.string(),
        }),
      ),
    ])
    .optional(),
  nick_name_icon_type: z.enum(["D", "S"]).optional(),
  nick_name_icon_url: z.string().optional(),
  use_nick_name_icon: z.enum(["T", "F"]).optional(),
  use_writer_name_icon: z.enum(["T", "F"]).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  permission_shop_no: z.array(z.number()).optional(),
  permission_category_select: z.enum(["T", "F", ""]).optional(),
  permitted_category_list: z.array(z.number()).optional(),
  permission_product_modify: z.enum(["T", "F", ""]).optional(),
  permission_product_display: z.enum(["T", "F", ""]).optional(),
  permission_product_selling: z.enum(["T", "F", ""]).optional(),
  permission_product_delete: z.enum(["T", "F", ""]).optional(),
  permission_board_manage: z.enum(["T", "F", ""]).optional(),
  permission_amount_inquiry: z.enum(["T", "F", ""]).optional(),
  permission_order_menu: z.enum(["T", "F", ""]).optional(),
  permission_order_cs: z.enum(["T", "F", ""]).optional(),
  permission_order_refund: z.enum(["T", "F", ""]).optional(),
  permission_delivery_fee_inquiry: z.enum(["T", "F", ""]).optional(),
});

export const listSupplierUsersOutputSchema = z.object({
  users: z.array(supplierUserSchema),
});

export const supplierUserOutputSchema = z.object({
  user: supplierUserSchema,
});

export const countSupplierUsersOutputSchema = z.object({
  count: z.number(),
});

export const listSupplierUsersParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string().optional(),
  supplier_code: z.string().optional(),
  supplier_name: z.string().optional(),
  offset: z.number().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const countSupplierUsersParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string().optional(),
  supplier_code: z.string().optional(),
  supplier_name: z.string().optional(),
});

export const getSupplierUserParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string(),
});

export const createSupplierUserParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string().min(4).max(16),
  supplier_code: z.string().length(8),
  user_name: z.array(
    z.object({
      shop_no: z.number(),
      user_name: z.string(),
    }),
  ),
  password: z.string(),
  nick_name: z
    .array(
      z.object({
        shop_no: z.number(),
        nick_name: z.string(),
      }),
    )
    .optional(),
  use_nick_name_icon: z.enum(["T", "F"]).optional(),
  use_writer_name_icon: z.enum(["T", "F"]).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  permission_shop_no: z.array(z.number()),
  permission_category_select: z.enum(["T", "F"]).optional(),
  permitted_category_list: z.array(z.number()).optional(),
  permission_product_modify: z.enum(["T", "F"]).optional(),
  permission_product_display: z.enum(["T", "F"]).optional(),
  permission_product_selling: z.enum(["T", "F"]).optional(),
  permission_product_delete: z.enum(["T", "F"]).optional(),
  permission_order_menu: z.enum(["T", "F"]).optional(),
  permission_amount_inquiry: z.enum(["T", "F"]).optional(),
  permission_order_cs: z.enum(["T", "F"]).optional(),
  permission_order_refund: z.enum(["T", "F"]).optional(),
  permission_delivery_fee_inquiry: z.enum(["T", "F"]).optional(),
});

export const updateSupplierUserParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string(),
  user_name: z
    .array(
      z.object({
        shop_no: z.number(),
        user_name: z.string(),
      }),
    )
    .optional(),
  nick_name: z
    .array(
      z.object({
        shop_no: z.number(),
        nick_name: z.string(),
      }),
    )
    .optional(),
  password: z.string().optional(),
  use_nick_name_icon: z.enum(["T", "F"]).optional(),
  use_writer_name_icon: z.enum(["T", "F"]).optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  permission_shop_no: z.array(z.number()).optional(),
  permission_category_select: z.enum(["T", "F"]).optional(),
  permitted_category_list: z.array(z.number()).optional(),
  permission_product_modify: z.enum(["T", "F"]).optional(),
  permission_product_display: z.enum(["T", "F"]).optional(),
  permission_product_selling: z.enum(["T", "F"]).optional(),
  permission_product_delete: z.enum(["T", "F"]).optional(),
  permission_order_menu: z.enum(["T", "F"]).optional(),
  permission_amount_inquiry: z.enum(["T", "F"]).optional(),
  permission_order_cs: z.enum(["T", "F"]).optional(),
  permission_order_refund: z.enum(["T", "F"]).optional(),
  permission_delivery_fee_inquiry: z.enum(["T", "F"]).optional(),
});

export const deleteSupplierUserParametersSchema = z.object({
  shop_no: z.number().optional(),
  user_id: z.string(),
});
