import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10000);

      if (error) throw error;

      return NextResponse.json(data ?? []);
    } catch (err) {
      if (attempt === 3) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
      }
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
}
