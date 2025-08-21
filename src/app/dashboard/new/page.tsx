// src/app/dashboard/new/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { saveMemory } from "@/app/dashboard/page";

export default async function NewMemoryPage() {
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
    <div className="flex min-h-screen items-start justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Add a New Memory
        </h1>
        <form action={saveMemory} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Next.js Auth Troubleshooting"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              placeholder="Paste your conversation, notes, or document content here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              File (Document or Image)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
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
