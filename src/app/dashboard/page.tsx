// src/app/dashboard/page.tsx
"use server";

import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from "axios";

export async function summarizeMemory(formData: FormData) {
  "use server";

  // Get the data from the form
  const memoryId = formData.get("id") as string;
  const content = formData.get("content") as string;

  const supabase = await createClient();

  const prompt = `
  You are a professional assistant that provides high-level summaries and key information from text. Your output should be concise and helpful. Never include your own thoughts or meta-commentary. Please provide a one-paragraph summary of the following text, followed by 3-5 bullet points of the most important takeaways and any action items.

  Text to summarize: ${content}
  `;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: process.env.HOSTED_LLM_MODEL || "llama3.2:1b",
      prompt: prompt,
      stream: false,
    });

    const summary = response.data.response;

    // Save the summary back to the database
    const { error } = await supabase
      .from("memories")
      .update({ summary })
      .eq("id", memoryId);

    if (error) {
      console.error("Error updating summary:", error);
    }

    revalidatePath("/dashboard/memories");
  } catch (error) {
    console.error("Error generating summary:", error);
  }
}

export async function saveMemory(formData: FormData) {
  const supabase = await createClient();

  // Get the user's session from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if the user is not logged in
  if (!user) {
    redirect("/login");
  }

  // Get the data from the form
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Insert the data into our memories table
  const { error } = await supabase.from("memories").insert([
    {
      user_id: user.id,
      title,
      content,
      type: "text",
    },
  ]);

  if (error) {
    console.error("Error saving memory:", error);
    // You could also redirect to an error page here
  }

  // Revalidate the dashboard page to show the new memory
  revalidatePath("/dashboard");
}

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

  // Sign out handler using the /auth/signout route
  const handleSignOut = () => {
    window.location.href = "/auth/signout";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-gray-800 shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            Your Memory Repository
          </h1>
          <Link
            href="/auth/signout"
            className="ml-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow transition duration-150 ease-in-out"
          >
            <span className="inline-block align-middle mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
            </span>
            Sign Out
          </Link>
        </div>
        <p className="text-gray-300 mb-8 text-center">
          Welcome back, <span className="font-semibold">{user.email}</span>! Use
          the form below to add a new memory.
        </p>
        <div className="flex justify-center mt-4 mb-8">
          <Link href="/dashboard/memories">
            <span className="inline-block py-2 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition-colors duration-150 ease-in-out">
              View All Your Memories
            </span>
          </Link>
        </div>
        <form className="space-y-6" action={saveMemory}>
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
