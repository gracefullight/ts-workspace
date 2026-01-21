export interface DiscountInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface PointsInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface MobileDiscountInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface MobilePointsInformation {
  amount_product: string;
  amount_discount: string;
  discount_unit: "P" | "C";
  truncation_unit: string;
  max_discount: string;
}

export interface DiscountLimitInformation {
  discount_limit_type: "A" | "B" | "C";
  discount_amount_limit: string | null;
  number_of_discount_limit: number | null;
}

export interface CustomerGroup {
  shop_no: number;
  group_no: number;
  group_name: string;
  group_description: string;
  group_icon: string;
  benefits_paymethod: "A" | "B" | "C";
  buy_benefits: "F" | "D" | "M" | "P";
  ship_benefits: "T" | "F";
  product_availability: "P" | "M" | "A";
  discount_information: DiscountInformation | null;
  points_information: PointsInformation | null;
  mobile_discount_information: MobileDiscountInformation | null;
  mobile_points_information: MobilePointsInformation | null;
  discount_limit_information: DiscountLimitInformation | null;
}

export interface CustomerGroupsResponse {
  customergroups: CustomerGroup[];
}

export interface CustomerGroupsSearchParams {
  shop_no?: number;
  group_no?: string;
  group_name?: string;
}

export interface CustomerGroupParams {
  shop_no?: number;
  group_no: number;
}

export interface CustomerGroupsCountParams {
  shop_no?: number;
  group_no?: string;
  group_name?: string;
}

export interface MoveCustomerToGroupRequest {
  member_id: string;
  fixed_group?: "T" | "F";
}

export interface MoveCustomerToGroupParams {
  shop_no?: number;
  group_no: number;
  requests: MoveCustomerToGroupRequest[];
}

export interface CustomerGroupSetting {
  shop_no: number;
  auto_update: "T" | "F";
  use_auto_update: "T" | "F";
  customer_tier_criteria:
    | "purchase_amount"
    | "purchase_count"
    | "purchase_amount_and_purchase_count"
    | "purchase_amount_or_count"
    | "shopping_index";
  standard_purchase_amount: "total_order_amount" | "total_paid_amount" | "credit_price";
  offline_purchase_amount: "T" | "F" | null;
  standard_purchase_count: "order_count" | "product_count";
  offline_purchase_count: "T" | "F" | null;
  auto_update_criteria: "delivery_complete" | "payment_complete";
  deduct_cancellation_refund: "T" | "F";
  interval_auto_update: "1d" | "3d" | "1w" | "1m" | "3m" | "6m" | "12m";
  total_period: "now" | "1m" | "3m" | "6m" | "12m";
  interval_week: number | null;
  interval_month: number | null;
  auto_update_set_date: string;
  use_discount_limit: "T" | "F";
  discount_limit_reset_period: "1d" | "3d" | "1w" | "1m";
  discount_limit_reset_week: number | null;
  discount_limit_reset_date: number | null;
  discount_limit_begin_date: string;
  discount_limit_end_date: string;
}

export type CustomerGroupSettingResponse = {
  customergroup: CustomerGroupSetting;
};

export interface CommonParams {
  shop_no?: number;
}
