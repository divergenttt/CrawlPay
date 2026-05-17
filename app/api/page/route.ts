import { NextRequest, NextResponse } from "next/server";
import { getBotName, isAIBot } from "@/lib/bot-detector";
import { savePayment } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  if (!isAIBot(userAgent)) {
    return NextResponse.json({ message: "Welcome human!", free: true });
  }

  const botName = getBotName(userAgent);

  const fakeHash = "0x" + Array.from(
    { length: 64 },
    () => Math.floor(Math.random() * 16).toString(16)
  ).join("");

  try {
    await savePayment({
      bot_name: botName,
      user_agent: userAgent,
      page_url: "/",
      amount_usdc: 0.001,
      tx_hash: fakeHash,
    });

    return NextResponse.json({
      message: "Access granted",
      bot: botName,
      paid: 0.001,
      tx_hash: fakeHash,
    });
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}