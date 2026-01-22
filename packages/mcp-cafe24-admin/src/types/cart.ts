export interface CartAdditionalOptionValue {
  key: string;
  type: "text" | "url";
  value: string;
  name: string;
}

export interface CartItem extends Record<string, unknown> {
  shop_no: number;
  basket_product_no: number;
  member_id: string;
  created_date: string;
  product_no: number;
  additional_option_values: CartAdditionalOptionValue[];
  variant_code: string;
  quantity: number;
  product_price: string;
  option_price: string;
  product_bundle: "T" | "F";
  shipping_type: "A" | "B";
  category_no: number;
}

export interface CartListResponse {
  carts: CartItem[];
}

export interface ProductCart extends Record<string, unknown> {
  shop_no: number;
  member_id: string;
  created_date: string;
  product_no: number;
  variant_code: string;
  quantity: number;
  product_bundle: "T" | "F";
}

export interface ListProductCartsResponse extends Record<string, unknown> {
  carts: ProductCart[];
  links?: { rel: string; href: string }[];
}

export interface CountProductCartsResponse extends Record<string, unknown> {
  count: number;
}
