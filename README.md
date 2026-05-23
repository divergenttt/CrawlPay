# CrawlPay

> AI bots read your site for free. Not anymore.

**Live Demo:** [crawl-pay.vercel.app](https://crawl-pay.vercel.app)  
**Dashboard:** [crawl-pay.vercel.app/dashboard](https://crawl-pay.vercel.app/dashboard)  
**SDK:** [github.com/divergenttt/CrawlPay-SDK](https://github.com/divergenttt/CrawlPay-SDK)

---

## The Problem

GPTBot, ClaudeBot, PerplexityBot - they crawl your site thousands of times a day. They read your articles, your docs, your content. And they pay you nothing.

Cloudflare noticed this too. They started testing pay-per-crawl for AI bots - but only for Enterprise customers on Cloudflare Pro. Regular developers, bloggers, indie site owners ? No option.

That's what CrawlPay is for.

---

## The Idea

I was reading the news about Cloudflare testing bot payments and thought: why is this only for Enterprise ? This should be available to anyone with a useful site. Two minutes to set up, no complex infrastructure, no Cloudflare dependency.

So I built it on Arc - where $0.001 micropayments are actually economical.

---

## Install in 2 minutes

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
  price: "0.001",
  network: "arcTestnet"
})

export function middleware(request: NextRequest) {
  return paywall(request) ?? NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon).*)']
}
```

That's it. If you have a useful resource and AI bots are reading it - now they pay for it.

---

## Why Arc

| | Ethereum | Arc |
|---|---|---|
| Gas per transaction | ~$0.50 | ~$0.000006 |
| Settlement time | 12 seconds | < 1 second |
| Viable for $0.001 payments | ❌ | ✅ |

On Ethereum, gas costs more than the payment itself - micropayments are dead on arrival. Arc makes $0.001 per crawl actually work. That's the whole reason CrawlPay exists.

---

## How It Works

1. **Bot visits your site** - GPTBot, ClaudeBot, PerplexityBot, etc.
2. **Middleware detects the bot** - by User-Agent header
3. **Returns HTTP 402 Payment Required** - with x402 payment instructions
4. **Bot pays $0.001 USDC** - via Circle Nanopayments on Arc
5. **Page is served** - payment recorded in real-time dashboard

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

## Live Stats

- **2000+ transactions** processed on Arc Testnet
- **11 unique bot types** detected and charged
- **Real-time dashboard** updates every 5 seconds
- **TxHash links** to Arc Testnet Explorer

---

## Tech Stack

- **Next.js 14** - App Router, TypeScript
- **Arc Testnet** - Circle blockchain, USDC native gas token
- **Circle Nanopayments** - x402 protocol, gas-free batched settlements
- **Supabase** - real-time payment history
- **CrawlPay SDK** - open source middleware

---

## Architecture

AI Bot Request → CrawlPay Middleware → HTTP 402 + x402 → Bot pays $0.001 USDC → Page served → Dashboard

---

## Roadmap

###  v1.0 - MVP (Live)
- [x] AI bot detection (11 major crawlers: GPTBot, ClaudeBot, PerplexityBot, etc.)
- [x] HTTP `402` + x402 payment flow
- [x] Open-source Next.js SDK (3-line integration)
- [x] Circle nanopayments on Arc Testnet
- [x] Real-time Supabase payment dashboard

###  v1.1 - Hardening (In Progress)
- [ ] Edge Runtime stability & async middleware
- [ ] Signature replay protection & idempotency
- [ ] Fallback modes (`strict` / `log-only`)
- [ ] Starter templates & docs

###  Next → Production
- [ ] WordPress / Cloudflare Workers adapters
- [ ] Cloudflare Workers adapter (deploy anywhere, no Node.js)
- [ ] First 1,000+ testnet transactions & early adopter feedback
- [ ] AI Agent SDK (LangChain / Vercel AI native)
      
---

## Status

Running on Arc Testnet. Arc Nanopayments launched on mainnet in May 2026 - mainnet support is next on the roadmap.

Cloudflare is already pushing x402 adoption with OpenAI, Anthropic, and Google. When crawlers support x402 natively, CrawlPay becomes the open alternative for everyone who isn't an Enterprise customer.

---
## Links

- 🌐 [Live Demo](https://crawl-pay.vercel.app)
- 📊 [Dashboard](https://crawl-pay.vercel.app/dashboard)
- 📦 [SDK Repository](https://github.com/divergenttt/CrawlPay-SDK)
- 🔍 [Arc Testnet Explorer](https://testnet.arcscan.app)

*Built with ❤️ on Arc · Powered by Circle Nanopayments*
