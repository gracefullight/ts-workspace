export interface ReceiverHistory {
  shop_no: number;
  name: string;
  phone: string;
  cellphone: string;
  zipcode: string;
  address1: string;
  address2: string;
  address_state: string;
  address_city: string;
  address_street: string;
  address_full: string;
  name_en: string | null;
  city_en: string | null;
  state_en: string | null;
  street_en: string | null;
  country_code: string;
  country_name: string | null;
  country_name_en: string | null;
  shipping_message: string;
  updated_date: string;
  user_id: string;
  user_name: string;
  shipping_code: string;
}

export interface ListReceiverHistoryResponse {
  history: ReceiverHistory[];
}
