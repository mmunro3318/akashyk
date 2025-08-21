// src/app/dashboard/memories/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MemoryItem from "./MemoryItem";

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
              <MemoryItem key={memory.id} memory={memory} />
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
