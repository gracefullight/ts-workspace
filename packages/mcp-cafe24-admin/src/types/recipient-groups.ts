import type { Cafe24Enum, Cafe24PagingLinks } from "@/types/common.js";

export interface RecipientGroup {
  shop_no: number;
  group_no: number;
  group_name: string;
  group_description?: string;
  created_date: string;
  group_member_count: number;
  news_mail: "T" | "F" | "D";
  sms: Cafe24Enum;
  member_group_no?: number;
  member_class?: string;
  member_type?: string;
  join_path?: string;
  inflow_path?: string;
  inflow_path_detail?: string;
  date_type?: string;
  start_date?: string;
  end_date?: string;
  solar_calendar?: string | null;
  age_min?: number;
  age_max?: number;
  gender?: "M" | "F" | "";
  available_points_min?: string;
  available_points_max?: string;
  use_mobile_app?: Cafe24Enum;
  plusapp_member_join?: Cafe24Enum;
  [key: string]: unknown;
}

export interface RecipientGroupListResponse {
  recipientgroups: RecipientGroup[];
  links?: Cafe24PagingLinks[];
  [key: string]: unknown;
}

export interface RecipientGroupResponse {
  recipientgroup: RecipientGroup;
  [key: string]: unknown;
}
