export interface OrderDashboard {
  shop_no: number;
  cancellation_request_count: number;
  cancellation_received_count: number;
  cancellation_processing_count: number;
  exchange_request_count: number;
  exchange_received_count: number;
  exchange_processing_count: number;
  return_request_count: number;
  return_received_count: number;
  return_processing_count: number;
  refund_pending_count: number;
  total_order_amount: string;
  total_paid_amount: string;
  total_refund_amount: string;
  total_order_count: number;
  total_paid_count: number;
  total_refund_count: number;
}

export interface GetOrderDashboardResponse {
  dashboard: OrderDashboard;
}
