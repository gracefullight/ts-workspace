export interface SMSRequest {
  shop_no?: number;
  request: {
    sender_no: number;
    content: string;
    recipients?: string[];
    member_id?: string[];
    group_no?: number;
    exclude_unsubscriber?: "T" | "F";
    type?: "SMS" | "LMS";
    title?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface SMSSendResponse {
  sms: {
    queue_code: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
