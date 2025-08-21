// app/login/page.tsx
"use client"; // This is a Next.js directive to make this a client-side component. We need this for form state and events.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../dumpster/lib/supabaseClient"; // Our Supabase client from Step 1
import { createServerClient } from "@supabase/ssr"; // or your SSR helper

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("sign-in"); // 'sign-in' or 'sign-up'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } =
      view === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      // Redirect the user based on the view
      if (view === "sign-up") {
        setMessage("Success! Check your email for a confirmation link.");
      } else {
        // Sync session to cookie for SSR
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // Set cookie using SSR helper (on client, you may need to call an API route)
          await fetch("/api/auth/set-cookie", {
            method: "POST",
            body: JSON.stringify({ session }),
            headers: { "Content-Type": "application/json" },
          });
        }
        router.push("/"); // Redirect to the home page after successful login
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold">
          {view === "sign-in" ? "Sign In" : "Sign Up"} to Akashyk
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : view === "sign-in"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {view === "sign-in" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setView("sign-up")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setView("sign-in")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </button>
            </>
          )}
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
