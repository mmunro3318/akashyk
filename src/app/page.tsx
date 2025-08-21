// src/app/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
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
            // safe to ignore in Server Component
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 mt-12">
        <p className="text-center text-2xl font-bold text-gray-800">
          Welcome back, {user.email}!
        </p>
        <div className="flex flex-col gap-2 w-full mt-4">
          <Link
            href="/dashboard"
            className="w-full text-center py-2 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/auth/signout"
            className="w-full text-center py-2 px-4 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
