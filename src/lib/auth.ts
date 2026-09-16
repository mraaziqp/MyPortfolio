/**
 * API Key Validation Middleware & Authentication Utilities
 * Secures bi-directional data ingestion and export endpoints between
 * the portfolio and external applications (Emeron CV Parser, LifeStack).
 */

import { timingSafeEqual } from 'crypto';

export interface ApiAuthResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
  clientId?: string;
}

/**
 * Validates incoming API request authorization against the portfolio's secret API key.
 * Checks for API keys passed via:
 * 1. Authorization: Bearer <API_KEY>
 * 2. x-api-key: <API_KEY>
 * 3. x-emeron-key: <API_KEY>
 */
export function validateApiKey(requestHeaders: Headers | Record<string, string | string[] | undefined>): ApiAuthResult {
  const configuredSecret = process.env.PORTFOLIO_API_KEY || process.env.CV_SYNC_SECRET_KEY;

  if (!configuredSecret) {
    console.error('[API Auth] PORTFOLIO_API_KEY is not configured in server environment variables.');
    return {
      isValid: false,
      error: 'API Authentication is misconfigured on the server.',
      statusCode: 500,
    };
  }

  // Extract key from headers
  let incomingKey: string | null = null;

  if (requestHeaders instanceof Headers) {
    const authHeader = requestHeaders.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      incomingKey = authHeader.substring(7).trim();
    } else {
      incomingKey =
        requestHeaders.get('x-api-key') ||
        requestHeaders.get('x-emeron-key') ||
        requestHeaders.get('x-client-secret');
    }
  } else {
    const authHeader = requestHeaders['authorization'];
    const authHeaderStr = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (authHeaderStr && authHeaderStr.toLowerCase().startsWith('bearer ')) {
      incomingKey = authHeaderStr.substring(7).trim();
    } else {
      const apiKeyHeader = requestHeaders['x-api-key'] || requestHeaders['x-emeron-key'] || requestHeaders['x-client-secret'];
      incomingKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader || null;
    }
  }

  if (!incomingKey) {
    return {
      isValid: false,
      error: 'Unauthorized: Missing API key in Authorization (Bearer) or x-api-key header.',
      statusCode: 401,
    };
  }

  // Timing-safe constant-time string comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(configuredSecret, 'utf-8');
    const providedBuffer = Buffer.from(incomingKey, 'utf-8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return {
        isValid: false,
        error: 'Forbidden: Invalid API key credentials provided.',
        statusCode: 403,
      };
    }

    const matches = timingSafeEqual(expectedBuffer, providedBuffer);
    if (!matches) {
      return {
        isValid: false,
        error: 'Forbidden: Invalid API key credentials provided.',
        statusCode: 403,
      };
    }

    return {
      isValid: true,
      clientId: 'emeron-cv-parser-service',
    };
  } catch (err) {
    return {
      isValid: false,
      error: 'Authentication verification failure.',
      statusCode: 403,
    };
  }
}

/**
 * Next.js App Router Helper for Route Handlers (app/api/*)
 * Returns a standardized JSON Response when unauthorized, or null when authorized.
 */
export function enforceApiKeyAuth(request: Request): Response | null {
  const auth = validateApiKey(request.headers);
  if (!auth.isValid) {
    return new Response(
      JSON.stringify({
        success: false,
        error: auth.error,
        code: auth.statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
        timestamp: new Date().toISOString(),
      }),
      {
        status: auth.statusCode || 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer error="invalid_token"',
        },
      }
    );
  }
  return null;
}
