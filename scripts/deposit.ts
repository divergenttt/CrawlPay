import { GatewayClient } from "@circle-fin/x402-batching/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.SELLER_PRIVATE_KEY as `0x${string}`,
});

async function main() {
  console.log(client.address);
  await client.deposit("1.00");
  console.log("Done");
}

main().catch(console.error);
