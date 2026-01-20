import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { DisplaySetting, TextStyle } from "../types.js";

const MainPropertySchema = z.object({
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

const ListMainPropertiesSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    display_group: z.number().int().min(2).optional().default(2).describe("Display group number"),
  })
  .strict();

const CreateMainPropertySchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
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

const UpdateMainPropertiesSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    display_group: z.number().int().min(2).describe("Display group number"),
    properties: z.array(MainPropertySchema).describe("List of properties to update"),
  })
  .strict();

const MainSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const TextStyleSchema = z
  .object({
    use: z.enum(["T", "F"]).optional().describe("Use: T=Yes, F=No"),
    color: z.string().optional().describe("Font color (e.g., #000000)"),
    font_size: z.union([z.number(), z.string()]).optional().describe("Font size (in pixels)"),
    font_type: z
      .enum(["N", "B", "I", "D"])
      .optional()
      .describe("Font type: N=Normal, B=Bold, I=Italic, D=Bold Italic"),
  })
  .strict();

const MainSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    strikethrough_retail_price: z
      .enum(["T", "F"])
      .optional()
      .describe("Strikethrough retail price: T=Yes, F=No"),
    strikethrough_price: z.enum(["T", "F"]).optional().describe("Strikethrough price: T=Yes, F=No"),
    product_tax_type_text: TextStyleSchema.optional().describe("Tax type display settings"),
    product_discount_price_text: TextStyleSchema.optional().describe(
      "Discount price display settings",
    ),
    optimum_discount_price_text: TextStyleSchema.optional().describe(
      "Optimum discount price display settings",
    ),
  })
  .strict();

async function cafe24_list_main_properties(params: z.infer<typeof ListMainPropertiesSchema>) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest(
      "/admin/mains/properties",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const main = data.main || {};
    const properties = main.properties || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${properties.length} main properties.\n` +
            `Display Group: ${main.display_group}\n\n` +
            properties
              .map(
                (p: Record<string, unknown>) =>
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
          shop_no: main.shop_no,
          display_group: main.display_group,
        },
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_main_property(params: z.infer<typeof CreateMainPropertySchema>) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      request: {
        property: requestBody,
      },
    };

    const data = await makeApiRequest(
      "/admin/mains/properties",
      "POST",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data?.main?.property || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Created custom main property: ${result.key}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_main_properties(params: z.infer<typeof UpdateMainPropertiesSchema>) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest(
      "/admin/mains/properties",
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );

    const result = data.main || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated main properties.\nDisplay Group: ${result.display_group}\nCount: ${result.properties?.length || 0}`,
        },
      ],
      structuredContent: result as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_main_setting(params: z.infer<typeof MainSettingParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      "/admin/mains/properties/setting",
      "GET",
      undefined,
      queryParams,
    );
    const main = (data as any).main || data;

    const formatStyle = (style?: TextStyle) => {
      if (!style) return "N/A";
      const use = style.use === "T" ? "Enabled" : "Disabled";
      const type =
        style.font_type === "B"
          ? "Bold"
          : style.font_type === "I"
            ? "Italic"
            : style.font_type === "D"
              ? "Bold Italic"
              : "Normal";
      return `${use} | Color: ${style.color} | Size: ${style.font_size}px | Style: ${type}`;
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Main Product Properties Settings (Shop #${main.shop_no || 1})\n\n` +
            `- **Strikethrough Retail**: ${main.strikethrough_retail_price === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Strikethrough Price**: ${main.strikethrough_price === "T" ? "Enabled" : "Disabled"}\n\n` +
            `### Display Text Settings\n` +
            `- **Tax Type**: ${formatStyle(main.product_tax_type_text)}\n` +
            `- **Discount Price**: ${formatStyle(main.product_discount_price_text)}\n` +
            `- **Optimum Discount**: ${formatStyle(main.optimum_discount_price_text)}\n`,
        },
      ],
      structuredContent: {
        shop_no: main.shop_no ?? 1,
        strikethrough_retail_price: main.strikethrough_retail_price,
        strikethrough_price: main.strikethrough_price,
        product_tax_type_text: main.product_tax_type_text,
        product_discount_price_text: main.product_discount_price_text,
        optimum_discount_price_text: main.optimum_discount_price_text,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_main_setting(params: z.infer<typeof MainSettingUpdateParamsSchema>) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest<{ main: DisplaySetting } | DisplaySetting>(
      "/admin/mains/properties/setting",
      "PUT",
      requestBody,
    );
    const main = (data as any).main || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Main Settings Updated (Shop # ${(main as DisplaySetting).shop_no || 1})\n\n` +
            `- **Strikethrough Retail**: ${(main as DisplaySetting).strikethrough_retail_price === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Strikethrough Price**: ${(main as DisplaySetting).strikethrough_price === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: (main as DisplaySetting).shop_no ?? 1,
        strikethrough_retail_price: (main as DisplaySetting).strikethrough_retail_price,
        strikethrough_price: (main as DisplaySetting).strikethrough_price,
        product_tax_type_text: (main as DisplaySetting).product_tax_type_text,
        product_discount_price_text: (main as DisplaySetting).product_discount_price_text,
        optimum_discount_price_text: (main as DisplaySetting).optimum_discount_price_text,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_main_properties",
    {
      title: "List Main Properties",
      description: "Retrieve main display group properties configurations",
      inputSchema: ListMainPropertiesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_main_properties,
  );

  server.registerTool(
    "cafe24_create_main_property",
    {
      title: "Create Main Property",
      description: "Create a custom main display group property",
      inputSchema: CreateMainPropertySchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_create_main_property,
  );

  server.registerTool(
    "cafe24_update_main_properties",
    {
      title: "Update Main Properties",
      description: "Update main display group properties configurations",
      inputSchema: UpdateMainPropertiesSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_main_properties,
  );

  server.registerTool(
    "cafe24_get_main_setting",
    {
      title: "Get Cafe24 Main Product Settings",
      description:
        "Retrieve main product display settings including strikethrough options and text styles for tax, discount, and optimum discount prices.",
      inputSchema: MainSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_main_setting,
  );

  server.registerTool(
    "cafe24_update_main_setting",
    {
      title: "Update Cafe24 Main Product Settings",
      description:
        "Update main product display settings. Configure strikethrough for retail/price, and customize styles (color, size, font type) for tax, discount, and optimum discount texts.",
      inputSchema: MainSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_main_setting,
  );
}
