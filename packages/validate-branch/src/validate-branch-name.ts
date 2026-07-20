import * as fs from "node:fs";
import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { cwd } from "node:process";
import * as git from "isomorphic-git";

// Resolve the real git directory, following the `.git` pointer file that git
// creates for worktrees (e.g. `gitdir: /repo/.git/worktrees/<name>`).
// isomorphic-git's `currentBranch({ dir })` cannot follow that pointer, so it
// throws "Could not find HEAD" inside a worktree and the current branch can
// never be resolved. Resolving the gitdir explicitly fixes it.
function resolveGitdir(startDir: string): string {
  const dotGit = resolvePath(startDir, ".git");
  const stat = fs.statSync(dotGit);
  if (stat.isFile()) {
    const content = readFileSync(dotGit, "utf-8");
    const match = content.match(/gitdir:\s*(.+)/);
    if (match) {
      return resolvePath(match[1].trim());
    }
  }
  return dotGit;
}

export type Preset = "gitflow" | "jira";

export interface ValidateBranchNameOptions {
  customRegexp?: string;
  preset?: Preset;
}

const GITFLOW_PATTERN =
  /^(main|master|develop|stage|feature\/[A-Za-z0-9_-]+|fix\/[A-Za-z0-9_-]+|hotfix\/[A-Za-z0-9_-]+|release\/[A-Za-z0-9_.-]+)$/;

const JIRA_PATTERN = /^(main|master|develop|stage|[A-Z]+-[0-9]+)$/;

export function validateBranchName(
  branchName: string,
  options?: ValidateBranchNameOptions,
): boolean {
  const { customRegexp, preset = "gitflow" } = options ?? {};

  if (customRegexp) {
    return new RegExp(customRegexp).test(branchName);
  }

  const pattern = preset === "jira" ? JIRA_PATTERN : GITFLOW_PATTERN;

  return pattern.test(branchName);
}

export async function getCurrentBranchName(): Promise<string | null> {
  try {
    const gitdir = resolveGitdir(cwd());
    const branch = await git.currentBranch({
      fs,
      gitdir,
      fullname: false,
    });

    return branch ?? null;
  } catch {
    return null;
  }
}

export interface ValidationResult {
  valid: boolean;
  branchName: string;
  error?: string;
}

export function validateWithDetails(
  branchName: string,
  options?: ValidateBranchNameOptions,
): ValidationResult {
  const { customRegexp, preset = "gitflow" } = options ?? {};

  if (customRegexp) {
    const pattern = new RegExp(customRegexp);
    if (pattern.test(branchName)) {
      return { valid: true, branchName };
    }
    return {
      valid: false,
      branchName,
      error: `Branch name "${branchName}" does not match pattern: ${pattern.source}`,
    };
  }

  const pattern = preset === "jira" ? JIRA_PATTERN : GITFLOW_PATTERN;

  if (pattern.test(branchName)) {
    return { valid: true, branchName };
  }

  return {
    valid: false,
    branchName,
    error: `Branch name "${branchName}" does not match pattern: ${pattern.source}`,
  };
}
