// src/app/dashboard/memories/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { summarizeMemory } from "@/app/dashboard/page";

export default async function MemoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memories, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-gray-800 shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          All Your Memories
        </h1>
        {memories && memories.length > 0 ? (
          <ul className="space-y-6">
            {memories.map((memory) => (
              <li
                key={memory.id}
                className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-blue-400">
                    {memory.title}
                  </h2>
                  <form action={summarizeMemory} className="flex items-center">
                    <input type="hidden" name="id" value={memory.id} />
                    <input
                      type="hidden"
                      name="content"
                      value={memory.content}
                    />
                    <button
                      type="submit"
                      className="ml-4 px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow transition duration-150 ease-in-out"
                      title="Summarize"
                    >
                      <span className="inline-block align-middle mr-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 17l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                          />
                        </svg>
                      </span>
                      Summarize
                    </button>
                  </form>
                </div>
                {memory.summary && (
                  <div className="mb-4">
                    <span className="block text-sm font-medium text-blue-300 mb-1">
                      AI Summary:
                    </span>
                    <p className="text-gray-300 italic">{memory.summary}</p>
                  </div>
                )}
                <p className="text-gray-200 mb-4">{memory.content}</p>
                {memory.file_url && (
                  <div className="mt-4">
                    <a
                      href={memory.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
                <span className="text-sm text-gray-400">
                  Added on:{" "}
                  {new Date(memory.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            You haven't added any memories yet.
          </p>
        )}
      </div>
    </div>
  );
}
