export interface ExchangeRequestItem {
  order_item_code: string;
  quantity: number;
}

export interface ExchangeRequestExchangeItem {
  product_no: number;
  variant_code: string;
  quantity: number;
}

export interface ExchangeRequestPickup {
  name: string;
  phone: string;
  cellphone: string;
  zipcode: string;
  address1: string;
  address2: string;
}

export interface ExchangeRequestCreate {
  order_id: string;
  items: ExchangeRequestItem[];
  exchange_items?: ExchangeRequestExchangeItem[];
  request_pickup?: "T" | "F";
  pickup?: ExchangeRequestPickup | null;
  tracking_no?: string | null;
  shipping_company_name?: string | null;
  reason_type: "A" | "E" | "K" | "J" | "I";
  reason: string;
  refund_bank_name?: string | null;
  refund_bank_code?: string | null;
  refund_bank_account_no?: string | null;
  refund_bank_account_holder?: string | null;
}

export interface ExchangeRequestUpdate {
  order_id: string;
  order_item_code: string[];
  undone: "T";
  reason_type?: "A" | "B" | "J" | "C" | "L" | "D" | "E" | "F" | "K" | "G" | "H" | "I";
  reason?: string | null;
  display_reject_reason?: "T" | "F";
  reject_reason?: string | null;
}

export interface ExchangeRequestResponse {
  shop_no: number;
  order_id: string;
  exchange_request_no?: number;
  items?: ExchangeRequestItem[];
  undone?: "T";
  order_item_code?: string[];
  additional_payment_gateway_cancel?: {
    success: string[] | null;
    fail: string[] | null;
  } | null;
}
