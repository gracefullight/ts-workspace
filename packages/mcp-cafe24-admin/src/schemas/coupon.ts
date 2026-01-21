import { z } from "zod";

export const CouponsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop Number (Default: 1)"),
    coupon_no: z.string().optional().describe("Coupon number"),
    coupon_type: z.enum(["O", "S"]).optional().describe("Coupon type (O: Online, S: Offline)"),
    coupon_name: z.string().optional().describe("Coupon name"),
    benefit_type: z
      .string()
      .optional()
      .describe("Benefit type (A, B, C, D, E, I, H, J, F, G). Multiple allowed with comma"),
    issue_type: z
      .string()
      .optional()
      .describe("Issue type (M, A, D, R). Multiple allowed with comma"),
    issue_sub_type: z
      .string()
      .optional()
      .describe(
        "Detailed issue type (M, C, T, J, D, A, I, P, O, Q, F, N, U). Multiple allowed with comma",
      ),
    issued_flag: z
      .enum(["T", "F"])
      .optional()
      .describe("Issued flag (T: has been issued, F: has not)"),
    created_start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
    deleted: z
      .string()
      .optional()
      .describe("Whether coupon is deleted (T, F). Multiple allowed with comma"),
    pause_begin_date: z.string().optional().describe("Coupon pause start date"),
    pause_end_date: z.string().optional().describe("Coupon pause end date"),
    issue_order_path: z
      .enum(["W", "M", "P"])
      .optional()
      .describe("Available order path (W: PC, M: Mobile, P: Plus App)"),
    issue_order_type: z.enum(["P", "O"]).optional().describe("Issue unit (P: Product, O: Order)"),
    issue_reserved: z.enum(["T", "F"]).optional().describe("Issue reservation"),
    available_period_type: z
      .string()
      .optional()
      .describe(
        "Available date type (F: General, R: Based on issuance, M: End of month). Multiple allowed with comma",
      ),
    available_datetime: z
      .string()
      .optional()
      .describe("Available datetime when available_period_type is F"),
    available_site: z.enum(["W", "M", "P"]).optional().describe("Available Site (W, M, P)"),
    available_scope: z
      .enum(["P", "O"])
      .optional()
      .describe("Available scope (P: Product, O: Order)"),
    available_price_type: z
      .enum(["U", "O", "P"])
      .optional()
      .describe("Criteria of coupon available price amount"),
    available_order_price_type: z
      .enum(["U", "I"])
      .optional()
      .describe("Minimum purchase amount basis"),
    limit: z.number().int().min(1).max(500).default(100).describe("Maximum results (1-500)"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location"),
  })
  .strict();

export const CouponsCountParamsSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop Number (Default: 1)"),
    coupon_no: z.string().optional().describe("Coupon number"),
    coupon_type: z.enum(["O", "S"]).optional().describe("Coupon type (O: Online, S: Offline)"),
    coupon_name: z.string().optional().describe("Coupon name"),
    benefit_type: z.string().optional().describe("Benefit type"),
    issue_type: z.string().optional().describe("Issue type"),
    issue_sub_type: z.string().optional().describe("Detailed issue type"),
    issued_flag: z.enum(["T", "F"]).optional().describe("Issued flag"),
    created_start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
    deleted: z.string().optional().describe("Whether coupon is deleted"),
    pause_begin_date: z.string().optional().describe("Coupon pause start date"),
    pause_end_date: z.string().optional().describe("Coupon pause end date"),
    issue_order_path: z.enum(["W", "M", "P"]).optional().describe("Available order path"),
    issue_order_type: z.enum(["P", "O"]).optional().describe("Issue unit"),
    issue_reserved: z.enum(["T", "F"]).optional().describe("Issue reservation"),
    available_period_type: z.string().optional().describe("Available date type"),
    available_datetime: z.string().optional().describe("Available datetime"),
    available_site: z.enum(["W", "M", "P"]).optional().describe("Available Site"),
    available_scope: z.enum(["P", "O"]).optional().describe("Available scope"),
    available_price_type: z.enum(["U", "O", "P"]).optional().describe("Available price type"),
    available_order_price_type: z
      .enum(["U", "I"])
      .optional()
      .describe("Minimum purchase amount basis"),
  })
  .strict();

export const CouponDetailParamsSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop Number (Default: 1)"),
    coupon_no: z.string().describe("Coupon number"),
  })
  .strict();

export const CouponCreateSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop Number (Default: 1)"),
    request: z
      .object({
        coupon_name: z.string().min(1).max(50).describe("Coupon name"),
        benefit_type: z
          .enum(["A", "B", "C", "D", "E", "I", "H", "J", "F"])
          .describe("Benefit type"),
        issue_type: z.enum(["M", "A", "D", "R"]).describe("Issue type"),
        issue_sub_type: z
          .enum(["J", "D", "A", "P", "O", "F", "Q", "M", "N", "T"])
          .optional()
          .describe("Detailed issue type"),
        available_period_type: z.enum(["F", "R", "M"]).describe("Available date type"),
        available_site: z.array(z.string()).describe("Available Site (W, M, P)"),
        available_scope: z.enum(["P", "O"]).default("O").describe("Available scope (P, O)"),
        available_product: z.enum(["U", "I", "E"]).default("U").describe("Applicable product"),
        available_category: z.enum(["U", "I", "E"]).default("U").describe("Applicable category"),
        available_amount_type: z
          .enum(["E", "I"])
          .default("E")
          .describe("Available Amount Type (E: Before discount, I: After)"),
        available_coupon_count_by_order: z
          .number()
          .min(1)
          .max(999)
          .describe("Max number per order"),
        available_begin_datetime: z
          .string()
          .optional()
          .describe("Available start date (Required if type is F)"),
        available_end_datetime: z
          .string()
          .optional()
          .describe("Available end date (Required if type is F)"),
        available_day_from_issued: z
          .number()
          .min(1)
          .max(999)
          .optional()
          .describe("Available days (Required if type is R)"),
        issue_member_join: z.enum(["T", "F"]).optional().describe("Welcome flag"),
        issue_member_join_recommend: z.enum(["T", "F"]).optional().describe("Recommended id"),
        issue_member_join_type: z
          .enum(["A", "O", "S", "E", "N"])
          .optional()
          .describe("Welcome customer flag"),
        issue_anniversary_type: z.enum(["B", "W"]).optional().describe("Issue Anniversary Type"),
        issue_on_anniversary: z.enum(["S", "P"]).optional().describe("Same-day issuance"),
        issue_anniversary_pre_issue_day: z
          .number()
          .min(0)
          .max(365)
          .optional()
          .describe("Preissuance dates"),
        issue_review_count: z.number().min(1).optional().describe("Number of product reviews"),
        issue_review_has_image: z
          .enum(["T", "F"])
          .optional()
          .describe("Include product review images"),
        issue_limit: z.enum(["T", "F"]).optional().describe("Issuance limit options"),
        same_user_reissue: z.enum(["T", "F"]).optional().describe("Coupon Reissue Availability"),
        issue_reserved: z.enum(["T", "F"]).default("F").describe("Issue reservation"),
        issue_reserved_date: z.string().optional().describe("Reservation time"),
        issue_no_purchase_period: z
          .number()
          .min(1)
          .max(12)
          .optional()
          .describe("Non-purchase condition period (1-12)"),
        show_product_detail: z.enum(["T", "F"]).optional().describe("Expose product details page"),
        include_regional_shipping_rate: z
          .enum(["T", "F"])
          .optional()
          .describe("Regional shipping flag"),
        include_foreign_delivery: z.enum(["T", "F"]).optional().describe("Shipping abroad flag"),
        available_product_list: z
          .array(z.number())
          .optional()
          .describe("List of coupon-applied products"),
        available_category_list: z
          .array(z.number())
          .optional()
          .describe("List of coupon-applied categories"),
        available_price_type: z.enum(["U", "O", "P"]).default("U").describe("Available price type"),
        available_order_price_type: z
          .enum(["U", "I"])
          .optional()
          .describe("Minimum purchase amount basis"),
        available_min_price: z.string().optional().describe("Available price"),
        issue_max_count: z.number().min(1).max(999).optional().describe("Maximum Issue Count"),
        issue_max_count_by_user: z
          .number()
          .min(0)
          .max(999)
          .optional()
          .describe("Maximum reissue quantity per person"),
        issue_order_path: z.any().optional().describe("Available order path"),
        issue_order_date: z
          .enum(["T", "F"])
          .optional()
          .describe("Issue for orders placed during period"),
        issue_order_start_date: z.string().optional().describe("Order start date"),
        issue_order_end_date: z.string().optional().describe("Order end date"),
        issue_member_group_no: z.number().optional().describe("Issue Member Group Number"),
        issue_member_group_name: z.string().optional().describe("Issue Member Group Name"),
        discount_amount: z
          .object({
            benefit_price: z.string(),
          })
          .optional()
          .describe("Discount amount"),
        discount_rate: z.any().optional().describe("Discount rate"),
        issue_order_amount_type: z.enum(["O", "S"]).optional().describe("Discount standard amount"),
        issue_order_amount_limit: z
          .enum(["U", "L", "S"])
          .optional()
          .describe("Limit type for order amount"),
        issue_order_amount_min: z.string().optional().describe("Minimum order amount"),
        issue_order_amount_max: z.string().optional().describe("Maximum order amount"),
        issue_count_per_once: z
          .number()
          .min(1)
          .max(10)
          .optional()
          .describe("Each coupon issuance quantity"),
        issue_order_type: z
          .enum(["O", "P"])
          .optional()
          .describe("Issue unit (O: Order, P: Product)"),
        issue_order_available_product: z
          .enum(["U", "I", "E"])
          .optional()
          .describe("Issue object product"),
        issue_order_available_product_list: z
          .array(z.number())
          .optional()
          .describe("Applicable products list"),
        issue_order_available_category: z
          .enum(["U", "I", "E"])
          .optional()
          .describe("Issue object category"),
        issue_order_available_category_list: z
          .array(z.number())
          .optional()
          .describe("Applicable categories list"),
        issue_quntity_type: z.enum(["P", "O"]).optional().describe("Discount standard volume"),
        issue_quantity_min: z
          .number()
          .min(1)
          .max(999)
          .optional()
          .describe("Minimum purchase quantity for coupon issuance"),
        available_payment_method: z
          .array(z.string())
          .optional()
          .describe("Available payment method"),
        use_notification_when_login: z
          .enum(["T", "F"])
          .optional()
          .describe("Use coupon issuance alarm during login"),
        send_sms_for_issue: z.enum(["T", "F"]).optional().describe("Send SMS of coupon issuance"),
        send_email_for_issue: z
          .enum(["T", "F"])
          .optional()
          .describe("Send Email of coupon issuance"),
        exclude_unsubscribed: z
          .enum(["T", "F"])
          .optional()
          .describe("Exclusion based on email subscription"),
        recurring_issuance: z.any().optional().describe("Auto-issued coupon on a regular basis"),
        recurring_issuance_interval: z
          .enum(["1m", "3m", "6m", "12m"])
          .optional()
          .describe("Coupon issuance frequency"),
        recurring_issuance_day: z.number().optional().describe("Scheduled day of the month"),
        recurring_issuance_hour: z.string().optional().describe("Issuance time (hour)"),
        recurring_issuance_minute: z.string().optional().describe("Issuance time (minute)"),
      })
      .describe("Coupon create request object"),
  })
  .strict();

export const CouponUpdateSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop Number (Default: 1)"),
    coupon_no: z.string().describe("Coupon number"),
    request: z
      .object({
        status: z.enum(["pause", "restart"]).optional().describe("Update coupon status"),
        deleted: z.enum(["D"]).nullable().optional().describe("Delete coupon (D: Delete)"),
        immediate_issue_pause: z.enum(["I"]).optional().describe("Stop immediate issue"),
        immediate_issue_restart: z.enum(["I"]).optional().describe("Restart immediate issue"),
      })
      .describe("Coupon update request object"),
  })
  .strict();

export type CouponsSearchParams = z.infer<typeof CouponsSearchParamsSchema>;
export type CouponsCountParams = z.infer<typeof CouponsCountParamsSchema>;
export type CouponDetailParams = z.infer<typeof CouponDetailParamsSchema>;
export type CouponCreateParams = z.infer<typeof CouponCreateSchema>;
export type CouponUpdateParams = z.infer<typeof CouponUpdateSchema>;
