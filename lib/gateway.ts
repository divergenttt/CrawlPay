import { isAddress, recoverMessageAddress } from "viem";

function buildPaymentMessage(amount_usdc: number, url: string): string {
  return `CrawlPay: Authorize payment of ${amount_usdc} USDC for page ${url}`;
}

function normalizeSignature(signature: string): `0x${string}` | null {
  const trimmed = signature.trim();
  if (!trimmed) return null;
  const hex = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  if (!/^0x[0-9a-fA-F]+$/.test(hex)) return null;
  return hex as `0x${string}`;
}

/**
 * Off-chain Arc / x402-style authorization: recover signer from EIP-191 message.
 */
export async function verifyArcSignature(
  signature: string,
  botAddress: string,
  amount_usdc: number,
  url: string
): Promise<boolean> {
  if (!botAddress?.trim() || !isAddress(botAddress)) {
    return false;
  }

  const normalizedSignature = normalizeSignature(signature);
  if (!normalizedSignature) {
    return false;
  }

  try {
    const message = buildPaymentMessage(amount_usdc, url);
    const recovered = await recoverMessageAddress({
      message,
      signature: normalizedSignature,
    });

    return recovered.toLowerCase() === botAddress.toLowerCase();
  } catch {
    return false;
  }
}
