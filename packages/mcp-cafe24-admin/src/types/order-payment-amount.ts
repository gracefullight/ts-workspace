export interface PaymentAmountItemInfo {
  product_price: string;
  option_price: string;
  quantity: number;
}

export interface DiscountAmountInfo {
  membership_discount_amount: string;
  coupon_discount_price: string;
  app_discount_amount: string;
}

export interface ItemDiscountAmountInfo {
  additional_discount_price: string;
  coupon_discount_price: string;
  app_discount_amount: string;
}

export interface OrderPaymentAmount {
  shop_no: number;
  order_item_code: string;
  items: PaymentAmountItemInfo;
  order_price_amount: string;
  order_discount_amount: DiscountAmountInfo;
  item_discount_amount: ItemDiscountAmountInfo;
  additional_payment_amount: string;
  payment_amount: string;
  cancel_fee_amount: string | null;
}

export interface GetOrderPaymentAmountResponse {
  paymentamount: OrderPaymentAmount[];
}
