// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not logged in and is trying to access a protected route
  if (!session && req.nextUrl.pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If the user is logged in and tries to access the login page, redirect them to the home page
  if (session && req.nextUrl.pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

// This config tells the middleware to run on all paths except for static files and the API route.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (our API routes, which will be handled separately)
     * - login (our login page)
     * - any files in the root that aren't a folder
     */
    "/((?!_next/static|_next/image|favicon.ico|api|login).*)",
  ],
};
