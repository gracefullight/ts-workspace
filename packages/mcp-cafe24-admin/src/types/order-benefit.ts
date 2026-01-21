export interface OrderBenefit {
  shop_no: number;
  order_id: string;
  order_item_code: string;
  benefit_no: number;
  benefit_title: string;
  benefit_name: string;
  benefit_code: number;
  benefit_percent: string | null;
  benefit_value: string;
  benefit_app_key: string | null;
}

export interface ListOrderBenefitsResponse {
  benefits: OrderBenefit[];
}

export interface OrderCoupon {
  shop_no: number;
  order_id: string;
  order_item_code: string;
  coupon_name: string;
  coupon_code: string;
  coupon_percent: string | null;
  coupon_value: string;
  coupon_value_final: string;
}

export interface ListOrderCouponsResponse {
  coupons: OrderCoupon[];
}
