import { GatewayClient } from "@circle-fin/x402-batching/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.SELLER_PRIVATE_KEY as `0x${string}`,
});

async function main() {
  const command = process.argv[2]; // deposit | balance | withdraw

  console.log("Wallet:", client.address);

  if (command === "balance") {
    // Use the correct getBalances() method
    const balances = await client.getBalances();
    console.log("Wallet USDC balance:", balances.wallet.formatted);
    console.log("Gateway available balance:", balances.gateway.formattedAvailable);

  } else if (command === "withdraw") {
    const balances = await client.getBalances();
    const available = Number(balances.gateway.formattedAvailable);

    console.log("Gateway available balance:", available, "USDC");
    
    // If the balance is less than or equal to the fee, there is nothing to withdraw
    if (available <= 0.001) {
      console.log("Balance too low to cover the 0.001 USDC gateway fee.");
      return;
    }

    // Deduct the 0.001 USDC gateway transaction fee
    const amountToWithdraw = (available - 0.001).toFixed(6);
    console.log(`Withdrawing: ${amountToWithdraw} USDC (0.001 USDC reserved for gateway fee)`);

    // Withdraw the safe amount
    await client.withdraw(amountToWithdraw);
    console.log("Done — funds sent to wallet");

  } else {
    console.log("Depositing 1.00 USDC to Gateway...");
    // The deposit method returns the transaction hash
    const result = await client.deposit("1.00");
    console.log(`Deposited 1 USDC. TX Hash: ${result.depositTxHash}`);
    
    const updatedBalances = await client.getBalances();
    console.log("New Gateway available balance:", updatedBalances.gateway.formattedAvailable);
  }
}

main().catch(console.error);