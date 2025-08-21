import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { session } = await request.json();

  const supabase = await createClient();

  // Set the session cookie for SSR
  await supabase.auth.setSession(session);

  return NextResponse.json({ success: true });
}
