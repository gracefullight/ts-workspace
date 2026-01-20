import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const CategoryPropertySchema = z.object({
  key: z.string().describe("Property key (e.g., product_name)"),
  name: z.string().optional().describe("Property name text"),
  display: z.enum(["T", "F"]).optional().describe("Display property"),
  display_name: z.enum(["T", "F"]).optional().describe("Display property name"),
  font_type: z
    .enum(["N", "B", "I", "D"])
    .optional()
    .describe("Font type (N: Normal, B: Bold, I: Italic, D: Bold Italic)"),
  font_size: z.number().int().optional().describe("Font size"),
  font_color: z.string().optional().describe("Font color"),
});

const ListCategoryPropertiesSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .optional()
      .default(1)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    separated_category: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Start separately by category"),
    category_no: z.number().int().optional().describe("Category number"),
  })
  .strict();

const CreateCategoryPropertySchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    multishop_display_names: z
      .array(
        z.object({
          shop_no: z.number().int(),
          name: z.string(),
        }),
      )
      .min(1)
      .describe("Display names for multiple shops"),
    display: z.enum(["T", "F"]).optional().default("F").describe("Display property"),
    display_name: z.enum(["T", "F"]).optional().default("T").describe("Display property name"),
    font_type: z
      .enum(["N", "B", "I", "D"])
      .optional()
      .default("N")
      .describe("Font type (N: Normal, B: Bold, I: Italic, D: Bold Italic)"),
    font_size: z.number().int().optional().default(12).describe("Font size"),
    font_color: z.string().optional().default("#555555").describe("Font color"),
    exposure_group_type: z
      .enum(["A", "M"])
      .optional()
      .default("A")
      .describe("Exposure group type (A: All, M: Member)"),
  })
  .strict();

const UpdateCategoryPropertiesSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    separated_category: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Start separately by category"),
    category_no: z.number().int().optional().describe("Category number"),
    properties: z.array(CategoryPropertySchema).describe("List of properties to update"),
  })
  .strict();

async function cafe24_list_category_properties(
  params: z.infer<typeof ListCategoryPropertiesSchema>,
) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest(
      "/admin/categories/properties",
      "GET",
      undefined,
      queryParams as Record<string, any>,
      requestHeaders,
    );

    const category = data.category || {};
    const properties = category.properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${properties.length} category properties.\n` +
            `Display Group: ${category.display_group}\n` +
            `Separated Category: ${category.separated_category}\n\n` +
            properties
              .map(
                (p: any) =>
                  `- Key: ${p.key}\n` +
                  `  Name: ${p.name}\n` +
                  `  Display: ${p.display === "T" ? "Yes" : "No"}\n` +
                  `  Display Name: ${p.display_name === "T" ? "Yes" : "No"}\n` +
                  `  Font: ${p.font_type} / ${p.font_size}px / ${p.font_color}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        properties,
        meta: {
          display_group: category.display_group,
          separated_category: category.separated_category,
          category_no: category.category_no,
        },
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_category_property(
  params: z.infer<typeof CreateCategoryPropertySchema>,
) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      request: {
        property: requestBody,
      },
    };

    const data = await makeApiRequest(
      "/admin/categories/properties",
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data?.category?.property || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created custom category property: ${result.key}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_category_properties(
  params: z.infer<typeof UpdateCategoryPropertiesSchema>,
) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest(
      "/admin/categories/properties",
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.category || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated category properties.\nDisplay Group: ${result.display_group}\nCount: ${result.properties?.length || 0}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_category_properties",
    {
      title: "List Category Properties",
      description: "Retrieve category properties configurations",
      inputSchema: ListCategoryPropertiesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_category_properties,
  );

  server.registerTool(
    "cafe24_create_category_property",
    {
      title: "Create Category Property",
      description: "Create a custom category property",
      inputSchema: CreateCategoryPropertySchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_create_category_property,
  );

  server.registerTool(
    "cafe24_update_category_properties",
    {
      title: "Update Category Properties",
      description: "Update category properties configurations",
      inputSchema: UpdateCategoryPropertiesSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_category_properties,
  );
}
