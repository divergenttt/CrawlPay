import { crawlpay } from "@crawlpay/sdk";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const sellerAddress = process.env.NEXT_PUBLIC_SELLER_ADDRESS?.trim();

const paywall = crawlpay({
  wallet: sellerAddress ?? "",
  price: "0.001",
  network: "arcTestnet",
});

export function middleware(request: NextRequest) {
  if (!sellerAddress) {
    console.error(
      "CrawlPay middleware: set NEXT_PUBLIC_SELLER_ADDRESS in .env.local"
    );
    return NextResponse.next();
  }

  return paywall(request) ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon|.*\\..*).*)"],
};
