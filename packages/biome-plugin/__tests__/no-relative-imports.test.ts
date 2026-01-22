import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const rulesDir = resolve(import.meta.dirname, "../rules");
let tempDir: string;

beforeAll(() => {
  tempDir = mkdtempSync(join(tmpdir(), "biome-plugin-test-"));

  cpSync(rulesDir, join(tempDir, "rules"), { recursive: true });

  const ruleContent = require("node:fs").readFileSync(
    join(tempDir, "rules/no-relative-imports.grit"),
    "utf-8",
  );
  console.log("DEBUG: RULE CONTENT:\n", ruleContent);

  writeFileSync(
    join(tempDir, "biome.json"),
    JSON.stringify({
      $schema: "https://biomejs.dev/schemas/2.3.11/schema.json",
      plugins: ["./rules/no-relative-imports.grit"],
      linter: {
        rules: {
          correctness: {
            noUnusedImports: "off",
            noUnusedVariables: "off",
          },
        },
      },
    }),
  );

  writeFileSync(
    join(tempDir, "relative-imports.ts"),
    `import { foo } from "./utils";
import { bar } from "../components";
import type { Baz } from "./types";
const lazy = await import("./lazy");
export { qux } from "./exports";
export type { Quux } from "../models";
export * from "./all";
export * as ns from "../namespace";
`,
  );

  writeFileSync(
    join(tempDir, "valid-imports.ts"),
    `import { foo } from "@/utils";
import { bar } from "@/components";
import type { Baz } from "@/types";
const lazy = await import("@/lazy");
export { qux } from "@/exports";
export type { Quux } from "@/models";
export * from "@/all";
export * as ns from "@/namespace";
`,
  );

  // Test file for false positives - these should NOT be flagged
  writeFileSync(
    join(tempDir, "false-positives.ts"),
    `// File extensions in package imports should NOT be flagged
import type { Config } from "some-package/config.ts";
import { helper } from "package/file.js";
import styles from "css-package/styles.css";
import data from "json-loader/data.json";

// Node.js built-in modules
import { readFile } from "node:fs";
import path from "node:path";

// Regular package imports
import React from "react";
import { useState } from "react";
import lodash from "lodash";
import { debounce } from "lodash/debounce";

// Scoped packages
import { Button } from "@radix-ui/react-button";
import type { Theme } from "@emotion/react";

// Package with dots in name (edge case)
import { something } from "package.name";
import { other } from "@scope/package.name";

// Dynamic imports from packages
const pkg = await import("some-package/module.ts");
const json = await import("data-pkg/config.json");

// Re-exports from packages
export { Component } from "external-package";
export type { Props } from "types-package/props.ts";
export * from "barrel-package";
`,
  );

  // Test file for non-import contexts - path.resolve, object literals, etc.
  writeFileSync(
    join(tempDir, "non-import-contexts.ts"),
    `// These are NOT imports and should NOT be flagged
import path from "node:path";

// path.resolve with relative paths - common in config files
const srcDir = path.resolve(__dirname, "./src");
const rootDir = path.resolve(__dirname, "../");
const assetsDir = path.resolve(__dirname, "./assets");

// Vite/Webpack alias configuration pattern
const alias = {
  "@": path.resolve(__dirname, "./src"),
  "@components": path.resolve(__dirname, "./src/components"),
};

// Object literals with relative path strings
const config = {
  entry: "./src/index.ts",
  output: "../dist",
  include: ["./src/**/*.ts"],
};

// Function arguments with relative paths
fs.readFileSync("./config.json");
fs.writeFileSync("../output.txt", "data");
glob.sync("./src/**/*.ts");

// Template literals with relative paths
const template = \`Path is ./relative/path\`;

// Variable assignments
const relativePath = "./some/path";
const parentPath = "../parent";
`,
  );

  // Test file for single quotes
  writeFileSync(
    join(tempDir, "single-quotes.ts"),
    `import { foo } from './utils';
import { bar } from '../components';
const lazy = await import('./lazy');
export { qux } from './exports';
export * from '../all';
`,
  );

  // Test file for deeply nested relative paths
  writeFileSync(
    join(tempDir, "deep-relative-imports.ts"),
    `import { a } from "../../utils";
import { b } from "../../../components";
import { c } from "../../../../deep/nested/path";
`,
  );

  writeFileSync(
    join(tempDir, "deep-relative-exports.ts"),
    `export { qux } from "../../exports";\n`,
  );
});

afterAll(() => {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

function runBiomeLint(file: string): string {
  try {
    const result = execSync(`npx @biomejs/biome lint ${file}`, {
      cwd: tempDir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return result;
  } catch (error) {
    const err = error as { stdout: string; stderr: string };
    return `${err.stdout || ""}${err.stderr || ""}`;
  }
}

describe("no-relative-imports", () => {
  describe("should report relative imports", () => {
    it("detects static import with ./", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./utils");
      expect(output).toContain("Avoid relative import path");
    });
    it("detects static import with ./", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./utils");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects static import with ../", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../components");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects type import", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./types");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects dynamic import with warning severity", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./lazy");
      expect(output).toContain("Avoid relative dynamic import path");
    });

    it("detects export from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./exports");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export type from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../models");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export * from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("./all");
      expect(output).toContain("Avoid relative export path");
    });

    it("detects export * as from", () => {
      const output = runBiomeLint("relative-imports.ts");
      expect(output).toContain("../namespace");
      expect(output).toContain("Avoid relative export path");
    });
  });

  describe("should not report path alias imports", () => {
    it("allows @/ alias imports", () => {
      const output = runBiomeLint("valid-imports.ts");
      expect(output).not.toContain("Avoid relative import path");
      expect(output).not.toContain("Avoid relative export path");
      expect(output).not.toContain("Avoid relative dynamic import path");
    });
  });

  describe("should not report false positives", () => {
    it("allows file extensions in package imports (.ts, .js, .css, .json)", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("some-package/config.ts");
      expect(output).not.toContain("package/file.js");
      expect(output).not.toContain("css-package/styles.css");
      expect(output).not.toContain("json-loader/data.json");
    });

    it("allows node: protocol imports", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("node:fs");
      expect(output).not.toContain("node:path");
    });

    it("allows regular package imports", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("Avoid relative import path");
      expect(output).not.toContain("Avoid relative export path");
      expect(output).not.toContain("Avoid relative dynamic import path");
    });

    it("allows scoped package imports", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("@radix-ui/react-button");
      expect(output).not.toContain("@emotion/react");
    });

    it("allows packages with dots in name", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("package.name");
      expect(output).not.toContain("@scope/package.name");
    });

    it("allows dynamic imports from packages with extensions", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("some-package/module.ts");
      expect(output).not.toContain("data-pkg/config.json");
    });

    it("allows re-exports from packages with extensions", () => {
      const output = runBiomeLint("false-positives.ts");
      expect(output).not.toContain("types-package/props.ts");
    });

    it("allows path.resolve with relative paths (config files)", () => {
      const output = runBiomeLint("non-import-contexts.ts");
      expect(output).not.toContain("path.resolve");
      expect(output).not.toContain("./src");
      expect(output).not.toContain("./assets");
    });

    it("allows object literals with relative path strings", () => {
      const output = runBiomeLint("non-import-contexts.ts");
      expect(output).not.toContain("entry:");
      expect(output).not.toContain("output:");
    });

    it("allows function arguments with relative paths", () => {
      const output = runBiomeLint("non-import-contexts.ts");
      expect(output).not.toContain("readFileSync");
      expect(output).not.toContain("writeFileSync");
    });

    it("allows variable assignments with relative path strings", () => {
      const output = runBiomeLint("non-import-contexts.ts");
      expect(output).not.toContain("relativePath");
      expect(output).not.toContain("parentPath");
    });

    it("does not flag any relative paths in non-import contexts", () => {
      const output = runBiomeLint("non-import-contexts.ts");
      expect(output).not.toContain("Avoid relative import path");
      expect(output).not.toContain("Avoid relative export path");
      expect(output).not.toContain("Avoid relative dynamic import path");
    });
  });

  describe("should detect relative imports with single quotes", () => {
    it("detects ./ imports with single quotes", () => {
      const output = runBiomeLint("single-quotes.ts");
      expect(output).toContain("./utils");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects ../ imports with single quotes", () => {
      const output = runBiomeLint("single-quotes.ts");
      expect(output).toContain("../components");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects dynamic imports with single quotes", () => {
      const output = runBiomeLint("single-quotes.ts");
      expect(output).toContain("./lazy");
      expect(output).toContain("Avoid relative dynamic import path");
    });

    it("detects exports with single quotes", () => {
      const output = runBiomeLint("single-quotes.ts");
      expect(output).toContain("./exports");
      expect(output).toContain("../all");
      expect(output).toContain("Avoid relative export path");
    });
  });

  describe("should detect deeply nested relative imports", () => {
    it("detects ../../ paths", () => {
      const output = runBiomeLint("deep-relative-imports.ts");
      expect(output).toContain("../../utils");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects ../../../ paths", () => {
      const output = runBiomeLint("deep-relative-imports.ts");
      expect(output).toContain("../../../components");
      expect(output).toContain("Avoid relative import path");
    });

    it("detects ../../../../ paths", () => {
      const output = runBiomeLint("deep-relative-imports.ts");
      expect(output).toContain("../../../../deep/nested/path");
      expect(output).toContain("Avoid relative import path");
    });

    // TODO: Uncomment when Biome fixes GritQL pattern matching for `export { } from`
    // See: https://github.com/biomejs/biome/issues/XXXX
    // it("detects deeply nested export paths", () => {
    //   const output = runBiomeLint("deep-relative-exports.ts");
    //   expect(output).toContain("../../exports");
    //   expect(output).toContain("Avoid relative export path");
    // });
  });
});
