/**
 * API Key Validation Middleware & Authentication Utilities
 * Secures bi-directional data ingestion and export endpoints between
 * the portfolio, external applications (Emeron CV Parser, LifeStack),
 * and the Jarvis Second Brain Autonomous Assistant & Dashboard Manager.
 */

import { timingSafeEqual } from 'crypto';

export interface ApiAuthResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
  clientId?: string;
  role?: 'jarvis_master' | 'client_sync';
}

const DEFAULT_PORTFOLIO_KEY = 'mp_sec_live_9f83a2e1d74b6c80';
const DEFAULT_JARVIS_KEY = 'jrv_mp_master_9f83a2e1d74b6c80a52e1f4b';

/**
 * Validates incoming API request authorization against the portfolio's and Jarvis's keys.
 */
export function validateApiKey(
  requestHeaders: Headers | Record<string, string | string[] | undefined>,
  searchParams?: URLSearchParams
): ApiAuthResult {
  const configuredPortfolioKey = process.env.PORTFOLIO_API_KEY || DEFAULT_PORTFOLIO_KEY;
  const configuredJarvisKey = process.env.JARVIS_API_KEY || DEFAULT_JARVIS_KEY;

  // Extract key from headers or query parameters
  let incomingKey: string | null = null;

  if (requestHeaders instanceof Headers) {
    const authHeader = requestHeaders.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      incomingKey = authHeader.substring(7).trim();
    } else {
      incomingKey =
        requestHeaders.get('x-jarvis-key') ||
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
      const apiKeyHeader =
        requestHeaders['x-jarvis-key'] ||
        requestHeaders['x-api-key'] ||
        requestHeaders['x-emeron-key'] ||
        requestHeaders['x-client-secret'];
      incomingKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader || null;
    }
  }

  // Fallback to URL search parameters if provided
  if (!incomingKey && searchParams) {
    incomingKey = searchParams.get('jarvis_key') || searchParams.get('api_key') || searchParams.get('key');
  }

  if (!incomingKey) {
    return {
      isValid: false,
      error: 'Unauthorized: Missing API key in Authorization (Bearer), x-jarvis-key, or x-api-key header.',
      statusCode: 401,
    };
  }

  const incomingClean = incomingKey.trim();

  // Helper for timing-safe equality
  const safeCompare = (expected: string, provided: string): boolean => {
    try {
      const expectedBuf = Buffer.from(expected, 'utf-8');
      const providedBuf = Buffer.from(provided, 'utf-8');
      if (expectedBuf.length !== providedBuf.length) return false;
      return timingSafeEqual(expectedBuf, providedBuf);
    } catch {
      return false;
    }
  };

  // Check against Jarvis master key
  if (safeCompare(configuredJarvisKey, incomingClean)) {
    return {
      isValid: true,
      clientId: 'jarvis-second-brain-master',
      role: 'jarvis_master',
    };
  }

  // Check against Portfolio sync key (Emeron / LifeStack)
  if (safeCompare(configuredPortfolioKey, incomingClean)) {
    return {
      isValid: true,
      clientId: 'emeron-cv-sync-service',
      role: 'client_sync',
    };
  }

  return {
    isValid: false,
    error: 'Forbidden: Invalid API key credentials provided.',
    statusCode: 403,
  };
}

/**
 * Standard HTTP JSON error response builder
 */
export function buildAuthErrorResponse(auth: ApiAuthResult): Response {
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
