import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { BundleProduct, BundleProductComponent } from "../types.js";

const BundleProductComponentSchema = z.object({
  product_no: z.number().int().describe("Product number of the component"),
  purchase_quantity: z.number().int().describe("Purchase quantity of the component"),
  product_name: z.string().optional(),
  product_code: z.string().optional(),
  product_price: z.string().optional(),
});

const BundleProductSalesSchema = z.object({
  discount_value: z.string().describe("Discount value"),
  discount_type: z.enum(["P", "V"]).describe("Discount type (P: Percent, V: Fixed amount)"),
  discount_round_unit: z
    .enum(["F", "-2", "-1", "0", "1", "2", "3"])
    .optional()
    .describe("Discount round unit"),
  discount_round_type: z
    .enum(["F", "R", "C"])
    .optional()
    .describe("Discount round type (F: Floor, R: Round, C: Ceiling)"),
});

const BundleProductSearchParamsSchema = z
  .object({
    shop_no: z.number().int().optional().describe("Shop number"),
    product_no: z.string().optional().describe("Product numbers (comma separated)"),
    display: z.enum(["T", "F"]).optional().describe("Display status"),
    selling: z.enum(["T", "F"]).optional().describe("Selling status"),
    product_code: z.string().optional().describe("Product codes (comma separated)"),
    product_tag: z.string().optional().describe("Product tags (comma separated)"),
    custom_product_code: z.string().optional().describe("Custom product codes (comma separated)"),
    product_name: z.string().optional().describe("Product names (comma separated)"),
    eng_product_name: z.string().optional().describe("English product names (comma separated)"),
    supply_product_name: z.string().optional().describe("Supply product names (comma separated)"),
    internal_product_name: z
      .string()
      .optional()
      .describe("Internal product names (comma separated)"),
    model_name: z.string().optional().describe("Model names (comma separated)"),
    price_min: z.string().optional().describe("Minimum price"),
    price_max: z.string().optional().describe("Maximum price"),
    created_start_date: z.string().optional().describe("Created start date (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Created end date (YYYY-MM-DD)"),
    updated_start_date: z.string().optional().describe("Updated start date (YYYY-MM-DD)"),
    updated_end_date: z.string().optional().describe("Updated end date (YYYY-MM-DD)"),
    category: z.string().optional().describe("Category number"),
    category_unapplied: z.enum(["T"]).optional().describe("Search unapplied category"),
    include_sub_category: z.enum(["T"]).optional().describe("Include sub-categories"),
    product_weight: z.string().optional().describe("Product weight"),
    sort: z.enum(["created_date", "updated_date", "product_name"]).optional().describe("Sort by"),
    order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
    offset: z.number().int().min(0).optional().describe("Offset"),
    limit: z.number().int().min(1).max(100).optional().describe("Limit"),
    embed: z.string().optional().describe("Embed resources (comma separated)"),
  })
  .strict();

const CreateBundleProductSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    product_name: z.string().max(250).describe("Product name"),
    bundle_product_components: z
      .array(BundleProductComponentSchema)
      .min(1)
      .describe("Components of the bundle"),
    bundle_product_sales: BundleProductSalesSchema.describe("Sales settings for the bundle"),
    display: z.enum(["T", "F"]).optional().default("F").describe("Display status"),
    add_category_no: z
      .array(
        z.object({
          category_no: z.number().int(),
          recommend: z.enum(["T", "F"]).optional(),
          new: z.enum(["T", "F"]).optional(),
        }),
      )
      .optional()
      .describe("Categories to add"),
    custom_product_code: z.string().max(40).optional(),
    eng_product_name: z.string().max(250).optional(),
    supply_product_name: z.string().max(250).optional(),
    internal_product_name: z.string().max(50).optional(),
    model_name: z.string().max(100).optional(),
    use_naverpay: z.enum(["T", "F"]).optional(),
    naverpay_type: z.enum(["C", "O"]).optional(),
    product_weight: z.string().optional(),
    description: z.string().optional(),
    mobile_description: z.string().optional(),
    summary_description: z.string().max(255).optional(),
    simple_description: z.string().optional(),
    product_tag: z.array(z.string()).max(100).optional(),
    payment_info: z.string().optional(),
    shipping_info: z.string().optional(),
    exchange_info: z.string().optional(),
    service_info: z.string().optional(),
    icon: z.array(z.string()).max(5).optional(),
    hscode: z.string().max(20).optional(),
    shipping_scope: z.enum(["A", "C", "B"]).optional().default("A"),
    shipping_method: z.string().optional().default("01"),
    shipping_fee_by_product: z.enum(["T", "F"]).optional().default("F"),
    shipping_area: z.string().max(255).optional(),
    shipping_period: z
      .object({
        minimum: z.number().int().optional(),
        maximum: z.number().int().optional(),
      })
      .optional(),
    shipping_fee_type: z.enum(["T", "R", "M", "D", "W", "C", "N"]).optional().default("T"),
    shipping_rates: z
      .array(
        z.object({
          shipping_rates_min: z.string().optional(),
          shipping_rates_max: z.string().optional(),
          shipping_fee: z.string().optional(),
        }),
      )
      .max(200)
      .optional(),
    prepaid_shipping_fee: z.enum(["C", "P", "B"]).optional().default("B"),
    clearance_category_code: z.string().max(8).optional(),
    detail_image: z.string().optional(),
    list_image: z.string().optional(),
    tiny_image: z.string().optional(),
    small_image: z.string().optional(),
    image_upload_type: z.enum(["A", "B", "C"]).optional().default("A"),
    additional_information: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    price_content: z.string().max(20).optional(),
    buy_limit_by_product: z.enum(["T", "F"]).optional().default("F"),
    buy_limit_type: z.enum(["N", "M", "F", "O", "D"]).optional().default("F"),
    buy_group_list: z.array(z.number().int()).optional(),
    buy_member_id_list: z.array(z.string()).optional(),
    repurchase_restriction: z.enum(["T", "F"]).optional().default("F"),
    single_purchase_restriction: z.enum(["T", "F"]).optional().default("F"),
    single_purchase: z.enum(["T", "F", "O"]).optional(),
    points_by_product: z.enum(["T", "F"]).optional().default("F"),
    points_setting_by_payment: z.enum(["B", "C"]).optional(),
    points_amount: z
      .array(
        z.object({
          payment_method: z.string(),
          points_rate: z.string().optional(),
          points_unit_by_payment: z.string().optional(),
        }),
      )
      .optional(),
    except_member_points: z.enum(["T", "F"]).optional().default("F"),
    main: z.array(z.number().int()).optional(),
    relational_product: z
      .array(
        z.object({
          product_no: z.number().int(),
          interrelated: z.enum(["T", "F"]),
        }),
      )
      .max(200)
      .optional(),
    product_material: z.string().optional(),
    english_product_material: z.string().optional(),
    cloth_fabric: z.enum(["woven", "knit"]).optional(),
    additional_image: z.array(z.string()).max(20).optional(),
    adult_certification: z.enum(["T", "F"]).optional().default("F"),
    exposure_limit_type: z.enum(["A", "M"]).optional().default("A"),
    exposure_group_list: z.array(z.number().int()).optional(),
  })
  .strict();

async function cafe24_list_bundle_products(
  params: z.infer<typeof BundleProductSearchParamsSchema>,
) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ bundleproducts: BundleProduct[] }>(
      "/admin/bundleproducts",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const products = data.bundleproducts || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${products.length} bundle products.\n\n` +
            products
              .map(
                (p) =>
                  `## ${p.product_name} (${p.product_code})\n` +
                  `- No: ${p.product_no}\n` +
                  `- Display: ${p.display === "T" ? "Yes" : "No"}\n` +
                  `- Selling: ${p.selling === "T" ? "Yes" : "No"}\n` +
                  `- Price Content: ${p.price_content || "N/A"}\n` +
                  `- Components: ${
                    p.bundle_product_components
                      ? p.bundle_product_components
                          .map(
                            (c: BundleProductComponent) =>
                              `${c.product_name} x${c.purchase_quantity}`,
                          )
                          .join(", ")
                      : "None"
                  }\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        products,
        meta: {
          count: products.length,
        },
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_bundle_product(params: z.infer<typeof CreateBundleProductSchema>) {
  try {
    const { shop_no, ...requestBody } = params;

    // The API expects 'shop_no' and 'request' object in the body
    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ bundleproduct: BundleProduct }>(
      "/admin/bundleproducts",
      "POST",
      payload,
    );
    const product = data.bundleproduct || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created bundle product: ${product.product_name} (No: ${product.product_no}, Code: ${product.product_code})`,
        },
      ],
      structuredContent: product as any,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_bundle_products",
    {
      title: "List Cafe24 Bundle Products",
      description:
        "Retrieve a list of bundle products from Cafe24. Supports filtering by date, price, status, and various other criteria.",
      inputSchema: BundleProductSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_bundle_products,
  );

  server.registerTool(
    "cafe24_create_bundle_product",
    {
      title: "Create Cafe24 Bundle Product",
      description: "Create a new bundle product in Cafe24.",
      inputSchema: CreateBundleProductSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_create_bundle_product,
  );
}
