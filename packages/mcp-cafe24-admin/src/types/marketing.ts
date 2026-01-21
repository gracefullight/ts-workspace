export interface Promotion {
  promotion_no: number;
  promotion_name: string;
}

export interface SocialNaverShoppingSetting {
  shop_no: number;
  mall_id: string;
  service_status: string;
}

export interface SocialAppleSetting {
  shop_no?: number;
  use_apple_login: string;
  client_id?: string;
  team_id?: string;
  key_id?: string;
  auth_key_file_name?: string;
  use_certification?: string;
}

export interface SmsSetting {
  shop_no?: number;
  use_sms: string;
}

export interface AutomessageArgument {
  shop_no: number;
  name: string;
  description: string;
  sample: string;
  string_length: string;
  send_case: string;
}

export interface AutomessageSetting {
  shop_no?: number;
  use_sms?: string;
  use_kakaoalimtalk?: string;
  use_push?: string;
  send_method?: string;
  send_method_push?: string;
}
