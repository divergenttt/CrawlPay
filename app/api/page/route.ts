import { NextRequest, NextResponse } from "next/server";
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

function paymentRequiredBody() {
  const wallet = process.env.SELLER_ADDRESS;
  if (!wallet?.trim()) {
    return null;
  }

  return {
    error: "Payment required",
    amount: "0.001",
    currency: "USDC",
    network: "arcTestnet",
    wallet: wallet.trim(),
  };
}

async function resolvePageUrlForVerification(
  paymentSignature: string,
  paymentBotAddress: string,
  pageUrlHint: string | null
): Promise<string | null> {
  if (pageUrlHint) {
    const valid = await verifyArcSignature(
      paymentSignature,
      paymentBotAddress,
      AMOUNT_USDC,
      pageUrlHint
    );
    return valid ? pageUrlHint : null;
  }

  for (const page_url of PAGE_URLS) {
    const valid = await verifyArcSignature(
      paymentSignature,
      paymentBotAddress,
      AMOUNT_USDC,
      page_url
    );
    if (valid) return page_url;
  }

  return null;
}

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  if (!isAIBot(userAgent)) {
    return NextResponse.json({ message: "Welcome human!", free: true });
  }

  const botName = getBotName(userAgent);

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

  if (!hasCryptoHeaders) {
    const body = paymentRequiredBody();
    if (!body) {
      return NextResponse.json(
        { error: "SELLER_ADDRESS not configured" },
        { status: 500 }
      );
    }

    const page_url = pickPageUrl();
    const paymentRequiredPayload = Buffer.from(
      JSON.stringify({ ...body, page_url })
    ).toString("base64");

    return NextResponse.json(body, {
      status: 402,
      headers: {
        "X-Payment-Required": paymentRequiredPayload,
        "PAYMENT-REQUIRED": paymentRequiredPayload,
      },
    });
  }

  const pageUrlHint = getHeader(req, "payment-page-url", "PAYMENT-PAGE-URL");
  const page_url = await resolvePageUrlForVerification(
    paymentSignature!,
    paymentBotAddress!,
    pageUrlHint
  );

  if (!page_url) {
    return NextResponse.json(
      { error: "Invalid payment signature" },
      { status: 401 }
    );
  }

  const tx_hash = paymentSignature!.startsWith("0x")
    ? paymentSignature!
    : `0x${paymentSignature!}`;

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
