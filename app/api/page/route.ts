import { NextRequest, NextResponse } from "next/server";
import { getBotName, isAIBot } from "@/lib/bot-detector";
import { savePayment } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  console.log("Request received, User-Agent:", userAgent);
  console.log("Is bot:", isAIBot(userAgent));

  if (!isAIBot(userAgent)) {
    return NextResponse.json({ message: "Welcome human!", free: true });
  }

  const botName = getBotName(userAgent);

  try {
    await savePayment({
      bot_name: botName,
      user_agent: userAgent,
      page_url: "/",
      amount_usdc: 0.001,
      tx_hash: "test-" + Date.now(),
    });

    return NextResponse.json({
      message: "Access granted",
      bot: botName,
      paid: 0.001,
    });
  } catch (err) {
    console.error("Full error:", JSON.stringify(err, null, 2));
    console.error(
      "Error message:",
      err instanceof Error ? err.message : String(err)
    );
    console.error("Error stack:", err instanceof Error ? err.stack : "");
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
