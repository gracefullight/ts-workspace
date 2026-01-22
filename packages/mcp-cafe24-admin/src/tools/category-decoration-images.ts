import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CategoryDecorationImagesGetParamsSchema,
  CategoryDecorationImagesUpdateParamsSchema,
} from "@/schemas/category-decoration-images.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { CategoryDecorationImageResponse } from "@/types/index.js";

async function cafe24_get_category_decoration_images(
  params: z.infer<typeof CategoryDecorationImagesGetParamsSchema>,
) {
  try {
    const { category_no, shop_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<CategoryDecorationImageResponse>(
      `/admin/categories/${category_no}/decorationimages`,
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const decorationimage =
      data.decorationimage || ({} as CategoryDecorationImageResponse["decorationimage"]);

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Decoration images for category ${category_no}\n` +
            `Shop: ${decorationimage.shop_no ?? shop_no}\n` +
            `Menu (PC): ${decorationimage.use_menu_image_pc === "T" ? "Enabled" : "Disabled"}\n` +
            `Top (PC): ${decorationimage.use_top_image_pc === "T" ? "Enabled" : "Disabled"}\n` +
            `Title (PC): ${decorationimage.use_title_image_pc === "T" ? "Enabled" : "Disabled"}\n` +
            `Menu (Mobile): ${decorationimage.use_menu_image_mobile === "T" ? "Enabled" : "Disabled"}\n` +
            `Top (Mobile): ${decorationimage.use_top_image_mobile === "T" ? "Enabled" : "Disabled"}\n` +
            `Title (Mobile): ${decorationimage.use_title_image_mobile === "T" ? "Enabled" : "Disabled"}`,
        },
      ],
      structuredContent: decorationimage as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_category_decoration_images(
  params: z.infer<typeof CategoryDecorationImagesUpdateParamsSchema>,
) {
  try {
    const { category_no, shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<CategoryDecorationImageResponse>(
      `/admin/categories/${category_no}/decorationimages`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const decorationimage =
      data.decorationimage || ({} as CategoryDecorationImageResponse["decorationimage"]);

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated decoration images for category ${category_no}`,
        },
      ],
      structuredContent: decorationimage as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_category_decoration_images",
    {
      title: "Get Category Decoration Images",
      description: "Retrieve decoration images for a category.",
      inputSchema: CategoryDecorationImagesGetParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_category_decoration_images,
  );

  server.registerTool(
    "cafe24_update_category_decoration_images",
    {
      title: "Update Category Decoration Images",
      description:
        "Update category decoration images. Provide data URIs or URLs; top images support up to 3 images.",
      inputSchema: CategoryDecorationImagesUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_category_decoration_images,
  );
}
