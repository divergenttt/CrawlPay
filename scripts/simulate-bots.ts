import { GatewayClient } from "@circle-fin/x402-batching/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const USER_AGENTS = [
  "GPTBot/1.0",
  "ClaudeBot/1.0",
  "PerplexityBot/1.0",
  "GoogleOther/1.0",
  "CCBot/2.0",
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
