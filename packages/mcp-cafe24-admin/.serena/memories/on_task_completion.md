# On Task Completion

Before completing a task, ensure the following:
1. Run `pnpm lint` and fix any issues (use `pnpm lint:fix`).
2. Run `pnpm typecheck` to ensure there are no TypeScript errors.
3. Run `pnpm test:run` if any logic was changed that might affect existing tests.
4. Verify that new tools are registered in `src/tools/index.ts`.
5. Ensure all file names follow the kebab-case convention.
