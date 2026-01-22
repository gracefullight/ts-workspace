export interface Brand extends Record<string, unknown> {
  shop_no: number;
  brand_code: string;
  brand_name: string;
  use_brand: "T" | "F";
  search_keyword?: string;
  product_count?: number;
  created_date: string;
}

export interface BrandResponse {
  brand: Brand;
}

export interface BrandsResponse {
  brands: Brand[];
}

export interface BrandCountResponse {
  count: number;
}
