/*
CREATE TABLE payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_name text NOT NULL,
  user_agent text,
  page_url text DEFAULT '/',
  amount_usdc numeric DEFAULT 0.001,
  tx_hash text,
  created_at timestamptz DEFAULT now()
);
*/

import { createClient } from "@supabase/supabase-js";
import type { Payment } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables"
  );
}

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      fetch: fetch.bind(globalThis),
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}

export async function savePayment(
  payment: Omit<Payment, "id" | "created_at">
) {
  const { data, error } = await supabase.from("payments").insert([payment]);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to save payment: " + error.message);
  }

  return data;
}