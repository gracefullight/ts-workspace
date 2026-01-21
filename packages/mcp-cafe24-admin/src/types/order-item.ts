export interface AdditionalOptionValue {
  key: string;
  type: string;
  name: string;
  value: string;
}

export interface MultiInvoice {
  type: string;
  tracking_no: string;
  shipping_company_id: number;
  shipping_company_name?: string;
  shipping_company_code?: string;
  quantity: number;
}

export interface OrderItemOption {
  option_code: string;
  option_name: string | null;
  option_value: {
    option_text: string | null;
    value_no: number;
  };
}

export interface BundleItem {
  product_no: number;
  product_code: string;
  variant_code: string;
  product_name: string;
  product_name_default: string;
  option_id: string;
  option_value: string;
  option_value_default: string;
  additional_option_value: string;
  additional_option_values: AdditionalOptionValue[];
  quantity: number;
  supplier_id: string;
  eng_product_name: string | null;
  hs_code: string;
  product_price: string;
  option_price: string;
  custom_product_code?: string;
  custom_variant_code?: string | null;
}

export interface OrderItem {
  shop_no: number;
  item_no: number;
  order_item_code: string;
  variant_code: string;
  product_no: number;
  product_code: string;
  internal_product_name: string;
  custom_product_code: string;
  custom_variant_code: string;
  eng_product_name: string | null;
  option_id: string;
  option_value: string;
  option_value_default: string;
  additional_option_value: string;
  additional_option_values: AdditionalOptionValue[];
  product_name: string;
  product_name_default: string;
  product_price: string;
  option_price: string;
  additional_discount_price: string;
  coupon_discount_price: string;
  app_item_discount_amount: string;
  payment_amount: string;
  quantity: number;
  product_tax_type: string;
  tax_rate: number;
  supplier_product_name: string;
  supplier_transaction_type: string;
  supplier_id: string;
  supplier_name: string;
  tracking_no: string | null;
  shipping_code: string;
  claim_code: string | null;
  claim_reason_type: string | null;
  claim_reason: string | null;
  refund_bank_name: string;
  refund_bank_account_no: string;
  refund_bank_account_holder: string;
  post_express_flag: string | null;
  order_status: string;
  request_undone: string | null;
  claim_quantity: number;
  order_status_additional_info: string | null;
  status_code: string;
  status_text: string;
  open_market_status: string;
  bundled_shipping_type: string;
  shipping_company_id: string;
  shipping_company_name: string | null;
  shipping_company_code: string | null;
  product_bundle: string;
  product_bundle_no: string;
  product_bundle_name: string | null;
  product_bundle_name_default: string | null;
  product_bundle_type: string;
  was_product_bundle: string | null;
  original_bundle_item_no: string | null;
  naver_pay_order_id: string | null;
  naver_pay_claim_status: string | null;
  individual_shipping_fee: string;
  shipping_fee_type: string;
  shipping_fee_type_text: string;
  shipping_payment_option: string;
  payment_info_id: string;
  original_item_no: number[];
  store_pickup: string;
  ordered_date: string | null;
  shipped_date: string | null;
  delivered_date: string | null;
  purchaseconfirmation_date?: string | null;
  cancel_date: string | null;
  return_confirmed_date: string | null;
  return_request_date: string | null;
  return_collected_date: string | null;
  cancel_request_date: string | null;
  refund_date: string | null;
  exchange_request_date: string | null;
  exchange_date: string | null;
  product_material: string | null;
  product_material_eng: string | null;
  cloth_fabric: string | null;
  product_weight: string | null;
  volume_size: string | null;
  volume_size_weight: string | null;
  clearance_category: string | null;
  clearance_category_info: string | null;
  clearance_category_code: string | null;
  hs_code: string;
  one_plus_n_event: string | null;
  origin_place: string;
  origin_place_no: number;
  made_in_code: string;
  origin_place_value: string;
  gift: string;
  item_granting_gift: string | null;
  subscription: string;
  product_bundle_list: BundleItem[] | null;
  market_cancel_request: string | null;
  market_cancel_request_quantity: number | null;
  market_fail_reason: string | null;
  market_fail_reason_guide: string | null;
  market_fail_reason_type?: string | null;
  market_item_no: string | null;
  market_custom_variant_code: string | null;
  option_type: string | null;
  options: OrderItemOption[];
  market_discount_amount: string;
  labels: string[] | null;
  order_status_before_cs: string | null;
  supply_price: string;
  multi_invoice: MultiInvoice[] | null;
  shipping_expected_date: string | null;
}

export interface ListOrderItemsResponse {
  items: OrderItem[];
}

export interface CreateOrderItemsResponse {
  items: OrderItem[];
}

export interface UpdateOrderItemResponse {
  item: {
    shop_no: number;
    order_id: string;
    order_item_code: string;
    claim_type?: string | null;
    claim_status?: string | null;
    claim_reason_type?: string | null;
    claim_reason?: string | null;
    claim_quantity?: number;
    multi_invoice?: MultiInvoice[] | null;
    shipping_expected_date: string | null;
  };
}
