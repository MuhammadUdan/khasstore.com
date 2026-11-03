
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL ya ANON KEY missing hai. Vercel Environment Variables check karein."
    );
  }

  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error("Supabase URL valid nahi hai. Project URL dobara check karein.");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
