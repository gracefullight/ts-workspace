export type AppstorePaymentStatus = "paid" | "refund";
export type AppstorePaymentCurrency = "KRW" | "USD" | "JPY" | "PHP";
export type AppstorePaymentAutomatic = "T" | "F";

export interface AppstorePayment {
  order_id: string;
  payment_status: AppstorePaymentStatus;
  title: string;
  approval_no: string;
  payment_gateway_name: string;
  payment_method: string;
  payment_amount: string;
  refund_amount: string;
  currency: AppstorePaymentCurrency;
  locale_code: string;
  automatic_payment: AppstorePaymentAutomatic;
  pay_date: string;
  refund_date: string | null;
  expiration_date: string | null;
}

export interface AppstorePaymentsListResponse {
  payments: AppstorePayment[];
}

export interface AppstorePaymentsCountResponse {
  count: number;
}
