# Style and Conventions

- **Tech Stack**: TypeScript, MCP SDK, Axios, Zod, Biome, Vitest, tsup.
- **Naming**: 
  - Functions: camelCase (e.g., `cafe24_list_orders`).
  - Schemas: PascalCase (e.g., `OrdersSearchParamsSchema`).
  - Files: kebab-case (e.g., `order-control.ts`).
- **Structure**:
  - `src/tools/`: Tool implementation and registration.
  - `src/schemas/`: Zod schemas for tool inputs.
  - `src/types/`: TypeScript interfaces (mostly for API responses).
  - `src/services/`: API client and auth logic.
- **Rules**:
  - Use `makeApiRequest` and `handleApiError` in tools.
  - Tools should return both `content` (Markdown) and `structuredContent` (JSON).
  - Input schemas must use `.strict()`.
  - Use descriptive strings in `.describe()`.
