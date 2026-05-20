import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Arc Testnet explorer link for on-chain EVM tx hashes only. */
export function getScannerLink(txHash: string): string {
  if (!txHash?.trim()) return "";
  if (txHash.includes("-") && txHash.length < 40) {
    return "";
  }
  const normalized = txHash.trim();
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    return "";
  }
  return `https://testnet.arcscan.app/tx/${normalized}`;
}

/** Short display for tx hashes, e.g. `0x3a4b...1a2b`. */
export function formatShortTxHash(txHash: string | null | undefined): string {
  if (!txHash || txHash.trim() === "") return "pending";
  const hash = txHash.trim();
  if (hash.startsWith("0x") && hash.length >= 10) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }
  return hash.length > 8 ? `${hash.slice(0, 8)}...` : hash;
}
