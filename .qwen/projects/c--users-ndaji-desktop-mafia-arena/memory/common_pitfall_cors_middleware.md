name: FUNCTION_INVOCATION_FAILED CORS and binding fixes
description: Fix CORS middleware crash on unknown origins and make binding access safe
type: feedback
category: common_pitfall
keywords:
  - "FUNCTION_INVOCATION_FAILED"
  - "CORS middleware"
  - "worker bindings"
  - "deferred tasks"
usage_scenarios:
  - "fix FUNCTION_INVOCATION_FAILED errors on root endpoint"
  - "make health checks safe when bindings are missing"
---

## Rule/Fact
When a Cloudflare Worker has global middleware applied to all routes (`app.use('*', middleware)`), the middleware MUST NOT access response object properties (`c.res`, `c.ctx`) before calling `next()`, as this causes a `FUNCTION_INVOCATION_FAILED` error.

Evaluating conditions like `ALLOWED_ORIGINS.includes(origin)` in `c.env` is safe, but accessing response properties requires the response to be initialized (which happens after `next()`).

## Why
Cloudflare Workers execute middleware sequentially:
1. Middleware is called
2. If callback accesses `c.res.headers` before `next()`: CRASH (FUNCTION_INVOCATION_FAILED)
3. `next()` is called
4. Hono initializes `c.res` (Response object)
5. Response methods become available

The root cause in this case:
- Original CORS middleware used Hono's `cors()` with a custom `origin` callback
- The callback tried to access `c.res.headers.delete()` to remove credentials for unknown origins
- This crashed because `c.res` didn't exist yet

## How to apply
For CORS middleware:

```typescript
// ❌ WRONG - accessing c.res before next() causes crash
const corsWithOrigins = cors({
  origin: (origin) => {
    if (unknownOrigin) {
      c.res.headers.delete('Access-Control-Allow-Credentials'); // CRASH!
      return '*';
    }
    return origin;
  },
  credentials: true
});

// ✅ CORRECT - handle unknown origins before calling Hono CORS
export async function corsMiddleware(c: Context, next: Next) {
  const origin = c.req.header('Origin');
  
  // Handle unknown origins manually
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Credentials', 'false');
    await next();
    return;
  }
  
  // Use Hono CORS for allowed origins
  await cors({ origin: origin, credentials: true })(c, next);
}
```

For safe binding access:

```typescript
// ✅ Check binding exists before accessing
const hasDB = typeof c.env.DB !== 'undefined';
if (hasDB) {
  await c.env.DB.query('SELECT 1');
} else {
  // Return error status or skip check
  console.warn('DB binding not available');
}

// ❌ WRONG - will crash if binding is missing
await c.env.DB.query('SELECT 1'); // if DB is undefined, this crashes
```

## Related Fixes Applied
1. Added `https://mafia.reasonable.finance` to `ALLOWED_ORIGINS` in `src/worker/middleware/cors.ts`
2. Rewrote `corsMiddleware` to handle unknown origins manually without accessing `c.res`
3. Added `mafia.reasonable.finance` to wrangler.toml routes
4. Updated `src/worker/index.ts` to check binding existence before accessing in error handler and deep health check

## Related Memory
- Update: See `common_pitfall_cors_middleware.md`