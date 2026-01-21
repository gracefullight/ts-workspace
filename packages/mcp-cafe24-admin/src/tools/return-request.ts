import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ReturnRequestCreatePayload,
  ReturnRequestCreatePayloadSchema,
  type ReturnRequestUpdatePayload,
  ReturnRequestUpdatePayloadSchema,
} from "../schemas/return-request.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type {
  ReturnRequestCreateResponse,
  ReturnRequestUpdateResponse,
} from "../types/return-request.js";

async function cafe24_create_return_requests(params: ReturnRequestCreatePayload) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<ReturnRequestCreateResponse>(
      "/admin/returnrequests",
      "POST",
      {
        shop_no,
        requests,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created ${data.returnrequests.length} return request(s).`,
        },
      ],
      structuredContent: {
        returnrequests: data.returnrequests,
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

async function cafe24_update_return_requests(params: ReturnRequestUpdatePayload) {
  try {
    const { shop_no, requests } = params;
    const data = await makeApiRequest<ReturnRequestUpdateResponse>("/admin/returnrequests", "PUT", {
      shop_no,
      requests,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully rejected ${data.returnrequests.length} return request(s).`,
        },
      ],
      structuredContent: {
        returnrequests: data.returnrequests,
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_create_return_requests",
    {
      title: "Create Cafe24 Return Requests",
      description:
        "Create return requests for orders. Allows customers to request returns with pickup or direct shipping options.",
      inputSchema: ReturnRequestCreatePayloadSchema,
    },
    cafe24_create_return_requests,
  );

  server.registerTool(
    "cafe24_update_return_requests",
    {
      title: "Update Cafe24 Return Requests (Reject)",
      description:
        "Reject return requests for orders. Use this to reject/undone return requests with optional rejection reason.",
      inputSchema: ReturnRequestUpdatePayloadSchema,
    },
    cafe24_update_return_requests,
  );
}
