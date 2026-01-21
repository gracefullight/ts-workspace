export interface Coupon {
  shop_no: number;
  coupon_no: string;
  coupon_type: "O" | "S";
  coupon_name: string;
  coupon_description: string | null;
  created_date: string;
  deleted: "T" | "F";
  is_stopped_issued_coupon: "T" | "F";
  pause_begin_datetime: string | null;
  pause_end_datetime: string | null;
  benefit_text: string;
  benefit_type: "A" | "B" | "C" | "D" | "E" | "I" | "H" | "J" | "F" | "G";
  benefit_price: string | null;
  benefit_percentage: string | null;
  benefit_percentage_round_unit: string | null;
  benefit_percentage_max_price: string | null;
  include_regional_shipping_rate: "T" | "F" | null;
  include_foreign_delivery: "T" | "F" | null;
  coupon_direct_url: string;
  issue_type: "M" | "A" | "D" | "R";
  issue_sub_type: "M" | "C" | "T" | "J" | "D" | "A" | "I" | "P" | "O" | "Q" | "F" | "N" | "U";
  issue_member_join: "T" | "F" | null;
  issue_member_join_recommend: "T" | "F" | null;
  issue_member_join_type: "A" | "O" | "S" | "E" | "N" | null;
  issue_order_amount_type: "O" | "S" | null;
  issue_order_start_date: string | null;
  issue_order_end_date: string | null;
  issue_order_amount_limit: "U" | "L" | "S" | null;
  issue_order_amount_min: string | null;
  issue_order_amount_max: string | null;
  issue_order_path: Record<string, string> | null;
  issue_order_type: "O" | "P" | null;
  issue_order_available_product: "U" | "I" | "E" | null;
  issue_order_available_product_list: number[] | null;
  issue_order_available_category: "U" | "I" | "E" | null;
  issue_order_available_category_list: number[] | null;
  issue_anniversary_type: "B" | "W" | null;
  issue_anniversary_pre_issue_day: number | null;
  issue_module_type: "S" | "B" | "L" | null;
  issue_review_count: number | null;
  issue_review_has_image: "T" | "F" | null;
  issue_quantity_min: number | null;
  issue_quntity_type: "P" | "O" | null;
  issue_max_count: string | null;
  issue_max_count_by_user: string | null;
  issue_count_per_once: number | null;
  issued_count: string;
  issue_member_group_no: number | null;
  issue_member_group_name: string | null;
  issue_no_purchase_period: number | null;
  issue_reserved: "T" | "F";
  issue_reserved_date: string | null;
  available_date: string;
  available_period_type: "F" | "R" | "M";
  available_begin_datetime: string | null;
  available_end_datetime: string | null;
  available_site: string;
  available_scope: "P" | "O";
  available_day_from_issued: number | null;
  available_price_type: "U" | "O" | "P";
  available_order_price_type: "U" | "I" | null;
  available_min_price: string | null;
  available_amount_type: "E" | "I" | null;
  available_payment_method: string | null;
  available_product: "U" | "I" | "E" | null;
  available_product_list: number[] | null;
  available_category: "U" | "I" | "E" | null;
  available_category_list: number[] | null;
  available_coupon_count_by_order: number | null;
  serial_generate_method: "A" | "M" | "E" | null;
  coupon_image_type: "B" | "C" | null;
  coupon_image_path: string | null;
  show_product_detail: "T" | "F" | null;
  use_notification_when_login: "T" | "F" | null;
  send_sms_for_issue: "T" | "F" | null;
  send_email_for_issue: "T" | "F" | null;
  recurring_issuance_interval: string | null;
  recurring_issuance_day: number | null;
  recurring_issuance_hour: string | null;
  recurring_issuance_minute: string | null;
  issue_limit: "T" | "F" | null;
  same_user_reissue: "T" | "F" | null;
  issue_order_date: "T" | "F" | null;
  exclude_unsubscribed: "T" | "F" | null;
}

export interface CouponsResponse {
  coupons: Coupon[];
}

export interface CouponsCountResponse {
  count: number;
}

export interface CouponResponse {
  coupon: Coupon;
}

export interface CouponCreateRequest {
  shop_no?: number;
  request: {
    coupon_name: string;
    benefit_type: string;
    issue_type: string;
    issue_sub_type?: string;
    available_period_type: string;
    available_site: string[];
    available_scope?: string;
    available_product?: string;
    available_product_list?: number[];
    available_category?: string;
    available_category_list?: number[];
    available_amount_type?: string;
    available_coupon_count_by_order: number;
    available_price_type?: string;
    available_order_price_type?: string;
    available_min_price?: string;
    discount_amount?: {
      benefit_price: string;
    };
    discount_rate?: {
      benefit_percentage?: string;
      benefit_percentage_round_unit?: string;
      benefit_percentage_max_price?: string;
    };
    issue_member_join?: string;
    issue_member_join_recommend?: string;
    issue_member_join_type?: string;
    issue_anniversary_type?: string;
    issue_on_anniversary?: string;
    issue_anniversary_pre_issue_day?: number;
    issue_review_count?: number;
    issue_review_has_image?: string;
    issue_limit?: string;
    same_user_reissue?: string;
    issue_reserved?: string;
    issue_reserved_date?: string;
    issue_no_purchase_period?: number;
    show_product_detail?: string;
    include_regional_shipping_rate?: string;
    include_foreign_delivery?: string;
    issue_max_count?: number;
    issue_max_count_by_user?: number;
    issue_order_path?: {
      W?: string;
      M?: string;
      P?: string;
    };
    issue_order_date?: string;
    issue_order_start_date?: string;
    issue_order_end_date?: string;
    issue_member_group_no?: number;
    issue_member_group_name?: string;
    issue_order_amount_type?: string;
    issue_order_amount_limit?: string;
    issue_order_amount_min?: string;
    issue_order_amount_max?: string;
    issue_count_per_once?: number;
    issue_order_type?: string;
    issue_order_available_product?: string;
    issue_order_available_product_list?: number[];
    issue_order_available_category?: string;
    issue_order_available_category_list?: number[];
    issue_quntity_type?: string;
    issue_quantity_min?: number;
    available_payment_method?: string[];
    use_notification_when_login?: string;
    send_sms_for_issue?: string;
    send_email_for_issue?: string;
    exclude_unsubscribed?: string;
    recurring_issuance?: string;
    recurring_issuance_interval?: string;
    recurring_issuance_day?: number;
    recurring_issuance_hour?: string;
    recurring_issuance_minute?: string;
    available_begin_datetime?: string;
    available_end_datetime?: string;
    available_day_from_issued?: number;
  };
}

export interface CouponUpdateRequest {
  shop_no?: number;
  request: {
    status?: "pause" | "restart" | null;
    deleted?: "D" | null;
    immediate_issue_pause?: "I" | null;
    immediate_issue_restart?: "I" | null;
  };
}
