export interface LabelsListResponse {
  labels: {
    shop_no: number;
    names: string[];
  };
  links?: Array<{
    rel: string;
    href: string;
  }>;
}

export interface LabelRequest {
  name: string;
  order_item_code: string[];
}

export interface Label {
  shop_no: number;
  name: string;
  order_item_code: string[];
}

export interface LabelsCreateResponse {
  labels: Label[];
}
