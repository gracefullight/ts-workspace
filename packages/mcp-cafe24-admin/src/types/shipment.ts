export type ShipmentStatus = "standby" | "shipping" | "shipped";

export interface ShipmentItem {
  order_item_code: string;
  status: ShipmentStatus | string;
}

export interface Shipment {
  shop_no: number;
  shipping_code: string;
  order_id: string;
  tracking_no: string | null;
  tracking_no_updated_date?: string;
  shipping_company_code: string | null;
  items?: ShipmentItem[];
  carrier_id?: number | null;
  status?: ShipmentStatus | string;
  status_additional_info?: string | null;
  order_item_code?: string[];
}

export interface ListShipmentsResponse {
  shipments: Shipment[];
}

export interface CreateShipmentRequest {
  tracking_no: string;
  shipping_company_code: string;
  status: "standby" | "shipping";
  order_item_code?: string[];
  shipping_code?: string;
  carrier_id?: number;
}

export interface CreateShipmentResponse {
  shipments: Shipment[];
}

export interface UpdateShipmentRequest {
  status?: ShipmentStatus;
  status_additional_info?: string;
  tracking_no?: string | null;
  shipping_company_code?: string | null;
}

export interface UpdateShipmentResponse {
  shipment: Shipment;
}

export interface DeleteShipmentResponse {
  shipment: {
    shop_no: number;
    order_id: string;
    shipping_code: string;
    order_item_code: string[];
  };
}

// Bulk Shipment Create Request (POST /admin/shipments)
export interface BulkCreateShipmentRequest {
  tracking_no: string;
  shipping_company_code: string;
  status: "standby" | "shipping";
  order_id?: string;
  shipping_code?: string;
  order_item_code?: string[];
  carrier_id?: number;
}

export interface BulkCreateShipmentInput {
  shop_no?: number;
  requests: BulkCreateShipmentRequest[];
}

export interface BulkCreateShipmentResponseItem {
  shop_no: number;
  tracking_no: string;
  shipping_company_code: string;
  status: string;
  order_id: string;
  shipping_code: string;
  order_item_code: string[];
  carrier_id: number | null;
  status_additional_info?: string | null;
}

export interface BulkCreateShipmentResponse {
  shipments: BulkCreateShipmentResponseItem[];
}

// Bulk Shipment Update Request (PUT /admin/shipments)
export interface BulkUpdateShipmentRequest {
  shipping_code: string;
  order_id?: string;
  status?: "standby" | "shipping" | "shipped";
  status_additional_info?: string | null;
  tracking_no?: string | null;
  shipping_company_code?: string | null;
}

export interface BulkUpdateShipmentInput {
  shop_no?: number;
  requests: BulkUpdateShipmentRequest[];
}

export interface BulkUpdateShipmentResponseItem {
  shop_no: number;
  shipping_code: string;
  order_id: string;
  status: string;
  status_additional_info: string | null;
  tracking_no: string | null;
  shipping_company_code: string | null;
}

export interface BulkUpdateShipmentResponse {
  shipments: BulkUpdateShipmentResponseItem[];
}
