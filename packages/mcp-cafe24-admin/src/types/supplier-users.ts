export interface SupplierUserName {
  shop_no: number;
  user_name: string;
}

export interface SupplierUserNickName {
  shop_no: number;
  nick_name: string;
}

export interface SupplierUser extends Record<string, unknown> {
  shop_no?: number;
  user_id: string;
  supplier_code: string;
  supplier_name: string;
  user_name?: string | SupplierUserName[];
  nick_name?: string | SupplierUserNickName[];
  nick_name_icon_type?: "D" | "S";
  nick_name_icon_url?: string;
  use_nick_name_icon?: "T" | "F";
  use_writer_name_icon?: "T" | "F";
  email?: string;
  phone?: string;
  permission_shop_no?: number[];
  permission_category_select?: "T" | "F" | "";
  permitted_category_list?: number[];
  permission_product_modify?: "T" | "F" | "";
  permission_product_display?: "T" | "F" | "";
  permission_product_selling?: "T" | "F" | "";
  permission_product_delete?: "T" | "F" | "";
  permission_board_manage?: "T" | "F" | "";
  permission_amount_inquiry?: "T" | "F" | "";
  permission_order_menu?: "T" | "F" | "";
  permission_order_cs?: "T" | "F" | "";
  permission_order_refund?: "T" | "F" | "";
  permission_delivery_fee_inquiry?: "T" | "F" | "";
}

export interface ListSupplierUsersResponse extends Record<string, unknown> {
  users: SupplierUser[];
}

export interface CountSupplierUsersResponse extends Record<string, unknown> {
  count: number;
}

export interface SupplierUserResponse extends Record<string, unknown> {
  user: SupplierUser;
}
