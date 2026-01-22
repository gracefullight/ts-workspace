export interface CategoryDecorationImage {
  shop_no: number;
  category_no: number;
  use_menu_image_pc: string;
  menu_image_pc?: string | null;
  menu_over_image_pc?: string | null;
  use_top_image_pc: string;
  top_images_pc?: string[] | null;
  use_title_image_pc: string;
  title_image_pc?: string | null;
  use_menu_image_mobile: string;
  menu_image_mobile?: string | null;
  use_top_image_mobile: string;
  top_images_mobile?: string[] | null;
  use_title_image_mobile: string;
  title_image_mobile?: string | null;
}

export interface CategoryDecorationImageResponse {
  decorationimage: CategoryDecorationImage;
}
