export interface OrderItemAdditionalOption {
  additional_option_name: string;
  additional_option_value: string;
}

export interface CreateOrderItemOptionsParams {
  shop_no?: number;
  request: {
    product_bundle: string;
    variant_code: string;
    additional_options: OrderItemAdditionalOption[];
    bundle_additional_options?: string | null;
  };
}

export interface UpdateOrderItemOptionsParams {
  shop_no?: number;
  request: {
    additional_options: OrderItemAdditionalOption[];
  };
}

export interface OrderItemOptionsResponse {
  item: {
    shop_no: number;
    order_id: string;
    order_item_code: string;
    product_bundle?: string;
    additional_options: OrderItemAdditionalOption[];
    bundle_additional_options?: string | null;
  };
}
