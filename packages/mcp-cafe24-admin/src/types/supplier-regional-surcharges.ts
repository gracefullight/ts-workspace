export interface SupplierRegionalSurcharge extends Record<string, unknown> {
  shop_no: number;
  regional_surcharge_no: number;
  supplier_id: string;
  country_code: string;
  region_name: string;
  surcharge_region_name?: string | null;
  start_zipcode?: string;
  end_zipcode?: string;
  regional_surcharge_amount: string;
  use_regional_surcharge?: "T" | "F";
}

export interface ListSupplierRegionalSurchargesResponse extends Record<string, unknown> {
  regionalsurcharges: SupplierRegionalSurcharge[];
}

export interface SupplierRegionalSurchargeResponse extends Record<string, unknown> {
  regionalsurcharge: SupplierRegionalSurcharge;
}
