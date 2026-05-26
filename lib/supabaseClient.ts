import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase URL veya ANON KEY bulunamadı. Lütfen .env.local dosyasındaki bağlantı bilgilerini güncelleyin."
  );
}

// Merkezi Supabase istemcisi
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
