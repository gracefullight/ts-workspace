# @gracefullight/validate-branch

> 커스텀 정규식을 지원하는 Git 브랜치 이름 유효성 검사 도구

[![npm version](https://img.shields.io/npm/v/@gracefullight/validate-branch.svg)](https://www.npmjs.com/package/@gracefullight/validate-branch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | **한국어**

## 주요 기능

- **유연한 정규식 패턴** - 기본 패턴 또는 커스텀 정규식 사용
- **현재 브랜치 감지** - Git 저장소에서 현재 브랜치 이름 자동 감지
- **설정 파일 지원** - `branch.config.{ts,js,mjs}` 파일에서 패턴 로드
- **CLI 도구** - 명령줄에서 직접 사용 가능
- **상세한 오류 메시지** - 실패 시 명확한 오류 설명 제공
- **타입스크립트 지원** - 완전한 TypeScript 타입 정의

## 기본 패턴

기본적으로 다음 브랜치 이름이 허용됩니다:

- `main` / `master` - 메인 브랜치
- `develop` / `stage` - 개발/스테이지 브랜치
- `feature/.*` - 기능 브랜치 (예: `feature/login`, `feature/user-auth`)
- `fix/.*` - 버그 수정 브랜치 (예: `fix/memory-leak`, `fix/typo`)
- `hotfix/.*` - 핫픽스 브랜치 (예: `hotfix/critical-bug`)
- `release/.*` - 릴리스 브랜치 (예: `release/v1.0.0`)

## 설치

```bash
# pnpm 사용
pnpm add @gracefullight/validate-branch

# npm 사용
npm install @gracefullight/validate-branch

# yarn 사용
yarn add @gracefullight/validate-branch
```

## 사용법

### CLI 사용

```bash
# 현재 브랜치 검증
npx validate-branch

# 특정 브랜치 검증
npx validate-branch --test feature/new-feature

# 커스텀 정규식 사용
npx validate-branch --regexp "^(main|develop|feature/.+)$"
```

### 프로그래밍 방식 사용

#### 기본 패턴으로 검증

```typescript
import { validateBranchName, validateWithDetails } from "@gracefullight/validate-branch";

// 간단한 boolean 반환
const isValid = validateBranchName("feature/new-component");
console.log(isValid); // true

// 상세한 결과 반환
const result = validateWithDetails("feature/new-component");
console.log(result);
// { valid: true, branchName: "feature/new-component" }
```

#### 커스텀 정규식 사용

```typescript
import { validateBranchName } from "@gracefullight/validate-branch";

const customPattern = "^(main|develop|story/.+|bugfix/.+)$";
const isValid = validateBranchName("story/US-123-add-user", { customRegexp: customPattern });
console.log(isValid); // true
```

#### 현재 브랜치 이름 가져오기

```typescript
import { getCurrentBranchName } from "@gracefullight/validate-branch";

const currentBranch = await getCurrentBranchName();
console.log(currentBranch); // "feature/new-component" 또는 null
```

#### 설정 파일 로드

```typescript
import { loadConfig } from "@gracefullight/validate-branch";

const config = await loadConfig();
console.log(config);
// {
//   pattern: "^(main|develop|feature/.+)$",
//   description: "프로젝트 브랜치 네이밍 규칙"
// }
```

## 설정 파일

프로젝트 루트에 `branch.config.ts` 또는 `branch.config.js` 파일을 생성하여 커스텀 패턴을 정의하세요.

### TypeScript 설정 (`branch.config.ts`)

```typescript
import type { Config } from "@gracefullight/validate-branch";

const config: Config = {
  pattern: "^(main|develop|feature/.+|fix/.+|refactor/.+)$",
  description: "프로젝트 브랜치 네이밍 규칙",
};

export default config;
```

### JavaScript 설정 (`branch.config.js`)

```javascript
module.exports = {
  pattern: "^(main|develop|feature/.+|fix/.+)$",
  description: "프로젝트 브랜치 네이밍 규칙",
};
```

### 프리셋 사용 (`branch.config.ts`)

커스텀 패턴 대신 내장 프리셋을 사용할 수 있습니다.

```typescript
import type { Config } from "@gracefullight/validate-branch";

const config: Config = {
  preset: "jira", // "gitflow" 또는 "jira"
  description: "JIRA 티켓 기반 브랜치 네이밍",
};

export default config;
```

**사용 가능한 프리셋:**

#### `gitflow` (기본값)

Git Flow 브랜치 전략을 따르는 패턴입니다.

| 상태 | 브랜치 예시 |
|------|------------|
| ✅ 허용 | `main`, `master`, `develop`, `stage` |
| ✅ 허용 | `feature/login`, `feature/user-auth`, `feature/add-payment` |
| ✅ 허용 | `fix/memory-leak`, `fix/typo`, `fix/null-pointer` |
| ✅ 허용 | `hotfix/critical-bug`, `hotfix/security-patch` |
| ✅ 허용 | `release/v1.0.0`, `release/2.3.1` |
| ❌ 거부 | `login`, `bugfix`, `my-branch` (prefix 없음) |
| ❌ 거부 | `feature/`, `fix/` (이름 없음) |
| ❌ 거부 | `Feature/Login`, `FIX/bug` (대문자 prefix) |

#### `jira`

JIRA 티켓 번호 기반 브랜치 패턴입니다.

| 상태 | 브랜치 예시 |
|------|------------|
| ✅ 허용 | `main`, `master`, `develop`, `stage` |
| ✅ 허용 | `FEATURE-123`, `FEATURE-1`, `FEATURE-99999` |
| ✅ 허용 | `BUG-456`, `STORY-789`, `TASK-101`, `HOTFIX-202` |
| ❌ 거부 | `feature/login` (gitflow 스타일) |
| ❌ 거부 | `FEATURE-ABC` (숫자 아님) |
| ❌ 거부 | `feature-123` (소문자) |
| ❌ 거부 | `JIRA-123/description` (슬래시 포함) |

## API 레퍼런스

### `validateBranchName(branchName, options?)`

브랜치 이름이 유효한지 확인합니다.

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

**매개변수:**
- `branchName`: 검증할 브랜치 이름
- `options`: 선택사항, 검증 옵션 객체
  - `customRegexp`: 커스텀 정규식 문자열
  - `preset`: 프리셋 패턴 (`gitflow` 또는 `jira`, 기본값: `gitflow`)

**반환값:** 유효 여부

---

### `validateWithDetails(branchName, options?)`

상세한 검증 결과를 반환합니다.

```typescript
function validateWithDetails(
  branchName: string,
  options?: ValidateBranchNameOptions
): ValidationResult
```

**반환값:**
```typescript
{
  valid: boolean;
  branchName: string;
  error?: string;  // 실패 시 오류 메시지
}
```

**예시:**
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

현재 Git 브랜치 이름을 가져옵니다.

```typescript
function getCurrentBranchName(): Promise<string | null>
```

**반환값:** 현재 브랜치 이름, Git 저장소가 아닌 경우 `null`

---

### `loadConfig()`

프로젝트 설정 파일을 로드합니다.

```typescript
function loadConfig(): Promise<Config | null>
```

**설정 파일 탐색 순서:**
1. `branch.config.ts`
2. `branch.config.mts`
3. `branch.config.js`
4. `branch.config.cjs`
5. `branch.config.mjs`

**반환값:** 설정 객체 또는 설정 파일이 없는 경우 `null`

---

## 타입 정의

### `Config`

```typescript
interface Config {
  pattern?: string;                    // 단일 정규식 패턴
  patterns?: string[];                 // 다중 정규식 패턴 (예정)
  preset?: "gitflow" | "jira";         // 프리셋 패턴 (기본값: "gitflow")
  description?: string;                // 설정 설명
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

## 예제

### Git Hooks와 함께 사용

#### `package.json`에서 husky 설정

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "validate-branch"
    }
  }
}
```

#### 직접 Git Hooks 사용

```bash
#!/bin/sh
# .git/hooks/pre-commit

npx validate-branch
if [ $? -ne 0 ]; then
  echo "브랜치 이름이 규칙에 맞지 않습니다."
  exit 1
fi
```

### GitHub Actions와 함께 사용

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

### CI/CD 파이프라인에서 사용

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

### ESLint 플러그인과 함께 사용

```javascript
// .eslintrc.js
const { execSync } = require("child_process");

module.exports = {
  // ... 기본 설정
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

## 개발

### 설정

```bash
# 저장소 클론
git clone https://github.com/gracefullight/saju.git
cd packages/validate-branch

# 의존성 설치
pnpm install

# 빌드
pnpm build

# 테스트
pnpm test

# 린트
pnpm lint

# 포맷
pnpm lint:fix
```

### 로컬에서 CLI 테스트

```bash
# 빌드 후 로컬에서 CLI 테스트
node bin/validate-branch.js --test feature/new-feature

# 커스텀 패턴 테스트
node bin/validate-branch.js --test invalid-name --regexp "^(main|develop)$"
```

## 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

1. 저장소 포크
2. feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 오픈

### 가이드라인

- 새 기능에 대한 테스트 작성
- 코드 커버리지 유지 또는 개선
- 기존 코드 스타일 따르기 (Biome으로 강제)
- 필요에 따라 문서 업데이트

## 라이선스

MIT © [gracefullight](https://github.com/gracefullight)

## 관련 프로젝트

- [isomorphic-git](https://isomorphic-git.org/) - Git 구현 라이브러리
- [Commander.js](https://commander.js/) - Node.js CLI 프레임워크
- [Chalk](https://chalk.js.org/) - 터미널 문자열 스타일링

## 지원

- [문서](https://github.com/gracefullight/saju#readme)
- [이슈 트래커](https://github.com/gracefullight/saju/issues)
- [토론](https://github.com/gracefullight/saju/discussions)
