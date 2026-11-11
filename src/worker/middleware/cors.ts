/**
 * CORS middleware for Mafia Arena API.
 * 
 * Policy:
 * - For allowed origins (including localhost and production domains): allow with credentials
 * - For unknown origins: allow with wildcard but without credentials
 * - Skip CORS for WebSocket upgrades
 */

import type { Context, Next } from 'hono';
import { cors } from 'hono/cors';

/**
 * Allowed origins for CORS.
 * These get full access including credentials for cookie-based auth.
 */
const ALLOWED_ORIGINS = [
  'http://localhost:4321',   // Frontend dev server
  'http://localhost:4322',   // Alternate frontend dev port  
  'http://localhost:8787',   // Worker dev (same-origin)
  'https://mafia-arena.com', // Production frontend
];

/**
 * Hono CORS middleware configured for allowed origins.
 */
const corsOptions = cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Upgrade', 'Connection'],
});

/**
 * CORS middleware that skips WebSocket upgrade requests.
 */
export async function corsMiddleware(c: Context, next: Next) {
  // Skip CORS for WebSocket upgrades
  const upgradeHeader = c.req.header('Upgrade');
  if (upgradeHeader?.toLowerCase() === 'websocket') {
    return next();
  }

  const origin = c.req.header('Origin');

  // For requests with an Origin header not in our allowed list,
  // manually set CORS without credentials to avoid Hono CORS conflict
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    // Call middleware first, then set our own headers
    await (async () => {
      await corsOptions(c, next);
    })();
    // For unknown origins, set wildcard origin without credentials
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Credentials', 'false');
    return;
  }

  // For allowed origins or no origin, use Hono CORS with credentials
  await corsOptions({
    origin: origin ?? '*',
    credentials: true,
  })(c, next);
}