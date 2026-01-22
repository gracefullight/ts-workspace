import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CategorySeoParams,
  CategorySeoParamsSchema,
  type CategorySeoUpdateParams,
  CategorySeoUpdateParamsSchema,
} from "@/schemas/category-seo.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { CategorySeoResponse } from "@/types/index.js";

async function cafe24_retrieve_category_seo(params: CategorySeoParams) {
  try {
    const { shop_no, category_no } = params;
    const requestHeaders = { "X-Cafe24-Shop-No": shop_no.toString() };

    const data = await makeApiRequest<CategorySeoResponse>(
      `/admin/categories/${category_no}/seo`,
      "GET",
      undefined,
      undefined,
      requestHeaders,
    );
    const seo = data.seo;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Category SEO Settings for #${category_no} (Shop #${shop_no})\n\n` +
            `- **Search Engine Exposure**: ${seo.search_engine_exposure === "T" ? "Use" : "Do not use"}\n` +
            `- **Browser Title**: ${seo.meta_title || "N/A"}\n` +
            `- **Meta Author**: ${seo.meta_author || "N/A"}\n` +
            `- **Meta Description**: ${seo.meta_description || "N/A"}\n` +
            `- **Meta Keywords**: ${seo.meta_keywords || "N/A"}\n`,
        },
      ],
      structuredContent: data as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_category_seo(params: CategorySeoUpdateParams) {
  try {
    const { shop_no, category_no, ...seoData } = params;
    const requestHeaders = { "X-Cafe24-Shop-No": shop_no.toString() };

    const payload = {
      shop_no,
      request: seoData,
    };

    const data = await makeApiRequest<CategorySeoResponse>(
      `/admin/categories/${category_no}/seo`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `SEO settings updated successfully for Category #${category_no} (Shop #${shop_no})`,
        },
      ],
      structuredContent: data as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_retrieve_category_seo",
    {
      title: "Retrieve Category SEO Settings",
      description:
        "Retrieve SEO settings for a category including browser title, meta author, description, keywords, and search engine exposure status.",
      inputSchema: CategorySeoParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_category_seo,
  );

  server.registerTool(
    "cafe24_update_category_seo",
    {
      title: "Update Category SEO Settings",
      description:
        "Update SEO settings for a category. Configure browser title, meta author, description, keywords, and search engine exposure status.",
      inputSchema: CategorySeoUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_category_seo,
  );
}
