import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CartSettingParams,
  CartSettingParamsSchema,
  type CartSettingUpdateParams,
  CartSettingUpdateParamsSchema,
  type CountProductCartsParams,
  CountProductCartsParamsSchema,
  type ListCarts,
  ListCartsSchema,
  type ListProductCartsParams,
  ListProductCartsParamsSchema,
} from "@/schemas/cart.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CartItem,
  CartListResponse,
  CartSetting,
  CountProductCartsResponse,
  ListProductCartsResponse,
  ProductCart,
} from "@/types/index.js";

async function cafe24_get_cart_setting(params: CartSettingParams) {
  try {
    const queryParams: Record<string, unknown> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/carts/setting", "GET", undefined, queryParams);
    const responseData = data as { cart?: Record<string, unknown> } | Record<string, unknown>;
    const cart = (responseData.cart || responseData) as CartSetting;

    const actionTypeMap: Record<string, string> = {
      M: "Go to cart page",
      S: "Show selection popup",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Cart Settings (Shop #${cart.shop_no || 1})\n\n` +
            `- **Wishlist Display**: ${cart.wishlist_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Add Action Type**: ${actionTypeMap[cart.add_action_type || ""] || cart.add_action_type}\n` +
            `- **Direct Purchase**: ${cart.cart_item_direct_purchase === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Storage Period**: ${cart.storage_period === "T" ? `${cart.period} days` : "Not set"}\n` +
            `- **Icon Display**: ${cart.icon_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Option Change**: ${cart.cart_item_option_change === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Discount Display**: ${cart.discount_display === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: cart.shop_no ?? 1,
        wishlist_display: cart.wishlist_display,
        add_action_type: cart.add_action_type,
        cart_item_direct_purchase: cart.cart_item_direct_purchase,
        storage_period: cart.storage_period,
        period: cart.period,
        icon_display: cart.icon_display,
        cart_item_option_change: cart.cart_item_option_change,
        discount_display: cart.discount_display,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_cart_setting(params: CartSettingUpdateParams) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, unknown> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/carts/setting", "PUT", requestBody);
    const responseData = data as { cart?: Record<string, unknown> } | Record<string, unknown>;
    const cart = (responseData.cart || responseData) as CartSetting;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Cart Settings Updated (Shop #${cart.shop_no || 1})\n\n` +
            `- **Wishlist Display**: ${cart.wishlist_display === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Storage Period**: ${cart.storage_period === "T" ? `${cart.period} days` : "Not set"}\n` +
            `- **Discount Display**: ${cart.discount_display === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: cart.shop_no ?? 1,
        wishlist_display: cart.wishlist_display,
        add_action_type: cart.add_action_type,
        cart_item_direct_purchase: cart.cart_item_direct_purchase,
        storage_period: cart.storage_period,
        period: cart.period,
        icon_display: cart.icon_display,
        cart_item_option_change: cart.cart_item_option_change,
        discount_display: cart.discount_display,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_carts(params: ListCarts) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<CartListResponse>(
      "/admin/carts",
      "GET",
      undefined,
      { shop_no, ...queryParams },
      requestHeaders,
    );

    const carts = data.carts || [];

    if (carts.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No cart items found for the given criteria." }],
        structuredContent: { carts: [] },
      };
    }

    const summary = carts
      .map((item: CartItem) => {
        const options = item.additional_option_values
          .map((opt) => `- **${opt.name}**: ${opt.value}`)
          .join("\n");

        return (
          `#### Basket Product No: ${item.basket_product_no}\n` +
          `- **Member ID**: ${item.member_id}\n` +
          `- **Product No**: ${item.product_no}\n` +
          `- **Variant Code**: ${item.variant_code}\n` +
          `- **Price**: ${item.product_price} (Option: ${item.option_price})\n` +
          `- **Quantity**: ${item.quantity}\n` +
          `- **Category**: ${item.category_no}\n` +
          `- **Shipping**: ${item.shipping_type === "A" ? "Domestic" : "Overseas"}\n` +
          `- **Set Product**: ${item.product_bundle === "T" ? "Yes" : "No"}\n` +
          `- **Created**: ${item.created_date}` +
          (options ? `\n**Options**:\n${options}` : "")
        );
      })
      .join("\n\n---\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `## Cart Items List\n\n${summary}`,
        },
      ],
      structuredContent: { carts },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_product_carts(params: ListProductCartsParams) {
  try {
    const { product_no, ...queryParams } = params;
    const data = await makeApiRequest<ListProductCartsResponse>(
      `/admin/products/${product_no}/carts`,
      "GET",
      undefined,
      queryParams,
    );
    const carts = data.carts || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${carts.length} members who have product #${product_no} in their cart\n\n` +
            carts
              .map(
                (c: ProductCart) =>
                  `- Member ID: ${c.member_id}\n` +
                  `  Variant: ${c.variant_code}\n` +
                  `  Quantity: ${c.quantity}\n` +
                  `  Added Date: ${c.created_date}`,
              )
              .join("\n\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_count_product_carts(params: CountProductCartsParams) {
  try {
    const { product_no, shop_no } = params;
    const data = await makeApiRequest<CountProductCartsResponse>(
      `/admin/products/${product_no}/carts/count`,
      "GET",
      undefined,
      { shop_no },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `The product #${product_no} is currently in ${data.count} shopping carts.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_cart_setting",
    {
      title: "Get Cafe24 Cart Settings",
      description:
        "Retrieve cart settings including wishlist display, add action type, direct purchase, storage period, icon display, option change, and discount display.",
      inputSchema: CartSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_cart_setting,
  );

  server.registerTool(
    "cafe24_update_cart_setting",
    {
      title: "Update Cafe24 Cart Settings",
      description:
        "Update cart settings including wishlist display, add action type (M=go to cart, S=selection popup), direct purchase, storage period (1-10, 14, or 30 days), icon display, option change, and discount display.",
      inputSchema: CartSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_cart_setting,
  );

  server.registerTool(
    "cafe24_list_carts",
    {
      title: "List Cart Items",
      description: "Retrieve a list of items currently in customers' carts.",
      inputSchema: ListCartsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_carts,
  );

  server.registerTool(
    "cafe24_list_product_carts",
    {
      title: "List Product Carts",
      description: "Retrieve a list of members who have a specific product in their cart.",
      inputSchema: ListProductCartsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_product_carts,
  );

  server.registerTool(
    "cafe24_count_product_carts",
    {
      title: "Count Product Carts",
      description: "Retrieve the number of members who have a specific product in their cart.",
      inputSchema: CountProductCartsParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_product_carts,
  );
}
