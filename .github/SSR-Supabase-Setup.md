# Next.js App Router + Supabase SSR Setup Tutorial

This guide covers best practices for integrating Supabase authentication with Next.js App Router using `@supabase/ssr`. It includes sample code for utility files and explains how to handle sessions and cookies for SSR.

I encountered all of the AI models (as of 8.20.2025) were struggling with the Supabase migration to SSR, and so this is the result of my troubleshooting. I wrote this setup tutorial for my AIs to reference for the future to ensure compliance.

---

## 1. **Supabase Client Utilities**

Centralize Supabase client creation in utility files for both server and client contexts.

### `utils/supabase/server.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

### `utils/supabase/client.ts` (if needed for client-side usage)

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 2. **Session Management**

- After client-side authentication (e.g., password login), sync the session to cookies via an API route (`/api/auth/set-cookie`) using `supabase.auth.setSession(session)`.
- For OAuth, use a callback route (`/auth/callback`) to exchange the code for a session and set cookies.

### Example: API Route to Set Session Cookie

### `app\api\auth\set-cookie\route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { session } = await request.json();
  const supabase = await createClient();
  await supabase.auth.setSession(session);
  return NextResponse.json({ success: true });
}
```

### `app\auth\callback\route.ts`

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
```

---

## 3. **Middleware Usage**

- Use `createServerClient` in middleware for SSR session checks.
- You must `getAll` (and `setAll`) for cookies _only_... `get`, `set`, `remove` are deprecated.

---

## 4. **Environment Variables**

- Always use your Supabase project’s URL and anon key from environment variables for both client and SSR code.

---

## 5. **Best Practices Summary**

- Centralize Supabase client creation in utility files.
- Use cookie handlers appropriate for context (API routes/server components vs. middleware).
- Sync sessions to cookies after login for SSR compatibility.
- Use environment variables for configuration.
- Reference [Supabase Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs) for updates.

---

## 6. **References**

- [Supabase Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js App Router Docs](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

---

\*\*This tutorial ensures reliable SSR authentication and easier maintenance for future
