import { NextRequest, NextResponse } from "next/server";
import { pickSimulatedTxHash } from "@/lib/arc-testnet";
import { getBotName, isAIBot } from "@/lib/bot-detector";
import { verifyArcSignature } from "@/lib/gateway";
import { savePayment } from "@/lib/supabase";

const AMOUNT_USDC = 0.001;

const PAGE_URLS = [
  "/blog/how-ai-works",
  "/docs/getting-started",
  "/articles/machine-learning",
  "/tutorials/nextjs-guide",
  "/about",
  "/",
];

function pickPageUrl(): string {
  return PAGE_URLS[Math.floor(Math.random() * PAGE_URLS.length)];
}

function getHeader(req: NextRequest, ...names: string[]): string | null {
  for (const name of names) {
    const value = req.headers.get(name);
    if (value?.trim()) return value.trim();
  }
  return null;
}

function successResponse(botName: string, tx_hash: string) {
  return NextResponse.json({
    message: "Access granted",
    bot: botName,
    paid: AMOUNT_USDC,
    tx_hash,
  });
}

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  if (!isAIBot(userAgent)) {
    return NextResponse.json({ message: "Welcome human!", free: true });
  }

  const botName = getBotName(userAgent);
  const page_url = pickPageUrl();

  const paymentSignature = getHeader(
    req,
    "payment-signature",
    "PAYMENT-SIGNATURE"
  );
  const paymentBotAddress = getHeader(
    req,
    "payment-bot-address",
    "PAYMENT-BOT-ADDRESS"
  );

  const hasCryptoHeaders = Boolean(paymentSignature && paymentBotAddress);

  let tx_hash: string;

  if (hasCryptoHeaders) {
    const valid = await verifyArcSignature(
      paymentSignature!,
      paymentBotAddress!,
      AMOUNT_USDC,
      page_url
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 401 }
      );
    }

    tx_hash = paymentSignature!.startsWith("0x")
      ? paymentSignature!
      : `0x${paymentSignature!}`;
  } else {
    tx_hash = pickSimulatedTxHash();
  }

  try {
    await savePayment({
      bot_name: botName,
      user_agent: userAgent,
      page_url,
      amount_usdc: AMOUNT_USDC,
      tx_hash,
    });

    return successResponse(botName, tx_hash);
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
