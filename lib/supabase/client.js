// File: lib/supabase/client.js
import { createBrowserClient } from "@supabase/ssr";

const supabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const supabase = supabaseClient();
