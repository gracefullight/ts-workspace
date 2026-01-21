export type RefundStatus = "T" | "F" | "M" | "complete";

export interface Cafe24Refund {
  shop_no: number;
  member_id: string;
  member_email?: string;
  buyer_email?: string;
  order_date?: string;
  accepted_refund_date?: string;
  refund_date?: string;
  order_id: string;
  refund_code: string;
  order_item_code?: string[];
  quantity?: number;
  actual_refund_amount?: string;
  used_points?: string;
  used_credits?: string;
  currency?: string;
  payment_methods?: string[];
  refund_payment_methods?: string[];
  payment_gateway_cancel_statuses?: {
    payment_method: string;
    cancel_status: string;
  }[];
  payment_gateway_cancel_dates?: {
    payment_method: string;
    cancel_date: string;
  }[];
  status: string;
  refund_methods?: string[];
  refund_bank_name?: string;
  refund_bank_account_no?: string;
  refund_bank_account_holder?: string;
  include_tax?: "T" | "F";
  tax?: {
    name: string;
    amount: string;
  }[];
  cancel_fee_amount?: string | null;
  refund_point?: string;
  refund_credit?: string;
  refund_naver_point?: string;
  refund_naver_cash?: string;
  refund_amount?: string;
  product_price?: string;
  shipping_fee?: string;
  refund_shipping_fee?: string;
  refund_regional_surcharge?: string;
  return_shipping_fee?: string;
  return_regional_surcharge?: string;
  additional_shipping_fee?: string;
  international_shipping_insurance?: string;
  international_shipping_additional_fee?: string;
  shipping_fee_discount_amount?: string;
  cod_fees?: string;
  product_discount_amount?: string;
  member_group_discount_amount?: string;
  app_item_discount_amount?: string;
  app_discount_amount?: string;
  coupon_discount_amount?: string;
  product_bundle_discount_amount?: string;
  points_spent_amount?: string;
  credits_spent_amount?: string;
  naver_point?: string;
  naver_cash?: string;
  additional_product_amount?: string;
  manually_input_amount?: string;
  changed_refund_amount?: string;
  refund_manager?: string;
  refund_reason?: string;
  send_sms?: "T" | "F";
  send_mail?: "T" | "F";
}

export interface RefundsResponse {
  refunds: Cafe24Refund[];
}

export interface RefundDetailResponse {
  refund: Cafe24Refund;
}

export interface Refund {
  shop_no: number;
  refund_code: string;
  status: RefundStatus;
  reason?: string;
}

export interface UpdateOrderRefundRequest {
  status: RefundStatus;
  reason?: string;
  send_sms?: "T" | "F";
  send_mail?: "T" | "F";
  payment_gateway_cancel?: "T" | "F";
}

export interface UpdateOrderRefundResponse {
  refund: Refund;
}
