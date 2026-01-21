export interface OrderItemLabels {
  shop_no: number;
  names: string[];
  order_id?: string;
  order_item_code?: string;
}

export interface OrderItemLabelDetail {
  shop_no: number;
  order_id: string;
  order_item_code: string;
  name: string;
}

export interface OrderItemLabelsResponse {
  labels: OrderItemLabels;
}

export interface OrderItemLabelResponse {
  label: OrderItemLabels;
}

export interface OrderItemLabelDeleteResponse {
  label: OrderItemLabelDetail;
}
