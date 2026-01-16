# @gracefullight/validate-branch

> Git branch name validation tool with custom regexp support

[![npm version](https://img.shields.io/npm/v/@gracefullight/validate-branch.svg)](https://www.npmjs.com/package/@gracefullight/validate-branch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | [한국어](./README.ko.md)

## Features

- **Flexible Regular Expression Pattern** - Use default pattern or custom regular expression
- **Current Branch Detection** - Automatically detect current branch name from Git repository
- **Config File Support** - Load patterns from `branch.config.{ts,js,mjs}` files
- **CLI Tool** - Use directly from command line
- **Detailed Error Messages** - Clear error descriptions on validation failure
- **Full TypeScript Support** - Complete TypeScript type definitions

## Default Pattern

By default, the following branch names are allowed:

- `main` / `master` - Main branches
- `develop` / `stage` - Development/staging branches
- `feature/.*` - Feature branches (e.g., `feature/login`, `feature/user-auth`)
- `fix/.*` - Bug fix branches (e.g., `fix/memory-leak`, `fix/typo`)
- `hotfix/.*` - Hotfix branches (e.g., `hotfix/critical-bug`)
- `release/.*` - Release branches (e.g., `release/v1.0.0`)

## Installation

```bash
# Using pnpm
pnpm add @gracefullight/validate-branch

# Using npm
npm install @gracefullight/validate-branch

# Using yarn
yarn add @gracefullight/validate-branch
```

## Usage

### CLI Usage

```bash
# Validate current branch
npx validate-branch

# Validate specific branch
npx validate-branch --test feature/new-feature

# Use custom regular expression
npx validate-branch --regexp "^(main|develop|feature/.+)$"
```

### Programmatic Usage

#### Validate with Default Pattern

```typescript
import { validateBranchName, validateWithDetails } from "@gracefullight/validate-branch";

// Simple boolean return
const isValid = validateBranchName("feature/new-component");
console.log(isValid); // true

// Detailed result return
const result = validateWithDetails("feature/new-component");
console.log(result);
// { valid: true, branchName: "feature/new-component" }
```

#### Validate with Custom Regexp

```typescript
import { validateBranchName } from "@gracefullight/validate-branch";

const customPattern = "^(main|develop|story/.+|bugfix/.+)$";
const isValid = validateBranchName("story/US-123-add-user", { customRegexp: customPattern });
console.log(isValid); // true
```

#### Get Current Branch Name

```typescript
import { getCurrentBranchName } from "@gracefullight/validate-branch";

const currentBranch = await getCurrentBranchName();
console.log(currentBranch); // "feature/new-component" or null
```

#### Load Config File

```typescript
import { loadConfig } from "@gracefullight/validate-branch";

const config = await loadConfig();
console.log(config);
// {
//   pattern: "^(main|develop|feature/.+)$",
//   description: "Project branch naming rules"
// }
```

## Configuration File

Create a `branch.config.ts` or `branch.config.js` file in your project root to define custom patterns.

### TypeScript Config (`branch.config.ts`)

```typescript
import type { Config } from "@gracefullight/validate-branch";

const config: Config = {
  pattern: "^(main|develop|feature/.+|fix/.+|refactor/.+)$",
  description: "Project branch naming rules",
};

export default config;
```

### JavaScript Config (`branch.config.js`)

```javascript
module.exports = {
  pattern: "^(main|develop|feature/.+|fix/.+)$",
  description: "Project branch naming rules",
};
```

### Using Presets (`branch.config.ts`)

You can use built-in presets instead of custom patterns.

```typescript
import type { Config } from "@gracefullight/validate-branch";

const config: Config = {
  preset: "jira", // "gitflow" or "jira"
  description: "JIRA ticket-based branch naming",
};

export default config;
```

**Available Presets:**

#### `gitflow` (default)

Pattern following Git Flow branching strategy.

| Status | Branch Examples |
|--------|-----------------|
| ✅ Allowed | `main`, `master`, `develop`, `stage` |
| ✅ Allowed | `feature/login`, `feature/user-auth`, `feature/add-payment` |
| ✅ Allowed | `fix/memory-leak`, `fix/typo`, `fix/null-pointer` |
| ✅ Allowed | `hotfix/critical-bug`, `hotfix/security-patch` |
| ✅ Allowed | `release/v1.0.0`, `release/2.3.1` |
| ❌ Rejected | `login`, `bugfix`, `my-branch` (no prefix) |
| ❌ Rejected | `feature/`, `fix/` (no name) |
| ❌ Rejected | `Feature/Login`, `FIX/bug` (uppercase prefix) |

#### `jira`

JIRA ticket number-based branch pattern.

| Status | Branch Examples |
|--------|-----------------|
| ✅ Allowed | `main`, `master`, `develop`, `stage` |
| ✅ Allowed | `FEATURE-123`, `FEATURE-1`, `FEATURE-99999` |
| ✅ Allowed | `BUG-456`, `STORY-789`, `TASK-101`, `HOTFIX-202` |
| ❌ Rejected | `feature/login` (gitflow style) |
| ❌ Rejected | `FEATURE-ABC` (not a number) |
| ❌ Rejected | `feature-123` (lowercase) |
| ❌ Rejected | `JIRA-123/description` (contains slash) |

## API Reference

### `validateBranchName(branchName, options?)`

Check if a branch name is valid.

```typescript
interface ValidateBranchNameOptions {
  customRegexp?: string;
  preset?: "gitflow" | "jira";
}

function validateBranchName(
  branchName: string,
  options?: ValidateBranchNameOptions
): boolean
```

**Parameters:**
- `branchName`: Branch name to validate
- `options`: Optional, validation options object
  - `customRegexp`: Custom regular expression string
  - `preset`: Preset pattern (`gitflow` or `jira`, default: `gitflow`)

**Returns:** Validity status

---

### `validateWithDetails(branchName, options?)`

Return detailed validation result.

```typescript
function validateWithDetails(
  branchName: string,
  options?: ValidateBranchNameOptions
): ValidationResult
```

**Returns:**
```typescript
{
  valid: boolean;
  branchName: string;
  error?: string;  // Error message on failure
}
```

**Example:**
```typescript
const result = validateWithDetails("invalid-branch");
// {
//   valid: false,
//   branchName: "invalid-branch",
//   error: 'Branch name "invalid-branch" does not match pattern: /^(main|master|...)$/'
// }
```

---

### `getCurrentBranchName()`

Get current Git branch name.

```typescript
function getCurrentBranchName(): Promise<string | null>
```

**Returns:** Current branch name, `null` if not in a Git repository

---

### `loadConfig()`

Load project configuration file.

```typescript
function loadConfig(): Promise<Config | null>
```

**Config file search order:**
1. `branch.config.ts`
2. `branch.config.mts`
3. `branch.config.js`
4. `branch.config.cjs`
5. `branch.config.mjs`

**Returns:** Configuration object, `null` if no config file exists

---

## Type Definitions

### `Config`

```typescript
interface Config {
  pattern?: string;                    // Single regex pattern
  patterns?: string[];                 // Multiple regex patterns (planned)
  preset?: "gitflow" | "jira";         // Preset pattern (default: "gitflow")
  description?: string;                // Config description
}
```

### `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  branchName: string;
  error?: string;
}
```

## Examples

### Use with Git Hooks

#### With Husky in `package.json`

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "validate-branch"
    }
  }
}
```

#### Direct Git Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit

npx validate-branch
if [ $? -ne 0 ]; then
  echo "Branch name does not follow naming conventions."
  exit 1
fi
```

### Use with GitHub Actions

```yaml
name: Branch Validation

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install validate-branch
        run: npm install -g @gracefullight/validate-branch

      - name: Validate branch name
        run: validate-branch --test ${{ github.head_ref }}
```

### Use in CI/CD Pipeline

```yaml
# .github/workflows/ci.yml

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validate branch name
        run: npx validate-branch
```

### Use with ESLint Plugin

```javascript
// .eslintrc.js
const { execSync } = require("child_process");

module.exports = {
  // ... other config
  rules: {
    "custom/validate-branch": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Validate git branch name",
        },
      },
      create(context) {
        return {
          Program() {
            const branch = execSync("git rev-parse --abbrev-ref HEAD", {
              encoding: "utf-8",
            }).trim();

            const { validateBranchName } = require("@gracefullight/validate-branch");

            if (!validateBranchName(branch)) {
              context.report({
                node: {},
                message: `Invalid branch name: ${branch}`,
              });
            }
          },
        };
      },
    },
  },
};
```

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/gracefullight/saju.git
cd packages/validate-branch

# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm lint:fix
```

### Test CLI Locally

```bash
# After building, test CLI locally
node bin/validate-branch.js --test feature/new-feature

# Test with custom pattern
node bin/validate-branch.js --test invalid-name --regexp "^(main|develop)$"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Write tests for new features
- Maintain or improve code coverage
- Follow existing code style (enforced by Biome)
- Update documentation as needed

## License

MIT © [gracefullight](https://github.com/gracefullight)

## Related Projects

- [isomorphic-git](https://isomorphic-git.org/) - Git implementation library
- [Commander.js](https://commander.js/) - Node.js CLI framework
- [Chalk](https://chalk.js.org/) - Terminal string styling

## Support

- [Documentation](https://github.com/gracefullight/saju#readme)
- [Issue Tracker](https://github.com/gracefullight/saju/issues)
- [Discussions](https://github.com/gracefullight/saju/discussions)
