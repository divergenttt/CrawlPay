import { GatewayClient } from "@circle-fin/x402-batching/client";
import * as dotenv from "dotenv";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config({ path: ".env.local" });

const PAGE_API = "https://crawl-pay.vercel.app/api/page";

const USER_AGENTS = [
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com",
  "Mozilla/5.0 (compatible; anthropic-ai/1.0; +http://www.anthropic.com/bot.html)",
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.114 Mobile Safari/537.36 (compatible; GoogleOther)",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Google-Extended) Chrome/125.0.6422.114 Safari/537.36",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://docs.perplexity.ai/docs/perplexity-bot",
  "CCBot/2.0 (https://commoncrawl.org/faq/)",
  "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)",
  "Mozilla/5.0 (compatible; FacebookBot/1.0; +https://developers.facebook.com/docs/sharing/webmasters/facebookbot/)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot-Extended/0.1; +http://www.apple.com/go/applebot)",
];

type PaymentRequiredPayload = {
  amount: string;
  page_url: string;
};

function buildPaymentMessage(amount: string, page_url: string): string {
  return `CrawlPay: Authorize payment of ${amount} USDC for page ${page_url}`;
}

function botLabel(userAgent: string): string {
  const match = userAgent.match(
    /(?:compatible;\s*|^\s*)(GPTBot|ChatGPT-User|ClaudeBot|anthropic-ai|GoogleOther|Google-Extended|PerplexityBot|CCBot|Bytespider|FacebookBot|Applebot-Extended)/i
  );
  return match?.[1] ?? userAgent.slice(0, 24);
}

function decodePaymentRequired(header: string): PaymentRequiredPayload {
  const decoded = JSON.parse(
    Buffer.from(header, "base64").toString("utf-8")
  ) as PaymentRequiredPayload;

  if (!decoded.amount || !decoded.page_url) {
    throw new Error("Invalid X-Payment-Required payload");
  }

  return decoded;
}

async function simulateBotVisit(
  client: GatewayClient,
  account: ReturnType<typeof privateKeyToAccount>,
  userAgent: string
): Promise<void> {
  const headers = { "User-Agent": userAgent };

  const initialRes = await fetch(PAGE_API, { method: "GET", headers });

  if (initialRes.status !== 402) {
    throw new Error(
      `Expected 402 Payment Required, got ${initialRes.status}`
    );
  }

  const xPaymentRequired = initialRes.headers.get("X-Payment-Required");
  if (!xPaymentRequired) {
    throw new Error("Missing X-Payment-Required header in 402 response");
  }

  const { amount, page_url } = decodePaymentRequired(xPaymentRequired);

  const payResult = await client.pay(PAGE_API, {
    method: "GET",
    headers,
  });

  if (payResult.amount === 0n) {
    throw new Error("Gateway payment was not settled");
  }

  const paymentSignature = await account.signMessage({
    message: buildPaymentMessage(amount, page_url),
  });

  const accessRes = await fetch(PAGE_API, {
    method: "GET",
    headers: {
      ...headers,
      "payment-signature": paymentSignature,
      "payment-bot-address": account.address,
      "payment-page-url": page_url,
    },
  });

  if (!accessRes.ok) {
    const err = await accessRes.json().catch(() => ({}));
    throw new Error(
      `Access request failed (${accessRes.status}): ${
        (err as { error?: string }).error ?? accessRes.statusText
      }`
    );
  }

  const accessData = (await accessRes.json()) as {
    message?: string;
    tx_hash?: string;
  };

  if (accessData.message !== "Access granted") {
    throw new Error(
      `Unexpected response: ${JSON.stringify(accessData)}`
    );
  }
}

async function main() {
  const privateKey = process.env.SELLER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing SELLER_PRIVATE_KEY in .env.local");
  }

  const key = privateKey as `0x${string}`;
  const account = privateKeyToAccount(key);
  const client = new GatewayClient({
    chain: "arcTestnet",
    privateKey: key,
  });

  console.log("Starting bot simulation (402 → Gateway → sign → Access granted)...");
  console.log("Wallet:", account.address);

  for (let i = 0; i < 200; i++) {
    const userAgent = USER_AGENTS[i % USER_AGENTS.length];
    const botName = botLabel(userAgent);

    try {
      await simulateBotVisit(client, account, userAgent);
      console.log(`✅ [${i + 1}/200] Paid $0.001 via Gateway | Bot: ${botName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`❌ [${i + 1}/200] Failed | Bot: ${botName} | ${message}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("✅ Simulation complete! Check dashboard.");
}

main().catch(console.error);
