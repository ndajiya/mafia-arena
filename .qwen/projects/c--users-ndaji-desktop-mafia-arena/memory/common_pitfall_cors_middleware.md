name: cors middleware origin crash fix
description: CORS middleware crashed when trying to access c.res before calling next()
type: feedback
category: common_pitfall
keywords:
  - "CORS middleware"
  - "cross-origin"
  - "cloudflare worker"
  - "middleware stack"
usage_scenarios:
  - "fix CORS middleware crashes on unknown origins"
  - "configure allowed origins in wrangler.toml"
---

## Rule/Fact
When using Hono's `cors()` middleware with a custom `origin` callback, **do not access `c.res` or `c.ctx` before calling `next()`**. Accessing `c.res.headers` returns `undefined` before the response is initialized, causing a runtime crash (`FUNCTION_INVOCATION_FAILED`).

## Why
Hono middleware follows a specific execution order:
1. Middleware is called
2. `next()` is called, which continues the middleware chain
3. `next()` triggers Hono to initialize `c.res` (Response)
4. Response methods (`c.res.headers.delete()`, `c.res.headers.set()`) become available

Accessing response properties before step 3 causes a runtime error because the response object doesn't exist yet.

## How to apply
Instead of:
```typescript
// ❌ WRONG - accessing c.res before next()
origin: (origin) => {
  if (unknownOrigin) {
    c.res.headers.delete('Access-Control-Allow-Credentials'); // CRASHES
    return '*';
  }
  return origin;
}
```

Use manual header setting for unknown origins, or call Hono cors separately:
```typescript
// ✅ CORRECT - manual header setting
export async function corsMiddleware(c: Context, next: Next) {
  const origin = c.req.header('Origin');
  
  // Handle unknown origins without using Hono CORS
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Credentials', 'false');
    return next(); // Call next() before accessing c.res
  }
  
  // Use Hono CORS for allowed origins
  await cors({...})(c, next);
}
```

## Related Fix
Added `https://mafia.reasonable.finance` to `ALLOWED_ORIGINS` array in `src/worker/middleware/cors.ts` to allow production frontend requests with credentials.