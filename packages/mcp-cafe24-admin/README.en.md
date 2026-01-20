# mcp-cafe24-admin

> MCP server for Cafe24 Admin API - comprehensive integration with all 19 API sections

[![npm version](https://img.shields.io/npm/v/mcp-cafe24-admin.svg)](https://www.npmjs.org/package/mcp-cafe24-admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English** | [한국어](./README.md)

## Overview

`mcp-cafe24-admin` is a comprehensive MCP (Model Context Protocol) server that provides tools for interacting with the Cafe24 Admin API. It covers all 19 major API sections:

1. **Store** - Users, Shops, Store settings
2. **Product** - Products, Categories, Product details
3. **Order** - Orders, Order management
4. **Customer** - Customers, Customer management
5. **Boards** - Community boards
6. **Themes** - Design themes
7. **Promotion** - Benefits, Coupons
8. **Apps** - Applications
9. **Category** - Product categories, Collections
10. **Collection** - Brands, Classifications, Manufacturers
11. **Supply** - Suppliers, Suppliers management
12. **Shipping** - Carriers, Shipping settings
13. **Salesreport** - Daily/Monthly sales reports
14. **Personal** - Carts, Wishlist, Personal settings
15. **Privacy** - Customer privacy settings
16. **Mileage** - Points, Mileage management
17. **Notification** - Automated emails, SMS, invitations
18. **Translation** - Store and product translations
19. **Analytics** - Daily visits, access analytics

## Installation

### Prerequisites

- Node.js 24 or higher
- `CAFE24_MALL_ID` environment variable (required) - Your Cafe24 mall ID
- `CAFE24_ACCESS_TOKEN` environment variable (only for direct token, not recommended)
- **OAuth (recommended)**: `CAFE24_CLIENT_ID`, `CAFE24_CLIENT_SECRET` environment variables (automatic token refresh)

### Getting Access Token

Cafe24 uses OAuth 2.0 Bearer tokens. In production, the OAuth server flow is recommended. Direct token usage should be limited to quick testing.

#### Option 1: Set Access Token Directly (Not Recommended)

```bash
export CAFE24_ACCESS_TOKEN=your_access_token_here
```

#### Option 2: OAuth Automatic Flow (Recommended)

Set `CAFE24_CLIENT_ID` and `CAFE24_CLIENT_SECRET` to enable the OAuth flow. The server will guide you through the authorization URL and handle token refresh.

Refer to [Cafe24 Authentication Documentation](https://developers.cafe24.com/docs/en/api/admin/#authentication) for detailed instructions.

### Install

```bash
npm install -g mcp-cafe24-admin
```

### Environment Variables

```bash
export CAFE24_MALL_ID=your_mall_id
export CAFE24_CLIENT_ID=your_client_id
export CAFE24_CLIENT_SECRET=your_client_secret
```

Only when using a direct token:

```bash
export CAFE24_ACCESS_TOKEN=your_access_token
```

Or create a `.env` file:

```bash
CAFE24_MALL_ID=your_mall_id
CAFE24_CLIENT_ID=your_client_id
CAFE24_CLIENT_SECRET=your_client_secret
```

Only when using a direct token:

```bash
CAFE24_ACCESS_TOKEN=your_access_token
```

#### OAuth Callback Settings

```bash
export CAFE24_OAUTH_REDIRECT_BASE_URL=https://mcp-cafe24-admin.vercel.app
export CAFE24_OAUTH_LOCAL_BRIDGE_URL=http://localhost:8787/cafe24/oauth/callback
export CAFE24_OAUTH_LISTEN_PORT=8787
```

The default remote callback path is `/api/auth/callback/cafe24`. Use `CAFE24_OAUTH_REMOTE_PATH` to override it.

#### OAuth Optional Variables

```bash
export CAFE24_CLIENT_ID=your_client_id
export CAFE24_CLIENT_SECRET=your_client_secret
export CAFE24_OAUTH_SCOPE=mall.read_application,mall.write_application
export CAFE24_OAUTH_STATE=your_state
export CAFE24_OAUTH_REMOTE_PATH=/api/auth/callback/cafe24
```

The default `CAFE24_OAUTH_SCOPE` is `mall.read_application,mall.write_application`. To change the local callback path, set `CAFE24_REDIRECT_PATH`.

## Available Tools

### Store Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_users` | List admin users with filtering and pagination |
| `cafe24_list_shops` | List shops with filtering and pagination |
| `cafe24_get_store` | Get detailed store information |

### Product Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_products` | List products with extensive filtering options |
| `cafe24_get_product` | Get detailed product information |
| `cafe24_create_product` | Create new product |
| `cafe24_update_product` | Update existing product |
| `cafe24_delete_product` | Delete product |
| `cafe24_list_categories` | List product categories |

### Order Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_orders` | List orders with extensive filtering |
| `cafe24_get_order` | Get detailed order information |
| `cafe24_update_order_status` | Update order status |

### Customer Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_customers` | List customers with filtering |
| `cafe24_get_customer` | Get detailed customer information |

### Board/Community Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_boards` | List community boards |
| `cafe24_get_board` | Get board details |

### Promotion Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_coupons` | List benefits/coupons |
| `cafe24_get_coupon` | Get coupon details |
| `cafe24_create_coupon` | Create new coupon |

### Themes/Design Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_themes` | List design themes |

### Supply/Shipping Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_list_suppliers` | List suppliers |

### Sales Report Section

| Tool Name | Description |
|------------|-------------|
| `cafe24_get_daily_sales` | Get daily sales reports |
| `cafe24_get_points` | Get point/mileage transactions |

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Run server
npm start
```

## Usage

### MCP Client Configuration Example

The example below follows Claude Desktop's configuration format. Most MCP clients (e.g., Cursor, Continue, Windsurf, VS Code MCP extensions) accept the same `command`/`args`/`env` structure.

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

Only add `CAFE24_ACCESS_TOKEN` when you are using a direct token.

## API Coverage

This MCP server provides comprehensive coverage of the Cafe24 Admin API with tools for the most common operations across all 19 sections. Each tool includes:

- **Zod schemas** for input validation
- **Comprehensive error handling** with actionable messages
- **Pagination support** for list operations
- **Structured output** with both text and JSON formats
- **Annotations** (readOnly, destructive, idempotent, openWorld hints)

## Authentication

The Cafe24 Admin API uses OAuth 2.0 Bearer tokens. The server automatically adds the `Authorization: Bearer {token}` header to all API requests.

## Error Handling

The server provides clear, actionable error messages for common scenarios:

- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Invalid or expired access token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **422 Unprocessable Entity** - Validation errors
- **429 Rate Limit** - Too many requests, please wait
- **500 Internal Server Error** - Temporary error, try again later
- **503 Service Unavailable** - Server temporarily unavailable
- **504 Gateway Timeout** - Request timed out

## License

MIT

## Links

- [Cafe24 Admin API Documentation](https://developers.cafe24.com/docs/en/api/admin/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
