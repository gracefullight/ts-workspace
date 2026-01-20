export interface OrderformProperty {
  orderform_property_id: number;
  input_type: "T" | "M" | "R" | "C" | "S" | "D" | "I";
  is_required: "T" | "F";
  subject: string;
  description: string | null;
  field_length: number | null;
  max_input_length: number | null;
  textarea_rows: number | null;
  width_percentage: number | null;
  option_values: string | null;
  display_lines_desktop: number | null;
  display_lines_mobile: number | null;
  available_product_type: "A" | "C" | "P";
  input_scope: "A" | "P";
  category_no: number | null;
  product_no: string | null;
}

export interface ListOrderformPropertiesResponse {
  properties: {
    shop_no: number;
    additional_items: OrderformProperty[];
  };
}

export interface CreateOrderformPropertyRequest {
  input_type: "T" | "M" | "R" | "C" | "S" | "D" | "I";
  is_required: "T" | "F";
  subject: string;
  available_product_type: "A" | "C" | "P";
  input_scope: "A" | "P";
  description?: string | null;
  field_length?: number | null;
  max_input_length?: number | null;
  textarea_rows?: number | null;
  width_percentage?: number | null;
  option_values?: string | null;
  display_lines_desktop?: number | null;
  display_lines_mobile?: number | null;
  category_no?: number | null;
  product_no?: string | null;
}

export interface CreateOrderformPropertiesResponse {
  properties: Array<OrderformProperty & { shop_no: number }>;
}

export interface UpdateOrderformPropertyRequest {
  input_type?: "T" | "M" | "R" | "C" | "S" | "D" | "I";
  is_required?: "T" | "F";
  subject?: string;
  description?: string | null;
  field_length?: number | null;
  max_input_length?: number | null;
  textarea_rows?: number | null;
  width_percentage?: number | null;
  option_values?: string | null;
  display_lines_desktop?: number | null;
  display_lines_mobile?: number | null;
  available_product_type?: "A" | "C" | "P";
  input_scope?: "A" | "P";
  category_no?: number | null;
  product_no?: string | null;
}

export interface UpdateOrderformPropertyResponse {
  properties: OrderformProperty & { shop_no: number };
}

export interface DeleteOrderformPropertyResponse {
  properties: {
    shop_no: number;
    orderform_property_id: number;
  };
}
