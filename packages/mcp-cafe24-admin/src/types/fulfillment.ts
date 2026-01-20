export interface FulfillmentRequest {
  tracking_no: string;
  shipping_company_code: string;
  status: "standby" | "shipping";
  order_id?: string;
  shipping_code?: string;
  order_item_code?: string[];
  carrier_id?: number;
  post_express_flag?: "S";
}

export interface Fulfillment {
  shop_no: number;
  tracking_no: string;
  shipping_company_code: string;
  status: "standby" | "shipping";
  order_id: string;
  shipping_code: string;
  order_item_code: string[];
  carrier_id: number;
  post_express_flag: string | null;
}

export interface FulfillmentResponse {
  fulfillments: Fulfillment[];
}
