import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Category, Product } from "../types.js";

const ProductsSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    product_no: z.number().optional().describe("Filter by product number"),
    product_code: z.string().optional().describe("Filter by product code"),
    category_no: z.number().optional().describe("Filter by category number"),
    min_price: z.number().optional().describe("Minimum price filter"),
    max_price: z.number().optional().describe("Maximum price filter"),
    selling: z.boolean().optional().describe("Filter by selling status"),
    display: z.boolean().optional().describe("Filter by display status"),
  })
  .strict();

const ProductDetailParamsSchema = z
  .object({
    product_no: z.number().describe("Product number"),
  })
  .strict();

async function cafe24_list_products(params: z.infer<typeof ProductsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ products: Product[]; total: number }>(
      "/admin/products",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.product_no ? { product_no: params.product_no } : {}),
        ...(params.product_code ? { product_code: params.product_code } : {}),
        ...(params.category_no ? { category_no: params.category_no } : {}),
        ...(params.min_price !== undefined ? { min_price: params.min_price } : {}),
        ...(params.max_price !== undefined ? { max_price: params.max_price } : {}),
        ...(params.selling !== undefined ? { selling: params.selling ? "T" : "F" } : {}),
        ...(params.display !== undefined ? { display: params.display ? "T" : "F" } : {}),
      },
    );

    const products = data.products || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} products (showing ${products.length})\n\n` +
            products
              .map(
                (p) =>
                  `## ${p.product_name} (${p.product_no})\n- **Code**: ${p.product_code}\n- **Price**: ${p.price}\n- **Stock**: ${p.stock}\n- **Selling**: ${p.selling === "T" ? "Yes" : "No"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: products.length,
        offset: params.offset,
        products: products.map((p) => ({
          id: p.product_no.toString(),
          code: p.product_code,
          name: p.product_name,
          price: p.price,
          stock: p.stock,
          selling: p.selling === "T",
          display: p.display === "T",
        })),
        has_more: total > params.offset + products.length,
        ...(total > params.offset + products.length
          ? { next_offset: params.offset + products.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product(params: z.infer<typeof ProductDetailParamsSchema>) {
  try {
    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${params.product_no}`,
      "GET",
    );
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product Details\n\n` +
            `- **Product No**: ${product.product_no}\n` +
            `- **Name**: ${product.product_name}\n` +
            `- **Code**: ${product.product_code}\n` +
            `- **Price**: ${product.price}\n` +
            `- **Stock**: ${product.stock}\n` +
            `- **Selling**: ${product.selling === "T" ? "Yes" : "No"}\n` +
            `- **Display**: ${product.display === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        id: product.product_no.toString(),
        code: product.product_code,
        name: product.product_name,
        price: product.price,
        stock: product.stock,
        selling: product.selling === "T",
        display: product.display === "T",
        description: product.description,
        detail_description: product.detail_description,
        selling_date_start: product.selling_date_start,
        selling_date_end: product.selling_date_end,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

const ProductCreateParamsSchema = z
  .object({
    product_name: z.string().min(1).describe("Product name"),
    product_code: z.string().optional().describe("Product code"),
    price: z.number().min(0).describe("Product price"),
    stock: z.number().int().min(0).optional().describe("Stock quantity"),
    description: z.string().optional().describe("Short description"),
    detail_description: z.string().optional().describe("Detailed description"),
    selling: z.boolean().optional().default(false).describe("Whether product is for sale"),
    display: z.boolean().optional().default(true).describe("Whether to display product"),
  })
  .strict();

async function cafe24_create_product(params: z.infer<typeof ProductCreateParamsSchema>) {
  try {
    const requestBody = {
      ...params,
      selling: params.selling ? "T" : "F",
      display: params.display ? "T" : "F",
    };

    const data = await makeApiRequest<{ product: Product }>("/admin/products", "POST", {
      product: requestBody,
    });
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Product created successfully: ${product.product_name} (${product.product_no})`,
        },
      ],
      structuredContent: { id: product.product_no.toString(), name: product.product_name },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

const ProductUpdateParamsSchema = ProductCreateParamsSchema.partial().extend({
  product_no: z.number().describe("Product number"),
});

async function cafe24_update_product(params: z.infer<typeof ProductUpdateParamsSchema>) {
  try {
    const { product_no, ...updateParams } = params;
    const requestBody = {
      ...updateParams,
      ...(updateParams.selling !== undefined ? { selling: updateParams.selling ? "T" : "F" } : {}),
      ...(updateParams.display !== undefined ? { display: updateParams.display ? "T" : "F" } : {}),
    };

    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${product_no}`,
      "PUT",
      {
        product: requestBody,
      },
    );
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Product updated successfully: ${product.product_name} (${product.product_no})`,
        },
      ],
      structuredContent: { id: product.product_no.toString(), name: product.product_name },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product(product_no: number) {
  try {
    await makeApiRequest(`/admin/products/${product_no}`, "DELETE");

    return {
      content: [{ type: "text" as const, text: `Product ${product_no} deleted successfully` }],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

const CategoriesSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    parent_category_no: z.number().optional().describe("Filter by parent category"),
  })
  .strict();

async function cafe24_list_categories(params: z.infer<typeof CategoriesSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ categories: Category[]; total: number }>(
      "/admin/categories",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
        ...(params.parent_category_no ? { parent_category_no: params.parent_category_no } : {}),
      },
    );

    const categories = data.categories || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} categories (showing ${categories.length})\n\n` +
            categories
              .map(
                (c) =>
                  `## ${c.category_name} (${c.category_no})\n- **Depth**: ${c.category_depth}\n- **Parent**: ${c.parent_category_no || "None"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: categories.length,
        offset: params.offset,
        categories: categories.map((c) => ({
          id: c.category_no.toString(),
          name: c.category_name,
          depth: c.category_depth,
          parent_id: c.parent_category_no?.toString() || null,
        })),
        has_more: total > params.offset + categories.length,
        ...(total > params.offset + categories.length
          ? { next_offset: params.offset + categories.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_products",
    {
      title: "List Cafe24 Products",
      description:
        "Retrieve a list of products from Cafe24. Returns product details including product number, name, code, price, stock, and status. Supports extensive filtering by product number, code, category, price range, selling status, and display status. Paginated results.",
      inputSchema: ProductsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_products,
  );

  server.registerTool(
    "cafe24_get_product",
    {
      title: "Get Cafe24 Product Details",
      description:
        "Retrieve detailed information about a specific product by product number. Returns complete product details including name, code, price, stock, description, selling status, display status, and dates.",
      inputSchema: ProductDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product,
  );

  server.registerTool(
    "cafe24_create_product",
    {
      title: "Create Cafe24 Product",
      description:
        "Create a new product in Cafe24. Requires product name and price. Optionally includes product code, stock quantity, descriptions, selling status, and display status.",
      inputSchema: ProductCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product,
  );

  server.registerTool(
    "cafe24_update_product",
    {
      title: "Update Cafe24 Product",
      description:
        "Update an existing product in Cafe24 by product number. Only provided fields will be updated.",
      inputSchema: ProductUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product,
  );

  server.registerTool(
    "cafe24_delete_product",
    {
      title: "Delete Cafe24 Product",
      description: "Delete a product from Cafe24 by product number. This action cannot be undone.",
      inputSchema: z.object({ product_no: z.number().describe("Product number") }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ product_no }) => cafe24_delete_product(product_no),
  );

  server.registerTool(
    "cafe24_list_categories",
    {
      title: "List Cafe24 Product Categories",
      description:
        "Retrieve a list of product categories from Cafe24. Returns category details including category number, name, depth, and parent category. Supports pagination and filtering by parent category.",
      inputSchema: CategoriesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_categories,
  );
}
