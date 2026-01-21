export interface ReturnItem {
  shop_no?: number;
  item_no?: number;
  order_item_code: string;
  variant_code?: string;
  product_no?: number;
  product_code?: string;
  product_name?: string;
  product_price?: string;
  option_price?: string;
  quantity?: number;
  claim_code?: string;
  claim_reason_type?: string;
  claim_reason?: string;
  refund_bank_name?: string;
  refund_bank_account_no?: string;
  refund_bank_account_holder?: string;
  status_code?: string;
  status_text?: string;
  shipping_company_name?: string;
  tracking_no?: string;
  [key: string]: any; // Allow for other fields present in the extensive JSON
}

export interface ReturnAddress {
  zipcode: string;
  address1: string;
  address2: string;
  items: string[];
}

export interface ReturnPickup {
  use_pickup?: string;
  same_address?: string | null;
  name: string | null;
  phone: string | null;
  cellphone: string | null;
  zipcode: string | null;
  address: string | null;
  address1?: string | null;
  address2?: string | null;
}

export interface ReturnRefundAmount {
  payment_method: string;
  amount: string;
}

export interface ReturnFeeDetail {
  group_no: number;
  return_shipping_fee: string;
  items: string[];
}

export interface ReturnDetail {
  shop_no: number;
  order_id: string;
  claim_code: string;
  claim_reason_type: string;
  claim_reason: string;
  claim_due_date: string;
  return_address?: ReturnAddress;
  pickup?: ReturnPickup;
  return_invoice_no?: string;
  return_shipping_company_name?: string;
  pickup_request_state?: string;
  refund_methods?: string[];
  refund_reason?: string;
  order_price_amount?: string;
  refund_amounts?: ReturnRefundAmount[];
  shipping_fee?: string;
  refund_shipping_fee?: string;
  refund_regional_surcharge?: string;
  return_ship_type?: string;
  return_shipping_fee?: string;
  return_shipping_fee_detail?: ReturnFeeDetail[];
  return_regional_surcharge?: string;
  return_regional_surcharge_detail?: ReturnFeeDetail[];
  additional_shipping_fee?: string;
  international_shipping_insurance?: string;
  international_shipping_additional_fee?: string;
  defer_commission?: string;
  partner_discount_amount?: string;
  add_discount_amount?: string;
  member_grade_discount_amount?: string;
  shipping_discount_amount?: string;
  coupon_discount_amount?: string;
  point_used?: string;
  credit_used?: string;
  undone?: string;
  undone_reason_type?: string | null;
  undone_reason?: string | null;
  expose_order_detail?: string | null;
  exposed_undone_reason?: string | null;
  items: ReturnItem[];
  include_tax?: string;
  tax?: any[];
  carrier_id?: string | null;
  return_invoice_success?: string | null;
  return_invoice_fail_reason?: string | null;
  cancel_fee_amount?: string | null;
}

export interface CreateReturnRequestItem {
  order_item_code: string;
  quantity: number;
}

export interface CreateReturnRequest {
  order_id: string;
  status: "accepted" | "processing" | "returned";
  reason?: string;
  claim_reason_type?: "A" | "B" | "C" | "L" | "D" | "E" | "F" | "G" | "H" | "I";
  add_memo_too?: "T" | "F";
  recover_coupon?: "T" | "F";
  recover_coupon_no?: (string | number)[];
  recover_inventory?: "T" | "F";
  refund_method_code?: string[];
  refund_bank_code?: string;
  refund_bank_account_no?: string;
  refund_bank_account_holder?: string;
  pickup_completed?: "T" | "F";
  items: CreateReturnRequestItem[];
  request_pickup?: "T" | "F";
  pickup?: ReturnPickup;
  return_invoice_no?: string;
  return_shipping_company_name?: string;
}

export interface UpdateReturnRequestItem {
  order_item_code: string;
}

export interface UpdateReturnRequest {
  order_id: string;
  claim_code: string;
  status?: "processing" | "returned";
  pickup_completed?: "T" | "F";
  carrier_id?: number | null;
  return_invoice_no?: string | null;
  return_shipping_company_name?: string | null;
  return_invoice_success?: "T" | "F" | "N" | null;
  return_invoice_fail_reason?: string | null;
  items?: UpdateReturnRequestItem[];
  refund_method_code?: string[];
  refund_bank_code?: string;
  refund_bank_account_no?: string;
  refund_bank_account_holder?: string;
  recover_inventory?: "T" | "F";
  request_pickup?: "T" | "F" | null;
  pickup?: ReturnPickup | null;
  undone?: "T" | null;
  add_memo_too?: "T" | "F" | null;
  undone_reason_type?: string | null;
  undone_reason?: string | null;
  expose_order_detail?: "T" | "F" | null;
  exposed_undone_reason?: string | null;
  recover_coupon?: "T" | "F";
  recover_coupon_no?: (string | number)[];
  refund_bank_name?: string | null;
}

export interface CreateReturnInput {
  shop_no?: number;
  requests: CreateReturnRequest[];
}

export interface UpdateReturnInput {
  shop_no?: number;
  requests: UpdateReturnRequest[];
}

export interface ReturnResponse {
  return: ReturnDetail | ReturnDetail[];
}
