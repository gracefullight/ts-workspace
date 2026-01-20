import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

// --- AlimTalk ---

const KakaoAlimtalkSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const KakaoAlimtalkSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_kakaoalimtalk: z.enum(["T", "F"]).describe("Enable KakaoAlimtalk: T=Yes, F=No"),
  })
  .strict();

async function cafe24_get_kakaoalimtalk_setting(
  params: z.infer<typeof KakaoAlimtalkSettingParamsSchema>,
) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      "/admin/kakaoalimtalk/setting",
      "GET",
      undefined,
      queryParams,
    );
    const kakao = data.kakaoalimtalk || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## KakaoAlimtalk Settings (Shop #${kakao.shop_no || 1})\n\n` +
            `- **KakaoAlimtalk Enabled**: ${kakao.use_kakaoalimtalk === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: kakao.shop_no ?? 1,
        use_kakaoalimtalk: kakao.use_kakaoalimtalk,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_kakaoalimtalk_setting(
  params: z.infer<typeof KakaoAlimtalkSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/kakaoalimtalk/setting", "PUT", requestBody);
    const kakao = data.kakaoalimtalk || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## KakaoAlimtalk Settings Updated (Shop #${kakao.shop_no || 1})\n\n` +
            `- **KakaoAlimtalk Enabled**: ${kakao.use_kakaoalimtalk === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: kakao.shop_no ?? 1,
        use_kakaoalimtalk: kakao.use_kakaoalimtalk,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

// --- KakaoSync ---

const KakaoSyncParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const KakaoSyncUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    rest_api_key: z.string().describe("REST API Key"),
    javascript_key: z.string().describe("JavaScript Key"),
    auto_login: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Auto Login: T=Yes, F=No (Default: F)"),
    use_signup_result_page: z
      .enum(["T", "F"])
      .optional()
      .default("F")
      .describe("Use Signup Result Page: T=Yes, F=No (Default: F)"),
  })
  .strict();

async function cafe24_get_kakaosync_setting(params: z.infer<typeof KakaoSyncParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/socials/kakaosync", "GET", undefined, queryParams);
    const sync = data.kakaosync || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## KakaoSync Settings (Shop #${sync.shop_no || 1})\n\n` +
            `- **Enabled**: ${sync.use_kakaosync === "T" ? "Yes" : "No"}\n` +
            `- **REST API Key**: ${sync.rest_api_key}\n` +
            `- **JavaScript Key**: ${sync.javascript_key}\n` +
            `- **Auto Login**: ${sync.auto_login === "T" ? "Yes" : "No"}\n` +
            `- **Third Party Agree**: ${sync.thirdparty_agree === "T" ? "Yes" : "No"}` +
            (sync.thirdparty_agree_date ? ` (${sync.thirdparty_agree_date})` : "") +
            `\n` +
            `- **Signup Result Page**: ${sync.use_signup_result_page === "T" ? "Redirect" : "Immediate"}\n`,
        },
      ],
      structuredContent: sync as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_kakaosync_setting(
  params: z.infer<typeof KakaoSyncUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;
    const requestBody = {
      shop_no,
      request: settings,
    };

    const data = await makeApiRequest("/admin/socials/kakaosync", "PUT", requestBody);
    const sync = data.kakaosync || data;

    return {
      content: [
        {
          type: "text" as const,
          text: `KakaoSync settings updated successfully for Shop #${sync.shop_no || 1}`,
        },
      ],
      structuredContent: sync as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  // AlimTalk
  server.registerTool(
    "cafe24_get_kakaoalimtalk_setting",
    {
      title: "Get Cafe24 KakaoAlimtalk Settings",
      description: "Retrieve KakaoAlimtalk (Kakao Notification Talk) settings for the shop.",
      inputSchema: KakaoAlimtalkSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_kakaoalimtalk_setting,
  );

  server.registerTool(
    "cafe24_update_kakaoalimtalk_setting",
    {
      title: "Update Cafe24 KakaoAlimtalk Settings",
      description:
        "Enable or disable KakaoAlimtalk (Kakao Notification Talk) for the shop. Set use_kakaoalimtalk to T (enable) or F (disable).",
      inputSchema: KakaoAlimtalkSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_kakaoalimtalk_setting,
  );

  // KakaoSync
  server.registerTool(
    "cafe24_get_kakaosync_setting",
    {
      title: "Get Cafe24 KakaoSync Settings",
      description:
        "Retrieve KakaoSync settings including REST API key, JavaScript key, auto-login status, and third-party agreement details.",
      inputSchema: KakaoSyncParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_kakaosync_setting,
  );

  server.registerTool(
    "cafe24_update_kakaosync_setting",
    {
      title: "Update Cafe24 KakaoSync Settings",
      description:
        "Update KakaoSync settings. Requires REST API key and JavaScript key. Can also configure auto-login and signup result page behaviors.",
      inputSchema: KakaoSyncUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_kakaosync_setting,
  );
}
