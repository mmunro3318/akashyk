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
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Your Memories
        </h1>
        {memories && memories.length > 0 ? (
          <ul className="space-y-4">
            {memories.map((memory) => (
              <li
                key={memory.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  {memory.title}
                </h2>
                <p className="text-gray-600 mb-4">{memory.content}</p>
                <span className="text-sm text-gray-500">
                  Added on: {new Date(memory.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            You haven't added any memories yet.
          </p>
        )}
      </div>
    </div>
  );
}
