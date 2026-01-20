export interface CashReceipt {
  cashreceipt_no: number;
  approval_no: string;
  request_date: string;
  order_id: string;
  member_id: string;
  name: string;
  order_price_amount: string;
  vat: string;
  subtotal: string;
  order_status: string;
  status: string;
  pg_name: string;
  cash_bill_no: string;
  partner_id: string;
  type?: string;
  company_registration_no?: string | null;
  cellphone?: string;
  tax_amount?: string;
  tax_free_amount?: string;
  supply_price?: string;
}
