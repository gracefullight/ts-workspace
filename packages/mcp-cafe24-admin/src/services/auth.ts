import http from "node:http";
import { URL } from "node:url";
import axios, { type AxiosError } from "axios";

interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
}

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
}

// Token storage (in-memory for simplicity)
let tokenData: TokenData | null = null;
let authorizationCode: string | null = process.env.CAFE24_AUTHORIZATION_CODE ?? null;
let callbackServer: http.Server | null = null;
let callbackPromise: Promise<string> | null = null;
let authorizeUrl: string | null = null;
let redirectUri: string | null = null;

function buildBasicAuthHeader(clientId: string, clientSecret: string): string {
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${encoded}`;
}

function storeTokenData(data: OAuthTokenResponse, fallbackRefreshToken?: string) {
  const expiresIn = data.expires_in ?? data.expires_at;
  const expiresAt = expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined;

  tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? fallbackRefreshToken,
    expires_at: expiresAt,
    expires_in: expiresIn,
  };
}

function resolveCallbackListenPort(): number {
  const configured = process.env.CAFE24_OAUTH_LISTEN_PORT;
  if (configured) {
    const parsed = Number(configured);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 8787;
}

function buildAuthorizeUrl(mallId: string, clientId: string, redirectUri: string): string {
  const scope =
    process.env.CAFE24_OAUTH_SCOPE?.trim() || "mall.read_application,mall.write_application";

  const authorizeUrl = new URL(`https://${mallId}.cafe24api.com/api/v2/oauth/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);

  const state = process.env.CAFE24_OAUTH_STATE?.trim();
  if (state) {
    authorizeUrl.searchParams.set("state", state);
  }

  return authorizeUrl.toString();
}

function resolveLocalRedirectPath(): string {
  return process.env.CAFE24_REDIRECT_PATH?.trim() || "/cafe24/oauth/callback";
}

function resolveRemoteRedirectPath(localPath: string): string {
  const configured = process.env.CAFE24_OAUTH_REMOTE_PATH?.trim();
  if (configured) {
    return configured;
  }

  if (process.env.CAFE24_OAUTH_REDIRECT_BASE_URL?.trim()) {
    return "/api/auth/callback/cafe24";
  }

  return localPath;
}

async function resolveCallbackBaseUrl(): Promise<string> {
  const configured = process.env.CAFE24_OAUTH_REDIRECT_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const port = resolveCallbackListenPort();
  return `http://localhost:${port}`;
}

function resolveRedirectUri(redirectPath: string): Promise<string> {
  return resolveCallbackBaseUrl().then((baseUrl) => `${baseUrl}${redirectPath}`);
}

async function getRedirectUri(redirectPath: string): Promise<string> {
  redirectUri = await resolveRedirectUri(redirectPath);
  return redirectUri;
}

function getLocalBridgeUrl(port: number, redirectPath: string): string {
  const baseUrl = process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL?.trim() || `http://localhost:${port}`;
  return `${baseUrl.replace(/\/$/, "")}${redirectPath}`;
}

async function waitForAuthorizationCode(
  mallId: string,
  clientId: string,
  redirectPath: string,
  expectedState?: string,
): Promise<string> {
  if (authorizationCode) {
    return authorizationCode;
  }

  if (callbackPromise) {
    return callbackPromise;
  }

  const port = resolveCallbackListenPort();

  callbackPromise = new Promise((resolve, reject) => {
    callbackServer = http.createServer((req, res) => {
      if (!req.url) {
        res.statusCode = 400;
        res.end("Missing request URL");
        return;
      }

      const requestUrl = new URL(req.url, `http://localhost:${port}`);
      if (requestUrl.pathname !== redirectPath) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }

      const error = requestUrl.searchParams.get("error");
      if (error) {
        res.statusCode = 400;
        res.end(`Authorization failed: ${error}`);
        callbackServer?.close();
        callbackServer = null;
        callbackPromise = null;
        reject(new Error(`Authorization failed: ${error}`));
        return;
      }

      const state = requestUrl.searchParams.get("state");
      if (expectedState && state !== expectedState) {
        res.statusCode = 400;
        res.end("Invalid state parameter");
        return;
      }

      const code = requestUrl.searchParams.get("code");
      if (!code) {
        res.statusCode = 400;
        res.end("Missing authorization code");
        return;
      }

      authorizationCode = code;
      res.statusCode = 200;
      res.end("Authorization code received. You can close this window.");

      callbackServer?.close();
      callbackServer = null;
      callbackPromise = null;
      resolve(code);
    });

    callbackServer.listen(port, () => {
      const localBridgeUrl = getLocalBridgeUrl(port, redirectPath);
      callbackServer?.emit("ready", authorizeUrl);
      console.log(`Cafe24 OAuth local bridge URL: ${localBridgeUrl}`);

      setTimeout(
        () => {
          if (!authorizationCode) {
            callbackServer?.close();
            callbackServer = null;
            callbackPromise = null;
            reject(new Error("Timed out waiting for authorization code"));
          }
        },
        5 * 60 * 1000,
      );
    });

    callbackServer.on("error", (error) => {
      callbackServer = null;
      callbackPromise = null;
      reject(error);
    });
  });

  return callbackPromise;
}

export async function exchangeAuthorizationCode(
  mallId: string,
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<OAuthTokenResponse> {
  const tokenUrl = `https://${mallId}.cafe24api.com/api/v2/oauth/token`;

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: buildBasicAuthHeader(clientId, clientSecret),
        },
        timeout: 30000,
      },
    );

    const data = response.data as OAuthTokenResponse;
    storeTokenData(data);
    authorizationCode = null;

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 400:
            throw new Error("Bad Request: Invalid authorization code or redirect URI");
          case 401:
            throw new Error("Unauthorized: Invalid client ID or client secret");
          case 403:
            throw new Error("Forbidden: Access denied");
          default:
            throw new Error(`OAuth token exchange failed with status ${status}`);
        }
      } else {
        throw new Error("Network error during OAuth token exchange");
      }
    }
    throw error;
  }
}

/**
 * Refresh access token using refresh_token
 */
export async function refreshToken(
  mallId: string,
  clientId: string,
  clientSecret: string,
  refreshTokenValue: string,
): Promise<OAuthTokenResponse> {
  if (!tokenData?.refresh_token) {
    throw new Error("No refresh token available. Please authenticate using authorization code.");
  }

  const tokenUrl = `https://${mallId}.cafe24api.com/api/v2/oauth/token`;

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshTokenValue,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: buildBasicAuthHeader(clientId, clientSecret),
        },
        timeout: 30000,
      },
    );

    const data = response.data as OAuthTokenResponse;
    storeTokenData(data, refreshTokenValue);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error("Invalid or expired refresh token. Please authenticate again.");
      }
    }
    throw new Error("Failed to refresh token");
  }
}

/**
 * Get cached access token or obtain new one via OAuth
 */
export async function getAccessToken(
  mallId: string,
  clientId?: string,
  clientSecret?: string,
): Promise<string> {
  // Direct token from environment (no OAuth)
  if (!clientId || !clientSecret) {
    const token = process.env.CAFE24_ACCESS_TOKEN;
    if (!token) {
      throw new Error("CAFE24_ACCESS_TOKEN environment variable is required");
    }
    return token;
  }

  // OAuth flow
  try {
    const token = process.env.CAFE24_ACCESS_TOKEN;

    if (token) {
      return token;
    }

    if (tokenData?.access_token && !isTokenExpired(tokenData)) {
      return tokenData.access_token;
    }

    if (tokenData?.refresh_token) {
      const newTokens = await refreshToken(mallId, clientId, clientSecret, tokenData.refresh_token);
      return newTokens.access_token;
    }

    const localRedirectPath = resolveLocalRedirectPath();
    const expectedState = process.env.CAFE24_OAUTH_STATE?.trim();
    if (!authorizeUrl) {
      const remoteRedirectPath = resolveRemoteRedirectPath(localRedirectPath);
      const resolvedRedirectUri = await getRedirectUri(remoteRedirectPath);
      authorizeUrl = buildAuthorizeUrl(mallId, clientId, resolvedRedirectUri);
      console.log(`Cafe24 OAuth redirect URI: ${resolvedRedirectUri}`);
      console.log(`Cafe24 OAuth authorize URL: ${authorizeUrl}`);
    }

    const code = await waitForAuthorizationCode(mallId, clientId, localRedirectPath, expectedState);
    const finalRedirectUri = redirectUri ?? (await getRedirectUri(localRedirectPath));
    const tokens = await exchangeAuthorizationCode(
      mallId,
      clientId,
      clientSecret,
      code,
      finalRedirectUri,
    );

    return tokens.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        tokenData = null;
        authorizationCode = null;
        const localRedirectPath = resolveLocalRedirectPath();
        const expectedState = process.env.CAFE24_OAUTH_STATE?.trim();
        if (!authorizeUrl) {
          const remoteRedirectPath = resolveRemoteRedirectPath(localRedirectPath);
          const resolvedRedirectUri = await getRedirectUri(remoteRedirectPath);
          authorizeUrl = buildAuthorizeUrl(mallId, clientId, resolvedRedirectUri);
          console.log(`Cafe24 OAuth redirect URI: ${resolvedRedirectUri}`);
          console.log(`Cafe24 OAuth authorize URL: ${authorizeUrl}`);
        }
        const code = await waitForAuthorizationCode(
          mallId,
          clientId,
          localRedirectPath,
          expectedState,
        );
        const finalRedirectUri = redirectUri ?? (await getRedirectUri(localRedirectPath));
        const newTokens = await exchangeAuthorizationCode(
          mallId,
          clientId,
          clientSecret,
          code,
          finalRedirectUri,
        );

        return newTokens.access_token;
      }
    }
    throw error;
  }
}

/**
 * Check if token is expired (simple check)
 */
function isTokenExpired(data: TokenData | null): boolean {
  if (!data?.expires_in) {
    return false;
  }

  const expirationTime = data.expires_in || data.expires_in;
  const now = Date.now() / 1000; // Convert to seconds
  const expiresAt = data.expires_at || now + expirationTime;

  return now >= expiresAt;
}

/**
 * Get current token data (for debugging)
 */
export function getTokenData(): TokenData | null {
  return tokenData;
}
