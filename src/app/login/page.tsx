// app/login/page.tsx
"use client"; // This is a Next.js directive to make this a client-side component. We need this for form state and events.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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

    const supabase = createClient();

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="w-full max-w-md rounded-xl bg-gray-800 shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {view === "sign-in" ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            {loading
              ? "Loading..."
              : view === "sign-in"
              ? "Sign In"
              : "Sign Up"}
          </button>
          {message && <p className="text-red-400 text-center">{message}</p>}
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setView(view === "sign-in" ? "sign-up" : "sign-in")}
            className="text-blue-400 hover:underline"
          >
            {view === "sign-in"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
