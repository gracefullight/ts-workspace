import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import tiged from "tiged";

const TEMPLATE_REPO = "first-fluke/fullstack-starter";

const program = new Command();

program
  .name("create-fullstack-starter")
  .description("Scaffold a fullstack-starter template from GitHub")
  .version("0.1.0", "-v, --version")
  .argument("[directory]", "Target directory for the project")
  .action(async (directory?: string) => {
    await main(directory);
  });

async function main(directory?: string) {
  p.intro(chalk.cyan.bold("Fullstack Starter - Production-ready fullstack monorepo template"));

  let targetDir = directory;

  if (!targetDir) {
    const result = await p.text({
      message: "Project directory:",
      placeholder: ".",
      validate: (value) => {
        if (!value.trim()) {
          return "Directory name cannot be empty";
        }
      },
    });

    if (p.isCancel(result)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    targetDir = result || ".";
  }

  const resolvedPath = path.resolve(process.cwd(), targetDir);
  const isCurrentDir = targetDir === ".";

  if (existsSync(resolvedPath)) {
    const files = readdirSync(resolvedPath);
    const hasFiles = files.filter((f) => !f.startsWith(".")).length > 0;

    if (hasFiles && !isCurrentDir) {
      p.cancel(`Directory "${targetDir}" is not empty.`);
      process.exit(1);
    }
  }

  const s = p.spinner();
  s.start(`Cloning template from ${TEMPLATE_REPO}...`);

  try {
    const emitter = tiged(TEMPLATE_REPO, {
      disableCache: true,
      force: isCurrentDir,
      verbose: false,
    });

    await emitter.clone(resolvedPath);
    s.stop("Template cloned successfully!");

    p.note(
      [
        !isCurrentDir && chalk.cyan(`cd ${targetDir}`),
        chalk.cyan("mise install        # Install runtimes"),
        chalk.cyan("mise run install    # Install dependencies"),
        chalk.cyan("mise infra:up       # Start local infrastructure"),
        chalk.cyan("mise dev            # Start development servers"),
      ]
        .filter(Boolean)
        .join("\n"),
      "Next steps",
    );

    p.log.info(chalk.gray("Documentation: https://github.com/first-fluke/fullstack-starter"));
    p.log.info(chalk.gray("If you like this template, please leave a star:"));
    p.log.info(chalk.gray("  gh api --method PUT /user/starred/first-fluke/fullstack-starter"));

    p.outro(chalk.green.bold("Your project is ready!"));
  } catch (error) {
    s.stop("Failed to clone template.");
    const message = error instanceof Error ? error.message : "Unknown error";
    p.cancel(message);
    process.exit(1);
  }
}

program.parse();
