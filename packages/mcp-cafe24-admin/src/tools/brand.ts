import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CountBrands,
  CountBrandsSchema,
  type CreateBrand,
  CreateBrandSchema,
  type DeleteBrand,
  DeleteBrandSchema,
  type ListBrands,
  ListBrandsSchema,
  type UpdateBrand,
  UpdateBrandSchema,
} from "@/schemas/brand.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { BrandCountResponse, BrandResponse, BrandsResponse } from "@/types/index.js";

async function cafe24_list_brands(params: ListBrands) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<BrandsResponse>(
      "/admin/brands",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const brands = data.brands || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${brands.length} brands.\n\n` +
            brands
              .map(
                (b) =>
                  `- [${b.brand_code}] ${b.brand_name}\n  Used: ${b.use_brand === "T" ? "Yes" : "No"}, Products: ${b.product_count ?? 0}`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { brands },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_brands(params: CountBrands) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<BrandCountResponse>(
      "/admin/brands/count",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total brand count: ${data.count}`,
        },
      ],
      structuredContent: { count: data.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_brand(params: CreateBrand) {
  try {
    const { shop_no, request } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<BrandResponse>(
      "/admin/brands",
      "POST",
      { shop_no, request },
      undefined,
      requestHeaders,
    );

    const brand = data.brand;

    return {
      content: [
        {
          type: "text" as const,
          text: `Created brand: ${brand.brand_name} (Code: ${brand.brand_code})`,
        },
      ],
      structuredContent: brand,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_brand(params: UpdateBrand) {
  try {
    const { shop_no, brand_code, request } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<BrandResponse>(
      `/admin/brands/${brand_code}`,
      "PUT",
      { shop_no, request },
      undefined,
      requestHeaders,
    );

    const brand = data.brand;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated brand: ${brand.brand_name} (Code: ${brand.brand_code})`,
        },
      ],
      structuredContent: brand,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_brand(params: DeleteBrand) {
  try {
    const { brand_code } = params;

    const data = await makeApiRequest<BrandResponse>(
      `/admin/brands/${brand_code}`,
      "DELETE",
      undefined,
      undefined,
      undefined,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted brand: ${data.brand.brand_code}`,
        },
      ],
      structuredContent: data.brand,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_brands",
    {
      title: "List Brands",
      description: "Retrieve a list of brands",
      inputSchema: ListBrandsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_brands,
  );

  server.registerTool(
    "cafe24_count_brands",
    {
      title: "Count Brands",
      description: "Retrieve the count of brands",
      inputSchema: CountBrandsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_brands,
  );

  server.registerTool(
    "cafe24_create_brand",
    {
      title: "Create Brand",
      description: "Create a new brand",
      inputSchema: CreateBrandSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_create_brand,
  );

  server.registerTool(
    "cafe24_update_brand",
    {
      title: "Update Brand",
      description: "Update an existing brand",
      inputSchema: UpdateBrandSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_brand,
  );

  server.registerTool(
    "cafe24_delete_brand",
    {
      title: "Delete Brand",
      description: "Delete an existing brand",
      inputSchema: DeleteBrandSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_delete_brand,
  );
}
