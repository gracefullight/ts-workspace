export interface Cafe24Credit {
  shop_no: number;
  issue_date: string;
  member_id: string;
  group_name: string;
  increase_amount: string;
  decrease_amount: string;
  balance: string;
  admin_id: string;
  admin_name: string;
  reason: string;
  case: string;
  order_id: string;
  [key: string]: unknown;
}

export interface Cafe24CreditListResponse {
  credits: Cafe24Credit[];
  [key: string]: unknown;
}

export interface CreditsReport {
  shop_no: number;
  increase_amount: string;
  decrease_amount: string;
  credits_total: string;
  [key: string]: unknown;
}

export interface CreditsReportResponse {
  report: CreditsReport;
  [key: string]: unknown;
}
