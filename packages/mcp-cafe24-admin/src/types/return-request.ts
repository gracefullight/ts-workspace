export interface ReturnRequestItem {
  order_item_code: string;
  quantity: number;
}

export interface ReturnRequestPickup {
  name: string;
  phone: string;
  cellphone: string;
  zipcode: string;
  address1: string;
  address2: string;
}

export interface ReturnRequestCreateRequest {
  order_id: string;
  items: ReturnRequestItem[];
  request_pickup: "T" | "F";
  pickup?: ReturnRequestPickup | null;
  tracking_no?: string | null;
  shipping_company_name?: string | null;
  reason_type?: "A" | "E" | "K" | "J" | "I"; // A: Change of mind, E: Unsatisfactory product, K: Defective product, J: Shipping error, I: Others
  reason?: string;
  refund_bank_name?: string | null;
  refund_bank_code?: string | null;
  refund_bank_account_no?: string | null;
  refund_bank_account_holder?: string | null;
}

export interface ReturnRequestCreatePayload {
  shop_no?: number;
  requests: ReturnRequestCreateRequest[];
}

export interface ReturnRequestResponseItem {
  shop_no: number;
  order_id: string;
  items: ReturnRequestItem[];
}

export interface ReturnRequestCreateResponse {
  returnrequests: ReturnRequestResponseItem[];
}

export interface ReturnRequestUpdateRequest {
  order_id: string;
  undone: "T";
  reason_type?: "A" | "B" | "J" | "C" | "L" | "D" | "E" | "F" | "K" | "G" | "H" | "I";
  reason?: string | null;
  display_reject_reason?: "T" | "F";
  reject_reason?: string | null;
  order_item_code: string[];
}

export interface ReturnRequestUpdatePayload {
  shop_no?: number;
  requests: ReturnRequestUpdateRequest[];
}

export interface ReturnRequestUpdateResponseItem {
  shop_no: number;
  order_id: string;
  undone: string;
  order_item_code: string[];
  additional_payment_gateway_cancel?: {
    success: string[];
    fail: string[] | null;
  };
}

export interface ReturnRequestUpdateResponse {
  returnrequests: ReturnRequestUpdateResponseItem[];
}
