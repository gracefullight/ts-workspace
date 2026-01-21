export interface ShippingFeeCancellation {
  shop_no: number;
  order_id: string;
  claim_code: string;
  claim_reason_type: string;
  claim_reason: string;
  status: "canceled" | "canceling";
  default_shipping_fee: string;
  supplier_shipping_fee: string;
  individual_shipping_fee: string;
  international_shipping_fee: string;
  international_shipping_insurance_fee: string;
  additional_shipping_fee: string;
  additional_handling_fee: string;
  regional_surcharge_amount: string;
  refund_method: string;
  shipping_discount_amount: string;
  coupon_discount_amount: string;
  refund_amount: string;
  point_used: string;
  credit_used: string;
  mixed_refund_amount: string;
  mixed_refund_methods: string[] | null;
  include_tax: "T" | "F";
  tax:
    | {
        name: string;
        amount: string;
      }[]
    | null;
}

export interface ListShippingFeeCancellationsResponse {
  shippingfeecancellation: ShippingFeeCancellation[];
}

export interface CreateShippingFeeCancellationResponse {
  shippingfeecancellation: {
    shop_no: number;
    order_id: string;
    claim_code: string;
  };
}
