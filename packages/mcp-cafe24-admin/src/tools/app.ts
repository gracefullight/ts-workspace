import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

/**
 * Schema for getting app information (no parameters needed)
 */
const AppDetailParamsSchema = z.object({}).strict();

/**
 * Retrieve app information from Cafe24
 *
 * GET /api/v2/admin/apps
 *
 * Returns version information including:
 * - version: Current app version
 * - version_expiration_date: Version expiration date
 * - initial_version: Initial version
 * - previous_version: Previous version
 * - extension_type: Extension type (section/embedded)
 */
async function cafe24_get_app() {
  try {
    const data = await makeApiRequest("/admin/apps", "GET");

    // Handle case where data is undefined or null
    if (!data) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No data returned from Cafe24 Apps API. The API response was empty.",
          },
        ],
      };
    }

    // Handle different possible response structures
    // API returns: { app: { version, version_expiration_date, initial_version, previous_version, extension_type } }
    const app = data.app || data;

    // Check if app has expected properties
    if (!app || typeof app !== "object") {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unexpected API response structure. Received: ${JSON.stringify(data, null, 2)}`,
          },
        ],
        structuredContent: { raw_response: data },
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## App Information\n\n` +
            `- **Version**: ${app.version ?? "N/A"}\n` +
            `- **Version Expiration Date**: ${app.version_expiration_date ?? "N/A"}\n` +
            `- **Initial Version**: ${app.initial_version ?? "N/A"}\n` +
            `- **Previous Version**: ${app.previous_version ?? "N/A"}\n` +
            `- **Extension Type**: ${app.extension_type ?? "N/A"}\n`,
        },
      ],
      structuredContent: {
        version: app.version ?? null,
        version_expiration_date: app.version_expiration_date ?? null,
        initial_version: app.initial_version ?? null,
        previous_version: app.previous_version ?? null,
        extension_type: app.extension_type ?? null,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

/**
 * Register all app-related tools with the MCP server
 */
export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_app",
    {
      title: "Get Cafe24 App Information",
      description:
        "Retrieve app information from Cafe24 including version, expiration date, initial version, older version, and extension type. Since this is app information, the same result is returned regardless of which shopping mall makes the request.",
      inputSchema: AppDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_app,
  );
}
