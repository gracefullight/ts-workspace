import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { DisplaySetting, TextStyle } from "../types.js";

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
