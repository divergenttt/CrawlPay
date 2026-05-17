// TODO: Balance API — Circle Gateway balance for seller wallet

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total: "0",
    available: "0",
    withdrawing: "0",
  });
}
