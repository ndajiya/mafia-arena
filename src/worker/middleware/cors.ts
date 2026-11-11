/**
 * CORS middleware for Mafia Arena API.
 */

import type { Context, Next } from 'hono';
import { cors } from 'hono/cors';

/**
 * Allowed origins for CORS with credentials.
 * Must be specific origins (not '*') to allow credentials.
 */
const ALLOWED_ORIGINS = [
  'http://localhost:4321',   // Frontend dev server
  'http://localhost:4322',   // Alternate frontend dev port
  'http://localhost:8787',   // Worker dev (same-origin)
  'https://mafia-arena.com', // Production frontend
  'https://www.mafia-arena.com',
  'https://mafia.reasonable.finance', // Production frontend (reasonable.finance)
];

/**
 * CORS middleware that adapts Hono's cors for both allowed and unknown origins.
 * 
 * For allowed origins: grants full CORS with credentials
 * For unknown origins: grants CORS without credentials (origin: '*')
 */
export async function corsMiddleware(c: Context, next: Next) {
  // Skip CORS for WebSocket upgrades
  const upgradeHeader = c.req.header('Upgrade');
  if (upgradeHeader?.toLowerCase() === 'websocket') {
    return next();
  }

  // Get the request origin
  const origin = c.req.header('Origin');

  // For origins not in our allowed list, we can't safely call the Hono CORS middleware
  // with credentials: true, so we handle CORS manually
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    try {
      // Set CORS headers for cross-origin requests without credentials
      c.header('Access-Control-Allow-Origin', '*');
      c.header('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'].join(', '));
      c.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization', 'Upgrade', 'Connection'].join(', '));
      c.header('Access-Control-Allow-Credentials', 'false');
      c.header('Access-Control-Max-Age', '86400'); // Cache for 24 hours
      
      // Handle preflight
      if (c.req.method === 'OPTIONS') {
        return new Response('', { status: 204 });
      }
    } catch (err) {
      console.error('Error setting CORS headers:', err);
    }
    await next();
    return;
  }

  // For allowed origins (or no origin), use Hono's cors with credentials
  try {
    await (async () => {
      // Call Hono's cors middleware for allowed origins
      const allowedOrigin = origin ?? '*';
      const hoonCorsMiddleware = cors({
        origin: allowedOrigin,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Upgrade', 'Connection'],
        credentials: true,
      });
      return hoonCorsMiddleware(c, next);
    })();
  } catch (err) {
    console.error('Error applying CORS:', err);
    await next();
  }
}