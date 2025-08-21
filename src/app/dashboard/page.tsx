// src/app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch the authenticated user's session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not logged in, redirect them to the login page
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-gray-800 shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Your Memory Repository
        </h1>
        <p className="text-gray-300 mb-8 text-center">
          Welcome back, <span className="font-semibold">{user.email}</span>! Use
          the form below to add a new memory.
        </p>

        <form className="space-y-6">
          <h2 className="text-xl font-semibold text-white text-center">
            Add a New Memory
          </h2>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Next.js Auth Troubleshooting"
              className="mt-1 block w-full rounded-lg bg-gray-700 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              placeholder="Paste your conversation, notes, or document content here..."
              className="mt-1 block w-full rounded-lg bg-gray-700 text-white border border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            Save Memory
          </button>
        </form>
      </div>
    </div>
  );
}
