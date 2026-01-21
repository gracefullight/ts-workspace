export interface OrderMemoProduct {
  product_no: number;
  option_code: string;
}

export type OrderMemoAttachType = "O" | "P";
export type OrderMemoBoolean = "T" | "F";
export type OrderMemoTopicType = "cs_01" | "cs_02" | "cs_03" | "cs_04" | "cs_05" | null;
export type OrderMemoStatus = "F" | "T" | null;

export interface OrderMemo {
  process_status: string;
  shop_no: number;
  memo_no: number;
  order_id: string;
  created_date?: string;
  author_id?: string;
  ip?: string;
  use_customer_inquiry: OrderMemoBoolean;
  attach_type: OrderMemoAttachType;
  content: string;
  starred_memo: OrderMemoBoolean;
  fixed: OrderMemoBoolean;
  product_list?: OrderMemoProduct[];
  topic_type?: OrderMemoTopicType;
  status?: OrderMemoStatus;
}

export interface ListOrderMemosResponse {
  memos: OrderMemo[];
}

export interface CreateOrderMemoRequest {
  use_customer_inquiry?: OrderMemoBoolean;
  topic_type?: OrderMemoTopicType;
  status?: OrderMemoStatus;
  attach_type?: OrderMemoAttachType;
  content: string;
  starred_memo?: OrderMemoBoolean;
  fixed?: OrderMemoBoolean;
  product_list?: OrderMemoProduct[];
}

export interface CreateOrderMemoResponse {
  memo: OrderMemo;
}

export interface UpdateOrderMemoRequest {
  use_customer_inquiry?: OrderMemoBoolean;
  topic_type?: OrderMemoTopicType;
  status?: OrderMemoStatus;
  attach_type?: OrderMemoAttachType;
  content?: string;
  starred_memo?: OrderMemoBoolean;
  fixed?: OrderMemoBoolean;
  product_list?: OrderMemoProduct[];
}

export interface UpdateOrderMemoResponse {
  memo: OrderMemo;
}

export interface DeleteOrderMemoResponse {
  memo: {
    shop_no: number;
    memo_no: number;
  };
}
