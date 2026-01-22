import { beforeEach, describe, expect, it } from "vitest";
import {
  getCurrentBranchName,
  validateBranchName,
  validateWithDetails,
} from "@/validate-branch-name.js";

describe("validateBranchName", () => {
  describe("with default pattern", () => {
    it("should validate main branch names", () => {
      expect(validateBranchName("main")).toBe(true);
      expect(validateBranchName("master")).toBe(true);
    });

    it("should validate development branch names", () => {
      expect(validateBranchName("develop")).toBe(true);
      expect(validateBranchName("stage")).toBe(true);
    });

    it("should validate feature branch names", () => {
      expect(validateBranchName("feature/login")).toBe(true);
      expect(validateBranchName("feature/user-auth")).toBe(true);
      expect(validateBranchName("feature/new-component")).toBe(true);
      expect(validateBranchName("feature/123-add-feature")).toBe(true);
      expect(validateBranchName("feature/US-123-story")).toBe(true);
      expect(validateBranchName("feature/ISSUE-456-bugfix")).toBe(true);
    });

    it("should validate fix branch names", () => {
      expect(validateBranchName("fix/memory-leak")).toBe(true);
      expect(validateBranchName("fix/typo")).toBe(true);
      expect(validateBranchName("fix/123-bug")).toBe(true);
      expect(validateBranchName("fix/critical-issue")).toBe(true);
    });

    it("should validate hotfix branch names", () => {
      expect(validateBranchName("hotfix/critical-bug")).toBe(true);
      expect(validateBranchName("hotfix/security-patch")).toBe(true);
      expect(validateBranchName("hotfix/123-emergency")).toBe(true);
    });

    it("should validate release branch names", () => {
      expect(validateBranchName("release/v1.0.0")).toBe(true);
      expect(validateBranchName("release/v2.1.3")).toBe(true);
      expect(validateBranchName("release/v0.0.1-alpha")).toBe(true);
      expect(validateBranchName("release/v1.0.0-beta.1")).toBe(true);
    });

    it("should reject invalid branch names", () => {
      expect(validateBranchName("random-name")).toBe(false);
      expect(validateBranchName("invalid")).toBe(false);
      expect(validateBranchName("my-feature")).toBe(false);
      expect(validateBranchName("bugfix/123")).toBe(false);
      expect(validateBranchName("story/US-123")).toBe(false);
      expect(validateBranchName("chore/update-deps")).toBe(false);
    });

    it("should reject branch names without prefix (except main/master/develop/stage)", () => {
      expect(validateBranchName("login")).toBe(false);
      expect(validateBranchName("auth")).toBe(false);
      expect(validateBranchName("component")).toBe(false);
    });

    it("should reject empty branch names", () => {
      expect(validateBranchName("")).toBe(false);
      expect(validateBranchName(" ")).toBe(false);
      expect(validateBranchName("  ")).toBe(false);
    });

    it("should reject branch names with special Git characters", () => {
      expect(validateBranchName("feature/new~feature")).toBe(false);
      expect(validateBranchName("feature/new^feature")).toBe(false);
      expect(validateBranchName("feature/new:feature")).toBe(false);
      expect(validateBranchName("feature/new*feature")).toBe(false);
      expect(validateBranchName("feature/new?feature")).toBe(false);
      expect(validateBranchName("feature/new[feature")).toBe(false);
      expect(validateBranchName("feature/new\\feature")).toBe(false);
      expect(validateBranchName("feature/new..feature")).toBe(false);
    });

    it("should reject branch names that end with slash or have only slash", () => {
      expect(validateBranchName("feature/")).toBe(false);
      expect(validateBranchName("feature//")).toBe(false);
    });
  });

  describe("with preset", () => {
    it("should use gitflow preset by default", () => {
      expect(validateBranchName("feature/login")).toBe(true);
      expect(validateBranchName("fix/bug")).toBe(true);
      expect(validateBranchName("hotfix/urgent")).toBe(true);
      expect(validateBranchName("release/v1.0.0")).toBe(true);
      expect(validateBranchName("FEATURE-123")).toBe(false);
      expect(validateBranchName("BUG-456")).toBe(false);
    });

    it("should use jira preset when specified", () => {
      expect(validateBranchName("feature/login", { preset: "jira" })).toBe(false);
      expect(validateBranchName("FEATURE-123/login", { preset: "jira" })).toBe(false);
      expect(validateBranchName("BUG-456/memory-leak", { preset: "jira" })).toBe(false);
      expect(validateBranchName("STORY-789/add-dashboard", { preset: "jira" })).toBe(false);
      expect(validateBranchName("FEATURE-123", { preset: "jira" })).toBe(true);
      expect(validateBranchName("BUG-456", { preset: "jira" })).toBe(true);
      expect(validateBranchName("STORY-789", { preset: "jira" })).toBe(true);
      expect(validateBranchName("TASK-123", { preset: "jira" })).toBe(true);
      expect(validateBranchName("HOTFIX-456", { preset: "jira" })).toBe(true);
    });

    it("should validate main/master/develop/stage with jira preset", () => {
      expect(validateBranchName("main", { preset: "jira" })).toBe(true);
      expect(validateBranchName("master", { preset: "jira" })).toBe(true);
      expect(validateBranchName("develop", { preset: "jira" })).toBe(true);
      expect(validateBranchName("stage", { preset: "jira" })).toBe(true);
    });

    it("should reject non-alphanumeric JIRA prefixes", () => {
      expect(validateBranchName("FEATURE-ABC/login", { preset: "jira" })).toBe(false);
      expect(validateBranchName("123-BUG/login", { preset: "jira" })).toBe(false);
      expect(validateBranchName("BUG-/login", { preset: "jira" })).toBe(false);
    });
  });

  describe("with custom regexp", () => {
    it("should use custom pattern for validation", () => {
      const customPattern = "^(main|develop|story/.+|bugfix/.+)$";
      expect(validateBranchName("story/US-123-add-user", { customRegexp: customPattern })).toBe(
        true,
      );
      expect(validateBranchName("bugfix/123-fix-bug", { customRegexp: customPattern })).toBe(true);
      expect(validateBranchName("feature/login", { customRegexp: customPattern })).toBe(false);
    });

    it("should validate simple pattern", () => {
      const simplePattern = "^(main|master)$";
      expect(validateBranchName("main", { customRegexp: simplePattern })).toBe(true);
      expect(validateBranchName("master", { customRegexp: simplePattern })).toBe(true);
      expect(validateBranchName("develop", { customRegexp: simplePattern })).toBe(false);
      expect(validateBranchName("feature/login", { customRegexp: simplePattern })).toBe(false);
    });

    it("should validate pattern with number prefix", () => {
      const patternWithNumber = "^\\d+/.+$";
      expect(validateBranchName("123/add-feature", { customRegexp: patternWithNumber })).toBe(true);
      expect(validateBranchName("456/fix-bug", { customRegexp: patternWithNumber })).toBe(true);
      expect(validateBranchName("feature/login", { customRegexp: patternWithNumber })).toBe(false);
    });

    it("should validate pattern with hyphenated prefixes", () => {
      const patternWithHyphens = "^(feature-branch|bug-fix|hot-fix)\\/.+$";
      expect(validateBranchName("feature-branch/login", { customRegexp: patternWithHyphens })).toBe(
        true,
      );
      expect(validateBranchName("bug-fix/memory", { customRegexp: patternWithHyphens })).toBe(true);
      expect(validateBranchName("feature/login", { customRegexp: patternWithHyphens })).toBe(false);
    });

    it("should handle pattern with special characters", () => {
      const patternWithSpecialChars = "^(feature\\/.+\\/.+)$";
      expect(
        validateBranchName("feature/auth/login", { customRegexp: patternWithSpecialChars }),
      ).toBe(true);
      expect(
        validateBranchName("feature/user/auth", { customRegexp: patternWithSpecialChars }),
      ).toBe(true);
      expect(validateBranchName("feature/login", { customRegexp: patternWithSpecialChars })).toBe(
        false,
      );
    });
  });

  describe("edge cases", () => {
    it("should handle very long branch names", () => {
      const longName = `feature/${"a".repeat(200)}`;
      expect(validateBranchName(longName)).toBe(true);
    });

    it("should handle branch names with dots in release branches", () => {
      expect(validateBranchName("release/v1.0.0")).toBe(true);
      expect(validateBranchName("release/v2.1.3")).toBe(true);
      expect(validateBranchName("release/v0.9.0")).toBe(true);
      expect(validateBranchName("release/v3.0.0-beta")).toBe(true);
    });

    it("should reject branch names with dots in feature branches", () => {
      expect(validateBranchName("feature/v1.0.0")).toBe(false);
      expect(validateBranchName("feature/1.0.0")).toBe(false);
    });

    it("should handle branch names with underscores", () => {
      expect(validateBranchName("feature/add_user_auth")).toBe(true);
      expect(validateBranchName("fix/memory_leak")).toBe(true);
    });

    it("should handle branch names with hyphens", () => {
      expect(validateBranchName("feature/add-user-auth")).toBe(true);
      expect(validateBranchName("fix/memory-leak")).toBe(true);
    });

    it("should handle branch names with numbers", () => {
      expect(validateBranchName("feature/123-login")).toBe(true);
      expect(validateBranchName("fix/456-bug")).toBe(true);
      expect(validateBranchName("hotfix/789-urgent")).toBe(true);
    });

    it("should handle branch names with uppercase letters", () => {
      expect(validateBranchName("feature/ISSUE-123-login")).toBe(true);
      expect(validateBranchName("fix/BUG-456-memory")).toBe(true);
      expect(validateBranchName("feature/US-789-dashboard")).toBe(true);
    });

    it("should handle branch names with mixed case", () => {
      expect(validateBranchName("feature/UserAuth-123")).toBe(true);
      expect(validateBranchName("fix/MemoryLeak-456")).toBe(true);
    });

    it("should reject branch names with spaces", () => {
      expect(validateBranchName("feature/new feature")).toBe(false);
      expect(validateBranchName("feature/add login")).toBe(false);
      expect(validateBranchName("fix/  memory-leak")).toBe(false);
    });

    it("should reject Unicode characters in feature branches", () => {
      expect(validateBranchName("feature/사용자인증")).toBe(false);
      expect(validateBranchName("feature/用户认证")).toBe(false);
      expect(validateBranchName("feature/ユーザー認証")).toBe(false);
    });

    it("should accept combinations of alphanumeric, hyphen, and underscore", () => {
      expect(validateBranchName("feature/user-auth-123")).toBe(true);
      expect(validateBranchName("fix/bug_fix-456")).toBe(true);
      expect(validateBranchName("hotfix/issue_789-urgent")).toBe(true);
    });
  });
});

describe("validateWithDetails", () => {
  describe("with preset", () => {
    it("should use gitflow preset by default", () => {
      const result = validateWithDetails("feature/login");
      expect(result.valid).toBe(true);
      expect(result.branchName).toBe("feature/login");
    });

    it("should use jira preset when specified", () => {
      const result = validateWithDetails("FEATURE-123", { preset: "jira" });
      expect(result.valid).toBe(true);
      expect(result.branchName).toBe("FEATURE-123");
    });

    it("should reject invalid branch with jira preset", () => {
      const result = validateWithDetails("feature/login", { preset: "jira" });
      expect(result.valid).toBe(false);
      expect(result.branchName).toBe("feature/login");
      expect(result.error).toBeDefined();
    });
  });

  describe("with default pattern", () => {
    it("should return valid result for valid branch names", () => {
      const result = validateWithDetails("feature/login");
      expect(result).toEqual({
        valid: true,
        branchName: "feature/login",
      });
    });

    it("should return invalid result for invalid branch names", () => {
      const result = validateWithDetails("random-branch");
      expect(result).toEqual({
        valid: false,
        branchName: "random-branch",
        error: expect.stringContaining("random-branch"),
      });
      expect(result.error).toContain("does not match pattern");
    });

    it("should include the pattern in error message", () => {
      const result = validateWithDetails("invalid-branch");
      expect(result.error).toBeDefined();
      expect(result.error).toContain("pattern:");
      expect(result.error).toContain("invalid-branch");
    });

    it("should return correct result structure for all valid branches", () => {
      const validBranches = [
        "main",
        "master",
        "develop",
        "stage",
        "feature/login",
        "fix/bug",
        "hotfix/urgent",
        "release/v1.0.0",
      ];
      validBranches.forEach((branch) => {
        const result = validateWithDetails(branch);
        expect(result.valid).toBe(true);
        expect(result.branchName).toBe(branch);
        expect(result.error).toBeUndefined();
      });
    });

    it("should return correct result structure for all invalid branches", () => {
      const invalidBranches = ["random-name", "my-feature", "bugfix/123", "story/US-123"];
      invalidBranches.forEach((branch) => {
        const result = validateWithDetails(branch);
        expect(result.valid).toBe(false);
        expect(result.branchName).toBe(branch);
        expect(result.error).toBeDefined();
        expect(result.error).toContain(branch);
      });
    });
  });

  describe("with custom regexp", () => {
    it("should return valid result with custom pattern", () => {
      const customPattern = "^(story/.+|bugfix/.+)$";
      const result = validateWithDetails("story/US-123", { customRegexp: customPattern });
      expect(result).toEqual({
        valid: true,
        branchName: "story/US-123",
      });
    });

    it("should return invalid result with custom pattern", () => {
      const customPattern = "^(story/.+|bugfix/.+)$";
      const result = validateWithDetails("feature/login", { customRegexp: customPattern });
      expect(result.valid).toBe(false);
      expect(result.branchName).toBe("feature/login");
      expect(result.error).toContain("feature/login");
      expect(result.error).toBeDefined();
      expect(result.error).toContain("pattern:");
    });

    it("should include custom pattern in error message", () => {
      const customPattern = "^(main|develop)$";
      const result = validateWithDetails("feature/login", { customRegexp: customPattern });
      expect(result.error).toBeDefined();
      expect(result.error).toContain("pattern:");
      expect(result.error).toContain("feature/login");
    });
  });

  describe("error message format", () => {
    it("should have consistent error message format", () => {
      const result = validateWithDetails("invalid-branch");
      expect(result.error).toMatch(/^Branch name "invalid-branch" does not match pattern: .+$/);
    });

    it("should escape special characters in branch name in error message", () => {
      const result = validateWithDetails("feature/with spaces");
      expect(result.error).toBeDefined();
      expect(result.error).toContain("feature/with spaces");
    });
  });
});

describe("getCurrentBranchName", () => {
  let _originalCwd: string;

  beforeEach(() => {
    _originalCwd = process.cwd();
  });

  it("should return current branch name in git repository", async () => {
    const branchName = await getCurrentBranchName();
    if (branchName) {
      expect(typeof branchName).toBe("string");
      expect(branchName.length).toBeGreaterThan(0);
    } else {
      expect(branchName).toBeNull();
    }
  });

  it("should return null when not in git repository", async () => {
    const originalDir = process.cwd();
    process.chdir("/tmp");
    try {
      const branchName = await getCurrentBranchName();
      expect(branchName).toBeNull();
    } finally {
      process.chdir(originalDir);
    }
  });

  it("should handle git errors gracefully", async () => {
    expect(async () => {
      await getCurrentBranchName();
    }).not.toThrow();
  });

  it("should return a string that could be validated", async () => {
    const branchName = await getCurrentBranchName();
    if (branchName) {
      const isValid = validateBranchName(branchName);
      expect(typeof isValid).toBe("boolean");
    }
  });
});

describe("integration tests", () => {
  describe("validateBranchName and validateWithDetails consistency", () => {
    it("should return consistent results between the two functions", () => {
      const testCases = ["feature/login", "fix/bug", "invalid-branch", "main"];

      testCases.forEach((branch) => {
        const isValid = validateBranchName(branch);
        const detailedResult = validateWithDetails(branch);
        expect(detailedResult.valid).toBe(isValid);
      });
    });

    it("should have same behavior with custom patterns", () => {
      const customPattern = "^(story/.+)$";
      const testCases = ["story/US-123", "feature/login", "invalid"];

      testCases.forEach((branch) => {
        const isValid = validateBranchName(branch, { customRegexp: customPattern });
        const detailedResult = validateWithDetails(branch, { customRegexp: customPattern });
        expect(detailedResult.valid).toBe(isValid);
      });
    });
  });

  describe("common real-world scenarios", () => {
    it("should validate standard feature branch naming", () => {
      const standardFeatureBranches = [
        "feature/add-user-auth",
        "feature/123-implement-login",
        "feature/ISSUE-456-create-dashboard",
        "feature/US-789-update-profile",
      ];
      standardFeatureBranches.forEach((branch) => {
        expect(validateBranchName(branch)).toBe(true);
        expect(validateWithDetails(branch).valid).toBe(true);
      });
    });

    it("should validate standard fix branch naming", () => {
      const standardFixBranches = [
        "fix/fix-memory-leak",
        "fix/123-resolve-login-bug",
        "fix/ISSUE-456-correct-validation",
        "fix/US-789-patch-security",
      ];
      standardFixBranches.forEach((branch) => {
        expect(validateBranchName(branch)).toBe(true);
        expect(validateWithDetails(branch).valid).toBe(true);
      });
    });

    it("should validate standard release branch naming", () => {
      const standardReleaseBranches = [
        "release/v1.0.0",
        "release/v2.1.0",
        "release/v0.9.0",
        "release/v3.0.0-beta",
      ];
      standardReleaseBranches.forEach((branch) => {
        expect(validateBranchName(branch)).toBe(true);
        expect(validateWithDetails(branch).valid).toBe(true);
      });
    });

    it("should reject commonly mistaken branch names", () => {
      const mistakenBranches = [
        "story/US-123",
        "bugfix/123",
        "chore/update-deps",
        "refactor/cleanup",
        "test/add-tests",
        "docs/update-readme",
        "feat/login",
        "featx/login",
        "feture/login",
      ];
      mistakenBranches.forEach((branch) => {
        expect(validateBranchName(branch)).toBe(false);
        expect(validateWithDetails(branch).valid).toBe(false);
      });
    });
  });
});
