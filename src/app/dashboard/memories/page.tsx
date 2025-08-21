// src/app/dashboard/memories/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
                <h2 className="text-xl font-semibold text-blue-400 mb-2">
                  {memory.title}
                </h2>
                <p className="text-gray-200 mb-4">{memory.content}</p>
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
