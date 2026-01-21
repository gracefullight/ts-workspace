import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import type { ReturnResponse } from "@/types/index.js";
import {
  CreateReturnInputSchema,
  GetReturnParamsSchema,
  UpdateReturnInputSchema,
} from "../schemas/return.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_retrieve_return(params: z.infer<typeof GetReturnParamsSchema>) {
  try {
    const { claim_code, shop_no } = params;
    const data = await makeApiRequest<ReturnResponse>(`/admin/return/${claim_code}`, "GET", {
      shop_no,
    });

    // The GET response typically returns a single object under "return" key based on the JSON example.
    const ret = data.return;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully retrieved return details for Claim Code: ${claim_code}`,
        },
      ],
      structuredContent: { return: ret },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_return(params: z.infer<typeof CreateReturnInputSchema>) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<ReturnResponse>("/admin/return", "POST", {
      shop_no,
      requests,
    });

    const ret = data.return;

    return {
      content: [
        {
          type: "text" as const,
          text: `Return request(s) created successfully.`,
        },
      ],
      structuredContent: { return: ret },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_return(params: z.infer<typeof UpdateReturnInputSchema>) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<ReturnResponse>("/admin/return", "PUT", {
      shop_no,
      requests,
    });

    const ret = data.return;

    return {
      content: [
        {
          type: "text" as const,
          text: `Return request(s) updated successfully.`,
        },
      ],
      structuredContent: { return: ret },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_retrieve_return",
    {
      title: "Retrieve Cafe24 Return",
      description: "Retrieve details of a specific return request by claim code.",
      inputSchema: GetReturnParamsSchema,
    },
    cafe24_retrieve_return,
  );

  server.registerTool(
    "cafe24_create_return",
    {
      title: "Create Cafe24 Return Request",
      description: "Create one or multiple return requests provided in the requests array.",
      inputSchema: CreateReturnInputSchema,
    },
    cafe24_create_return,
  );

  server.registerTool(
    "cafe24_update_return",
    {
      title: "Update Cafe24 Return Request",
      description: "Update status, invoice details, or other properties of return requests.",
      inputSchema: UpdateReturnInputSchema,
    },
    cafe24_update_return,
  );
}
