import { GatewayClient } from "@circle-fin/x402-batching/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

async function main() {
  const privateKey = process.env.SELLER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing SELLER_PRIVATE_KEY in .env.local");
  }

  const client = new GatewayClient({
    chain: "arcTestnet",
    privateKey: privateKey as string,
    facilitatorUrl: "https://gateway-api-testnet.circle.com",
  } as ConstructorParameters<typeof GatewayClient>[0]);

  console.log("Starting bot simulation...");
  console.log("Wallet:", client.address);

  for (let i = 0; i < 200; i++) {
    const userAgent = USER_AGENTS[i % USER_AGENTS.length];
    const botName = userAgent.split("/")[0];

    try {
      await client.pay("http://localhost:3000/api/page", {
        method: "GET",
        headers: { "User-Agent": userAgent },
      });
      console.log(`✅ [${i + 1}/200] Paid $0.001 | Bot: ${botName}`);
    } catch (err) {
      console.log(`❌ [${i + 1}/200] Failed | Bot: ${botName} | ${err}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("✅ Simulation complete! Check dashboard.");
}

main().catch(console.error);
