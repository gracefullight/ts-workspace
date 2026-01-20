import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Redirect } from "../types.js";

const RedirectsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    id: z.number().int().optional().describe("Redirect ID"),
    path: z.string().optional().describe("Redirect path"),
    target: z.string().optional().describe("Target location"),
  })
  .strict();

const RedirectCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    path: z.string().describe("Redirect path (e.g., /cafe24)"),
    target: z.string().describe("Target URL (e.g., https://www.cafe24.com)"),
  })
  .strict();

const RedirectUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    id: z.number().int().min(1).describe("Redirect ID"),
    path: z.string().optional().describe("New redirect path"),
    target: z.string().optional().describe("New target URL"),
  })
  .strict();

const RedirectDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    id: z.number().int().min(1).describe("Redirect ID"),
  })
  .strict();

async function cafe24_list_redirects(params: z.infer<typeof RedirectsSearchParamsSchema>) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) queryParams.shop_no = params.shop_no;
    if (params.id) queryParams.id = params.id;
    if (params.path) queryParams.path = params.path;
    if (params.target) queryParams.target = params.target;

    const data = await makeApiRequest<{ redirects: Redirect[] }>(
      "/admin/redirects",
      "GET",
      undefined,
      queryParams,
    );
    const redirects = data.redirects || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${redirects.length} redirects\n\n` +
            redirects
              .map(
                (r) =>
                  `## Redirect #${r.id}\n` +
                  `- **Shop No**: ${r.shop_no}\n` +
                  `- **Path**: ${r.path}\n` +
                  `- **Target**: ${r.target}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: {
        count: redirects.length,
        redirects: redirects.map((r) => ({
          shop_no: r.shop_no,
          id: r.id,
          path: r.path,
          target: r.target,
        })),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_redirect(params: z.infer<typeof RedirectCreateParamsSchema>) {
  try {
    const { shop_no, path, target } = params;
    const requestBody = {
      shop_no,
      request: {
        path,
        target,
      },
    };

    const data = await makeApiRequest<{ redirects: Redirect }>(
      "/admin/redirects",
      "POST",
      requestBody,
    );
    const redirect = data.redirects || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Redirect created successfully: ${redirect.path} -> ${redirect.target} (ID: ${redirect.id})`,
        },
      ],
      structuredContent: {
        shop_no: redirect.shop_no,
        id: redirect.id,
        path: redirect.path,
        target: redirect.target,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_redirect(params: z.infer<typeof RedirectUpdateParamsSchema>) {
  try {
    const { shop_no, id, path, target } = params;
    const requestBody = {
      shop_no,
      request: {
        ...(path ? { path } : {}),
        ...(target ? { target } : {}),
      },
    };

    const data = await makeApiRequest<{ redirects: Redirect }>(
      `/admin/redirects/${id}`,
      "PUT",
      requestBody,
    );
    const redirect = data.redirects || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Redirect #${redirect.id} updated successfully: ${redirect.path} -> ${redirect.target}`,
        },
      ],
      structuredContent: {
        shop_no: redirect.shop_no,
        id: redirect.id,
        path: redirect.path,
        target: redirect.target,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_redirect(params: z.infer<typeof RedirectDeleteParamsSchema>) {
  try {
    await makeApiRequest(`/admin/redirects/${params.id}`, "DELETE", undefined, {
      shop_no: params.shop_no,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Redirect #${params.id} deleted successfully (Shop #${params.shop_no})`,
        },
      ],
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_redirects",
    {
      title: "List Cafe24 Redirects",
      description:
        "Retrieve a list of URL redirects. Supports filtering by shop number, ID, path, and target.",
      inputSchema: RedirectsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_redirects,
  );

  server.registerTool(
    "cafe24_create_redirect",
    {
      title: "Create Cafe24 Redirect",
      description: "Create a new URL redirect in Cafe24. Requires path and target URL.",
      inputSchema: RedirectCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_redirect,
  );

  server.registerTool(
    "cafe24_update_redirect",
    {
      title: "Update Cafe24 Redirect",
      description: "Update an existing URL redirect. Can modify the path or target URL.",
      inputSchema: RedirectUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_update_redirect,
  );

  server.registerTool(
    "cafe24_delete_redirect",
    {
      title: "Delete Cafe24 Redirect",
      description: "Delete a URL redirect by ID.",
      inputSchema: RedirectDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_redirect,
  );
}
