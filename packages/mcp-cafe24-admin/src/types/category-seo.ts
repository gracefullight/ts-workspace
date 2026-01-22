import type { CategoryBoolean } from "@/types/categories.js";

export interface CategorySeo {
  shop_no: number;
  category_no: number;
  search_engine_exposure: CategoryBoolean;
  meta_title: string | null;
  meta_author: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

export interface CategorySeoResponse {
  seo: CategorySeo;
}
