import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  CreateRecipientGroupParamsSchema,
  DeleteRecipientGroupParamsSchema,
  RecipientGroupDetailParamsSchema,
  RecipientGroupsSearchParamsSchema,
  UpdateRecipientGroupParamsSchema,
} from "@/schemas/recipient-groups.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { RecipientGroupListResponse, RecipientGroupResponse } from "@/types/index.js";

async function cafe24_list_recipient_groups(
  params: z.infer<typeof RecipientGroupsSearchParamsSchema>,
) {
  try {
    const data = await makeApiRequest<RecipientGroupListResponse>(
      "/admin/recipientgroups",
      "GET",
      undefined,
      params,
    );
    const groups = data.recipientgroups || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${groups.length} recipient groups\n\n` +
            groups
              .map(
                (g) =>
                  `## ${g.group_name} (No: ${g.group_no})\n` +
                  `- **Description**: ${g.group_description || "N/A"}\n` +
                  `- **Member Count**: ${g.group_member_count}\n` +
                  `- **News Mail**: ${g.news_mail}\n` +
                  `- **SMS**: ${g.sms}\n` +
                  `- **Created**: ${g.created_date}\n`,
              )
              .join("\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_recipient_group(
  params: z.infer<typeof RecipientGroupDetailParamsSchema>,
) {
  try {
    const { group_no, ...queryParams } = params;
    const data = await makeApiRequest<RecipientGroupResponse>(
      `/admin/recipientgroups/${group_no}`,
      "GET",
      undefined,
      queryParams,
    );
    const g = data.recipientgroup;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Recipient Group: ${g.group_name} (No: ${g.group_no})\n\n` +
            `- **Description**: ${g.group_description || "N/A"}\n` +
            `- **Member Count**: ${g.group_member_count}\n` +
            `- **News Mail**: ${g.news_mail}\n` +
            `- **SMS**: ${g.sms}\n` +
            `- **Member Group No**: ${g.member_group_no || "N/A"}\n` +
            `- **Member Class**: ${g.member_class || "N/A"}\n` +
            `- **Member Type**: ${g.member_type || "N/A"}\n` +
            `- **Age**: ${g.age_min} - ${g.age_max}\n` +
            `- **Gender**: ${g.gender || "All"}\n` +
            `- **Points**: ${g.available_points_min} - ${g.available_points_max}\n` +
            `- **Created**: ${g.created_date}\n`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_recipient_group(
  params: z.infer<typeof CreateRecipientGroupParamsSchema>,
) {
  try {
    const data = await makeApiRequest<RecipientGroupResponse>(
      "/admin/recipientgroups",
      "POST",
      params,
    );
    const g = data.recipientgroup;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully created recipient group: **${g.group_name}** (No: ${g.group_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_recipient_group(
  params: z.infer<typeof UpdateRecipientGroupParamsSchema>,
) {
  try {
    const { group_no, ...body } = params;
    const data = await makeApiRequest<RecipientGroupResponse>(
      `/admin/recipientgroups/${group_no}`,
      "PUT",
      body,
    );
    const g = data.recipientgroup;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully updated recipient group: **${g.group_name}** (No: ${g.group_no}).`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_recipient_group(
  params: z.infer<typeof DeleteRecipientGroupParamsSchema>,
) {
  try {
    const { group_no, ...queryParams } = params;
    const data = await makeApiRequest<RecipientGroupResponse>(
      `/admin/recipientgroups/${group_no}`,
      "DELETE",
      undefined,
      queryParams,
    );
    const g = data.recipientgroup;

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully deleted recipient group no: **${g.group_no}**.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_recipient_groups",
    {
      title: "List Cafe24 Recipient Groups",
      description:
        "Retrieve a list of distribution groups (recipient groups) for marketing. Returns group details including name, description, member count, and creation date.",
      inputSchema: RecipientGroupsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_recipient_groups,
  );

  server.registerTool(
    "cafe24_get_recipient_group",
    {
      title: "Get Cafe24 Recipient Group Details",
      description:
        "Retrieve detailed information about a specific distribution group by group number.",
      inputSchema: RecipientGroupDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_recipient_group,
  );

  server.registerTool(
    "cafe24_create_recipient_group",
    {
      title: "Create Cafe24 Recipient Group",
      description:
        "Create a new distribution group for marketing. You can specify criteria like member group, class, age, gender, points, and more.",
      inputSchema: CreateRecipientGroupParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_recipient_group,
  );

  server.registerTool(
    "cafe24_update_recipient_group",
    {
      title: "Update Cafe24 Recipient Group",
      description: "Update an existing distribution group's name, description, or criteria.",
      inputSchema: UpdateRecipientGroupParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_recipient_group,
  );

  server.registerTool(
    "cafe24_delete_recipient_group",
    {
      title: "Delete Cafe24 Recipient Group",
      description: "Delete an existing distribution group by group number.",
      inputSchema: DeleteRecipientGroupParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_recipient_group,
  );
}
