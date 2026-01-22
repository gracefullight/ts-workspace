#!/usr/bin/env node

import chalk from "chalk";
import { Command, Option } from "commander";
import { loadConfig } from "@/load-config";

import { getCurrentBranchName, validateWithDetails } from "@/validate-branch-name";

const SUCCESS_CODE = 0;
const FAILED_CODE = 1;

const PRESET_EXAMPLES = {
  gitflow: ["feature/login", "fix/bug-123", "hotfix/security", "release/v1.0.0"],
  jira: ["FEATURE-123", "BUG-456", "STORY-789", "TASK-101"],
} as const;

const program = new Command();

program
  .name("validate-branch")
  .description("Git branch name validation tool")
  .version("0.1.0", "-v, --version");

program.addOption(
  new Option("-t, --test <branch>", "Test target branch name (uses current branch by default)"),
);

program.addOption(
  new Option("-r, --regexp <regexp>", "Custom regular expression to test branch name"),
);

program.addOption(
  new Option("-p, --preset <preset>", "Use preset pattern (gitflow or jira)").choices([
    "gitflow",
    "jira",
  ]),
);

async function main() {
  program.parse(process.argv);

  const options = program.opts<{
    test?: string;
    regexp?: string;
    preset?: "gitflow" | "jira";
  }>();
  const branch = options.test || (await getCurrentBranchName());

  if (!branch) {
    console.error(chalk.red.bold("Error: Not a git repository\n"));
    process.exit(FAILED_CODE);
  }

  const config = await loadConfig();
  const customRegexp = options.regexp || config?.pattern;
  const preset = options.preset || config?.preset || "gitflow";

  console.log(chalk.cyan.bold(`\nValidating branch: ${chalk.yellow(branch)}\n`));
  console.log(chalk.gray(`Preset: ${preset}\n`));

  if (config?.description) {
    console.log(chalk.gray(`Config: ${config.description}\n`));
  }

  try {
    const result = validateWithDetails(branch, { customRegexp, preset });

    if (result.valid) {
      console.log(chalk.green.bold("✓ Valid branch name\n"));
      process.exit(SUCCESS_CODE);
    } else {
      console.error(chalk.red.bold("✗ Invalid branch name\n"));
      console.error(chalk.yellow(result.error));
      console.error(chalk.gray("\nExamples of valid branch names:"));
      for (const example of PRESET_EXAMPLES[preset]) {
        console.error(chalk.green(`  • ${example}`));
      }
      console.error();
      process.exit(FAILED_CODE);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(chalk.red.bold(`\nError: ${errorMessage}\n`));
    process.exit(FAILED_CODE);
  }
}

main();
