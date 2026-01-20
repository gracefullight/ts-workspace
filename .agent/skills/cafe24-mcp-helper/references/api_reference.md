# Cafe24 MCP Implementation Reference

This reference provides established patterns for implementing Cafe24 Admin API tools as MCP tools.

## Zod Schema Patterns

### Search Params
Use for GET requests that list resources with pagination and filters.
```typescript
export const ResourceSearchParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
  limit: z.number().int().min(1).max(500).default(20).describe("Limit"),
  offset: z.number().int().min(0).default(0).describe("Offset"),
  // add specific filters here
}).strict();
```

### Action Params
Use for POST/PUT/DELETE requests.
```typescript
export const ResourceCreateParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
  requests: z.array(z.object({
    // payload structure from API docs
  })).describe("List of requests"),
}).strict();
```

## Tool Implementation Patterns

### GET (List)
```typescript
async function cafe24_list_resources(params: z.infer<typeof ResourceSearchParamsSchema>) {
  try {
    const data = await makeApiRequest<{ resources: Resource[] }>(
      "/admin/resources",
      "GET",
      undefined,
      params,
    );
    const resources = data.resources || [];
    return {
      content: [{ type: "text", text: `Found ${resources.length} ...` }],
      structuredContent: { resources },
    };
  } catch (error) {
    return { content: [{ type: "text", text: handleApiError(error) }] };
  }
}
```

### POST/PUT
```typescript
async function cafe24_create_resource(params: z.infer<typeof ResourceCreateParamsSchema>) {
  try {
    const data = await makeApiRequest<{ resources: any[] }>(
      "/admin/resources",
      "POST",
      params,
    );
    return {
      content: [{ type: "text", text: "Success" }],
      structuredContent: { results: data.resources },
    };
  } catch (error) {
    return { content: [{ type: "text", text: handleApiError(error) }] };
  }
}
```

## Project Structure
- Types: `src/types/{feature}.ts` (and export in `src/types/index.ts`)
- Schemas: `src/schemas/{feature}.ts`
- Tools: `src/tools/{feature}.ts`
- Registration: Update `src/tools/index.ts`
