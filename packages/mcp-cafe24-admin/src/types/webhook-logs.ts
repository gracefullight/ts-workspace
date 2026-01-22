export type WebhookLogType = "G" | "R" | "T";
export type WebhookLogSuccess = "T" | "F";

export interface WebhookLog {
  log_id: string;
  log_type: WebhookLogType;
  event_no: number;
  mall_id: string;
  trace_id: string;
  requested_time: string;
  request_endpoint: string;
  request_body: string | null;
  success: WebhookLogSuccess;
  response_http_code: number | null;
  response_body: string | null;
}

export interface WebhookLogsResponse {
  logs: WebhookLog[];
}
