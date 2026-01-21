export interface OrderPayment {
  shop_no: number;
  order_id: string;
  change_payment_amount: string;
  change_payment_method: string;
  payment_method: string;
  payment_gateway_failure_message: string | null;
  admin_additional_amount: string | null;
  commission: string | null;
  initial_estimated_payment_amount: string;
  change_payment_amount_reason: string | null;
}

export interface UpdateOrderPaymentResponse {
  payment: OrderPayment;
}

export interface UpdateOrderPaymentRequest {
  shop_no?: number;
  request: {
    change_payment_amount: "T" | "F";
    change_payment_method: "T" | "F";
    admin_additional_amount?: string;
    change_payment_amount_reason?: string;
    payment_method?: string;
    billing_name?: string;
    bank_account_id?: number;
    commission?: string;
  };
}

export interface PaymentMethodDetail {
  code: number;
  name: string;
  amount: string;
}

export interface OrderAmountDetail {
  code: number;
  name: string;
  order_item_code: string | null;
  supplier_code: string;
  unit_price: string;
  quantity: number;
  amount: string;
}

export interface OrderPaymentTimeline {
  shop_no: number;
  payment_no: number;
  payment_settle_type: string;
  payment_methods: string[];
  order_amount: string;
  additional_payment_amount: string;
  paid_amount: string;
  payment_datetime: string;
  created_datetime: string;
  claim_code: string | null;
  payment_method_detail?: PaymentMethodDetail[];
  order_amount_detail?: OrderAmountDetail[];
}

export interface ListOrderPaymentTimelineResponse {
  paymenttimeline: OrderPaymentTimeline[];
}

export interface OrderPaymentTimelineDetailResponse {
  paymenttimeline: OrderPaymentTimeline;
}

export interface UpdatePaymentStatusRequest {
  order_id: string;
  status: "paid" | "unpaid" | "canceled";
  payment_no?: number;
  auto_paid?: "T" | "F";
  recover_inventory?: "T" | "F";
  cancel_request?: {
    refund_status?: "P" | "F";
    partial_cancel?: "T" | "F";
    payment_gateway_name?: string;
    payment_method?: string;
    response_code?: string;
    response_message?: string;
  };
}

export interface UpdatePaymentsResponse {
  payments: {
    shop_no: number;
    order_id: string;
    status: string;
    payment_no: number;
    cancel_request?: {
      refund_status: string;
      partial_cancel: string;
      payment_gateway_name: string | null;
      payment_method: string | null;
      response_code: string | null;
      response_message: string | null;
    };
  }[];
}
