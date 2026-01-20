import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const SeoSettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const OgSettingSchema = z
  .object({
    site_name: z.string().optional().describe("Site name"),
    title: z.string().optional().describe("Title"),
    description: z.string().optional().describe("Description"),
  })
  .strict();

const SeoSettingsUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    common_page_title: z.string().optional().describe("Common page title"),
    common_page_meta_description: z.string().optional().describe("Common page meta description"),
    favicon: z.string().optional().describe("Favicon URL"),
    use_google_search_console: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Google Search Console: T=Yes, F=No"),
    google_search_console: z.string().optional().describe("Google Search Console meta tag content"),
    use_naver_search_advisor: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Naver Search Advisor: T=Yes, F=No"),
    naver_search_advisor: z.string().optional().describe("Naver Search Advisor meta tag content"),
    sns_share_image: z.string().optional().describe("SNS share image URL"),
    use_twitter_card: z.enum(["T", "F"]).optional().describe("Use Twitter Card: T=Yes, F=No"),
    robots_text: z.string().optional().describe("Robots.txt content (PC)"),
    mobile_robots_text: z.string().optional().describe("Robots.txt content (Mobile)"),
    use_missing_page_redirect: z
      .enum(["T", "F"])
      .optional()
      .describe("Use missing page redirect (PC): T=Yes, F=No"),
    missing_page_redirect_url: z.string().optional().describe("Missing page redirect path (PC)"),
    mobile_use_missing_page_redirect: z
      .enum(["T", "F"])
      .optional()
      .describe("Use missing page redirect (Mobile): T=Yes, F=No"),
    mobile_missing_page_redirect_url: z
      .string()
      .optional()
      .describe("Missing page redirect path (Mobile)"),
    use_sitemap_auto_update: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto update sitemap: T=Yes, F=No"),
    use_rss: z.enum(["T", "F"]).optional().describe("Use RSS feed: T=Yes, F=No"),
    display_group: z.number().int().optional().describe("Main display group number"),
    header_tag: z.string().optional().describe("HTML Head tag (PC)"),
    footer_tag: z.string().optional().describe("HTML Body tag (PC)"),
    mobile_header_tag: z.string().optional().describe("HTML Head tag (Mobile)"),
    mobile_footer_tag: z.string().optional().describe("HTML Body tag (Mobile)"),
    og_main: OgSettingSchema.optional().describe("Main page Open Graph settings"),
    og_product: OgSettingSchema.optional().describe("Product page Open Graph settings"),
    og_category: OgSettingSchema.optional().describe("Category page Open Graph settings"),
    og_board: OgSettingSchema.optional().describe("Board page Open Graph settings"),
    llms_text: z
      .string()
      .optional()
      .describe("AI LLM crawler access control text (robots.txt extension)"),
  })
  .strict();

async function cafe24_get_seo_setting(params: z.infer<typeof SeoSettingsParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/seo/setting", "GET", undefined, queryParams);
    const seo = data.seo || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## SEO Settings (Shop #${seo.shop_no || 1})\n\n` +
            `- **Title**: ${seo.common_page_title || "N/A"}\n` +
            `- **Description**: ${seo.common_page_meta_description || "N/A"}\n` +
            `- **Google Search Console**: ${seo.use_google_search_console === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Naver Search Advisor**: ${seo.use_naver_search_advisor === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Sitemap Auto Update**: ${seo.use_sitemap_auto_update === "T" ? "Enabled" : "Disabled"}\n` +
            `- **RSS Feed**: ${seo.use_rss === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Favicon**: ${seo.favicon || "N/A"}\n` +
            `- **Robots.txt (PC)**: ${seo.robots_text ? "Configured" : "Empty"}\n` +
            `- **LLMs Text**: ${seo.llms_text ? "Configured" : "Empty"}\n`,
        },
      ],
      structuredContent: seo as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_seo_setting(params: z.infer<typeof SeoSettingsUpdateParamsSchema>) {
  try {
    const { shop_no, ...settings } = params;
    const requestBody = {
      shop_no,
      request: settings,
    };

    const data = await makeApiRequest("/admin/seo/setting", "PUT", requestBody);
    const seo = data.seo || data;

    return {
      content: [
        {
          type: "text" as const,
          text: `SEO settings updated successfully for Shop #${seo.shop_no || 1}`,
        },
      ],
      structuredContent: seo as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_seo_setting",
    {
      title: "Get Cafe24 SEO Settings",
      description:
        "Retrieve SEO settings including page titles, meta descriptions, favicons, search engine verification (Google/Naver), robots.txt, and Open Graph settings.",
      inputSchema: SeoSettingsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_seo_setting,
  );

  server.registerTool(
    "cafe24_update_seo_setting",
    {
      title: "Update Cafe24 SEO Settings",
      description:
        "Update SEO settings. Configure titles, meta descriptions, search engine verification codes, social media sharing (Open Graph), sitemaps, RSS, and crawler access controls.",
      inputSchema: SeoSettingsUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_seo_setting,
  );
}
