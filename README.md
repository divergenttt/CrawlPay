# CrawlPay

> Monetize your site for the AI era. AI bots pay $0.001 USDC per page via Arc Nanopayments.

**Live Demo:** [crawl-pay.vercel.app](https://crawl-pay.vercel.app)  
**Dashboard:** [crawl-pay.vercel.app/dashboard](https://crawl-pay.vercel.app/dashboard)  
**SDK:** [github.com/divergenttt/CrawlPay-SDK](https://github.com/divergenttt/CrawlPay-SDK)

---

## The Problem

AI bots (GPTBot, ClaudeBot, PerplexityBot, GoogleOther) crawl the entire internet — for free. They read your articles, documentation, and content thousands of times per day. Content creators get nothing.

Cloudflare attempted to solve this with Pay Per Crawl — but only for Enterprise customers with Cloudflare Pro. There is no solution for independent developers, bloggers, and small site owners.

**Until now.**

---

## The Solution

CrawlPay is a pay-per-crawl monetization layer for any website. One npm install. AI bots pay $0.001 USDC per page via the x402 protocol on Arc Testnet.

```bash
npm install github:divergenttt/CrawlPay-SDK
```

```typescript
// middleware.ts
import { crawlpay } from '@crawlpay/sdk'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const paywall = crawlpay({
  wallet: "0x_YOUR_WALLET_ADDRESS",
  price: "$0.001",
  network: "arcTestnet"
})

export function middleware(request: NextRequest) {
  return paywall(request) ?? NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon).*)']
}
```

That's it. AI bots now pay to access your site.

---

## Why Arc

| | Ethereum | Arc |
|---|---|---|
| Gas per transaction | ~$0.50 | ~$0.000006 |
| Settlement time | 12 seconds | < 1 second |
| Viable for $0.001 payments | ❌ | ✅ |

Arc Nanopayments make micro-transactions economically viable for the first time. On Ethereum, gas costs exceed the payment itself. On Arc, gas is 80,000x cheaper.

---

## How It Works

1. **Bot visits your site** — GPTBot, ClaudeBot, PerplexityBot, etc.
2. **Middleware detects the bot** — by User-Agent header
3. **Returns HTTP 402 Payment Required** — with x402 payment instructions
4. **Bot pays $0.001 USDC** — via Circle Nanopayments on Arc
5. **Page is served** — payment recorded in real-time dashboard

---

## Supported AI Bots

- GPTBot / ChatGPT-User (OpenAI)
- ClaudeBot / anthropic-ai (Anthropic)
- PerplexityBot
- GoogleOther / Google-Extended
- CCBot (Common Crawl)
- Bytespider (TikTok)
- FacebookBot (Meta)
- Applebot-Extended (Apple)

---

## Live Demo

Dashboard shows real-time payments from simulated AI crawlers on Arc Testnet:

- **200+ transactions** processed on Arc Testnet
- **5 unique bot types** detected and charged
- **Real-time updates** every 5 seconds
- **TxHash links** to Arc Testnet Explorer

---

## Tech Stack

- **Next.js 14** — App Router, TypeScript
- **Arc Testnet** — Circle blockchain, USDC native gas token
- **Circle Nanopayments** — x402 protocol, gas-free batched settlements
- **Supabase** — real-time payment history
- **CrawlPay SDK** — open source middleware

---

## Architecture

AI Bot Request
↓
CrawlPay Middleware (SDK)
↓
Bot detected? → HTTP 402 + payment instructions
↓
Bot pays $0.001 USDC via x402
↓
Page served + payment recorded
↓
Real-time Dashboard

## Roadmap

- [x] Bot detection (11 AI crawlers)
- [x] HTTP 402 response with x402 headers
- [x] Real-time payment dashboard
- [x] Open source SDK
- [ ] Revenue split (platform fee)
- [ ] Arc Mainnet support (Summer 2026)
- [ ] WordPress / Ghost plugin
- [ ] Cloudflare Worker version (any site, no Node.js required)
- [ ] Real x402 payment verification

---

## Built For

Built on Arc Testnet using Circle Nanopayments and x402 protocol.

This project demonstrates that pay-per-crawl monetization is technically viable today. The missing piece is AI companies adopting x402 in their crawlers - which Cloudflare is already pushing for.

---
## Links

- 🌐 [Live Demo](https://crawl-pay.vercel.app)
- 📊 [Dashboard](https://crawl-pay.vercel.app/dashboard)
- 📦 [SDK Repository](https://github.com/divergenttt/CrawlPay-SDK)
- 🔍 [Arc Testnet Explorer](https://testnet.arcscan.app)

*Built with ❤️ on Arc · Powered by Circle Nanopayments*