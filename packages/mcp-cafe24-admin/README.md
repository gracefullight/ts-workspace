# mcp-cafe24-admin

> MCP server for Cafe24 Admin API - comprehensive integration with all 19 API sections

[![npm version](https://img.shields.io/npm/v/mcp-cafe24-admin.svg)](https://www.npmjs.org/package/mcp-cafe24-admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[한국어](./README.md)** | [English](./README.en.md)

## 개요

`mcp-cafe24-admin`은 Cafe24 Admin API를 위한 포괄적인 MCP(Model Context Protocol) 서버입니다. 다음 19개 주요 API 섹션을 모두 지원합니다:

1. **Store** - 사용자, 상점, 상점 설정
2. **Product** - 상품, 카테고리, 상품 상세
3. **Order** - 주문, 주문 관리
4. **Customer** - 고객, 고객 관리
5. **Boards** - 커뮤니티 게시판
6. **Themes** - 디자인 테마
7. **Promotion** - 혜택, 쿠폰
8. **Apps** - 애플리케이션
9. **Category** - 상품 카테고리, 컬렉션
10. **Collection** - 브랜드, 분류, 제조사
11. **Supply** - 공급사, 공급사 관리
12. **Shipping** - 배송, 배송 설정
13. **Salesreport** - 일일/월간 판매 보고서
14. **Personal** - 장바구니, 개인 설정
15. **Privacy** - 개인정보 설정
16. **Mileage** - 포인트, 마일리지 관리
17. **Notification** - 자동화 알림, SMS, 초대
18. **Translation** - 상점, 상품 번역
19. **Analytics** - 일일 방문수, 액세스 분석

## 설치

### 필수 조건

- Node.js 24 이상
- `CAFE24_MALL_ID` 환경 변수 (필수) - Cafe24 몰 ID
- `CAFE24_ACCESS_TOKEN` 환경 변수 (직접 토큰 설정 시 필요, 권장하지 않음)
- **OAuth (권장)**: `CAFE24_CLIENT_ID`, `CAFE24_CLIENT_SECRET` 환경 변수 (OAuth 자동 갱신 및 로컬 콜백 지원)

### 액세스 토큰 발급 방법

Cafe24은 OAuth 2.0 Bearer 토큰을 사용합니다. 운영 환경에서는 OAuth 서버 플로우를 권장하며, 직접 토큰 설정은 테스트용으로만 사용하는 것을 권장합니다.

#### 방법 1: 액세스 토큰 직접 설정 (권장하지 않음)

```bash
export CAFE24_ACCESS_TOKEN=your_access_token_here
```

#### 방법 2: OAuth 자동 인증 (권장)

`CAFE24_CLIENT_ID`와 `CAFE24_CLIENT_SECRET` 환경 변수를 설정하면 OAuth 인증을 통해 토큰을 자동으로 가져오고, 만료 시 갱신합니다.

장점:
- 토큰 만료 시 자동 갱신
- 로컬 콜백을 통한 인증 코드 수신

### 환경 변수

```bash
export CAFE24_MALL_ID=your_mall_id
export CAFE24_CLIENT_ID=your_client_id
export CAFE24_CLIENT_SECRET=your_client_secret
```

직접 토큰을 사용할 경우에만:

```bash
export CAFE24_ACCESS_TOKEN=your_access_token
```

또는 `.env` 파일 생성:

```bash
CAFE24_MALL_ID=your_mall_id
CAFE24_CLIENT_ID=your_client_id
CAFE24_CLIENT_SECRET=your_client_secret
```

직접 토큰을 사용할 경우에만:

```bash
CAFE24_ACCESS_TOKEN=your_access_token
```

#### OAuth 콜백 설정

```bash
export CAFE24_OAUTH_REDIRECT_BASE_URL=https://mcp-cafe24-admin.vercel.app
export CAFE24_OAUTH_LOCAL_BRIDGE_URL=http://localhost:8787/cafe24/oauth/callback
export CAFE24_OAUTH_LISTEN_PORT=8787
```

기본 원격 콜백 경로는 `/api/auth/callback/cafe24`입니다. 다른 경로를 쓰려면
`CAFE24_OAUTH_REMOTE_PATH`로 설정하세요.

#### OAuth 옵션 환경 변수

```bash
export CAFE24_CLIENT_ID=your_client_id
export CAFE24_CLIENT_SECRET=your_client_secret
export CAFE24_OAUTH_SCOPE=mall.read_application,mall.write_application
export CAFE24_OAUTH_STATE=your_state
export CAFE24_OAUTH_REMOTE_PATH=/api/auth/callback/cafe24
```

`CAFE24_OAUTH_SCOPE`의 기본값은 `mall.read_application,mall.write_application`입니다. 로컬 콜백 경로를 바꾸려면
`CAFE24_REDIRECT_PATH`를 설정하세요.

## 사용 가능한 도구

### Store 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_users` | 관리자 목록 조회 (필터링, 페이지네이션 지원) |
| `cafe24_list_shops` | 상점 목록 조회 (필터링, 페이지네이션 지원) |
| `cafe24_get_store` | 상점 상세 정보 조회 |
| `cafe24_update_store` | 상점 설정 업데이트 |

### Product 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_products` | 상품 목록 조회 (다양한 필터링 옵션: 상품번호, 코드, 카테고리, 가격, 판매상태, 표시상태) |
| `cafe24_get_product` | 상품 상세 정보 조회 |
| `cafe24_create_product` | 신규 상품 생성 |
| `cafe24_update_product` | 기존 상품 업데이트 |
| `cafe24_delete_product` | 상품 삭제 |
| `cafe24_list_categories` | 상품 카테고리 목록 조회 |

### Order 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_orders` | 주문 목록 조회 (다양한 필터링 옵션: 주문ID, 날짜범위, 주문상태, 고객정보 등) |
| `cafe24_get_order` | 주문 상세 정보 조회 |
| `cafe24_update_order_status` | 주문 상태 업데이트 |

### Customer 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_customers` | 고객 목록 조회 (필터링, 페이지네이션 지원) |
| `cafe24_get_customer` | 고객 상세 정보 조회 |

### Boards 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_boards` | 게시판 목록 조회 (필터링, 페이지네이션 지원) |
| `cafe24_get_board` | 게시판 상세 정보 조회 |

### Promotion 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_coupons` | 혜택/쿠폰 목록 조회 (필터링, 페이지네이션 지원) |
| `cafe24_get_coupon` | 쿠폰 상세 정보 조회 |
| `cafe24_create_coupon` | 신규 쿠폰 생성 |

### Themes 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_themes` | 디자인 테마 목록 조회 (페이지네이션 지원) |

### Supply 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_list_suppliers` | 공급사 목록 조회 (페이지네이션 지원) |

### Sales Report 섹션

| 도구 이름 | 설명 |
|------------|---------|
| `cafe24_get_daily_sales` | 일일 판매 보고서 조회 (날짜범위 지정 가능) |
| `cafe24_get_points` | 포인트/마일리지 거래 내역 조회 (날짜범위 지정 가능) |

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드
npm run dev

# 빌드
npm run build

# 서버 실행
npm start
```

## 사용법

### MCP 클라이언트 설정 예시

아래 예시는 Claude Desktop 설정 형식을 기준으로 합니다. 대부분의 MCP 클라이언트(예: Cursor, Continue, Windsurf, VS Code MCP 확장)에서도 같은 `command`/`args`/`env` 구조를 사용합니다.

```json
{
  "mcpServers": [
    {
      "command": "npx",
      "args": ["-y", "@gracefullight/mcp-cafe24-admin"],
      "env": {
        "CAFE24_MALL_ID": "your_mall_id",
        "CAFE24_CLIENT_ID": "your_client_id",
        "CAFE24_CLIENT_SECRET": "your_client_secret"
      }
    }
  ]
}
```

직접 토큰을 사용할 경우에만 `CAFE24_ACCESS_TOKEN`을 추가하세요.

## API 커버리지

이 MCP 서버는 Cafe24 Admin API의 가장 일반적인 작업을 수행하는 도구를 제공합니다. 각 도구는 다음을 포함합니다:

- **Zod 스키마** 입력값 검증
- **포괄적인 오류 처리** 조작 가능한 에러 메시지
- **페이지네이션 지원** 목록 작업
- **구조화된 출력** 텍스트 및 JSON 형식
- **어노테이션** (readOnly, destructive, idempotent, openWorld 힌트)

## 인증

Cafe24 Admin API는 OAuth 2.0 Bearer 토큰을 사용합니다. 서버가 모든 API 요청에 `Authorization: Bearer {token}` 헤더를 자동으로 추가합니다.

## 오류 처리

서버는 일반적인 시나리오에 대한 명확하고 조작 가능한 에러 메시지를 제공합니다:

- **400 잘못된 요청** - 잘못된 요청 파라미터
- **401 인증되지 않음** - 유효하지 않거나 만료된 액세스 토큰
- **403 금지됨** - 권한 부족 또는 접근 불가
- **404 찾을 수 없음** - 리소스를 찾을 수 없음
- **409 충돌** - 리소스가 이미 존재함
- **422 처리 불가** - 검증 오류
- **429 속도 제한** - 요청이 너무 많습니다. 잠시 후 다시 시도하세요
- **500 서버 오류** - 일시적인 오류입니다. 나중에 다시 시도하세요
- **503 서비스 불가** - 서버가 일시적으로 사용 불가
- **504 게이트웨이 타임아웃** - 요청이 시간 초과됨

## 라이선스

MIT

## 링크

- [Cafe24 Admin API 문서](https://developers.cafe24.com/docs/en/api/admin/)
- [MCP 프로토콜 명세서](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
