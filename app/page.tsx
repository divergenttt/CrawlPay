'use client'

import Link from "next/link";
import type { CSSProperties } from "react";

const INSTALL_CMD = "npm install github:divergenttt/CrawlPay-SDK";

const SYNTAX = {
  keyword: "#C792EA",
  string: "#C3E88D",
  function: "#82AAFF",
  key: "#F07178",
  comment: "#546E7A",
  plain: "#FFFFFF",
} as const;

const codeBlockBase: CSSProperties = {
  background: "#0d0d1a",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "11px",
  padding: "1.5rem 1rem",
  borderRadius: "8px",
  margin: "0.75rem 0 0 0",
  lineHeight: 1.8,
  border: "1px solid rgba(255,255,255,0.08)",
  display: "block",
  overflowX: "auto",
  whiteSpace: "pre",
};

const installCodeStyle: CSSProperties = { ...codeBlockBase, color: "#C3E88D" };
const middlewareCodeStyle: CSSProperties = { ...codeBlockBase };

function kw(text: string) { return <span style={{ color: "#C792EA" }}>{text}</span>; }
function str(text: string) { return <span style={{ color: "#C3E88D" }}>{text}</span>; }
function fn(text: string) { return <span style={{ color: "#82AAFF" }}>{text}</span>; }
function objKey(text: string) { return <span style={{ color: "#F07178" }}>{text}</span>; }
function plain(text: string) { return <span style={{ color: "#FFFFFF" }}>{text}</span>; }

function MiddlewareCodeBlock() {
  return (
    <pre style={middlewareCodeStyle}>
      {kw("import")}{plain(" { ")}{fn("crawlpay")}{plain(" } from ")}{str("'@crawlpay/sdk'")}{"\n"}
      {kw("import")}{plain(" { ")}{fn("NextResponse")}{plain(" } from ")}{str("'next/server'")}{"\n"}
      {kw("import")}{plain(" ")}{kw("type")}{plain(" { ")}{fn("NextRequest")}{plain(" } from ")}{str("'next/server'")}{"\n"}
      {"\n"}
      {kw("const")}{plain(" paywall = ")}{fn("crawlpay")}{plain("({")}{"\n"}
      {plain("  ")}{objKey("wallet")}{plain(": ")}{str('"0x_YOUR_WALLET_ADDRESS"')}{plain(",")}{"\n"}
      {plain("  ")}{objKey("price")}{plain(": ")}{str('"$0.001"')}{plain(",")}{"\n"}
      {plain("  ")}{objKey("network")}{plain(": ")}{str('"arcTestnet"')}{"\n"}
      {plain("})")}{"\n"}
      {"\n"}
      {kw("export")}{plain(" ")}{kw("function")}{plain(" ")}{fn("middleware")}{plain("(request: ")}{fn("NextRequest")}{plain(") {")}{"\n"}
      {plain("  ")}{kw("return")}{plain(" paywall(request) ?? ")}{fn("NextResponse")}{plain(".next()")}{"\n"}
      {plain("}")}{"\n"}
      {"\n"}
      {kw("export")}{plain(" ")}{kw("const")}{plain(" config = {")}{"\n"}
      {plain("  ")}{objKey("matcher")}{plain(": ")}{str("['/((?!api|_next|favicon).*)']")}{"\n"}
      {plain("}")}
    </pre>
  );
}

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d3a 50%, #1a1a2e 100%)",
      backgroundColor: "#1a1a2e",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "2rem",
      paddingTop: "4rem",
      paddingBottom: "6rem",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      boxSizing: "border-box",
    }}>

      <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", top: "-200px", right: "-200px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", bottom: "-100px", left: "-100px", pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem" }}>
        <img src="/logo.png" alt="CrawlPay" style={{ width: "48px", height: "48px", borderRadius: "10px" }} />
      </div>

      <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, margin: "0 0 1rem 0", textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        CrawlPay
      </h1>

      <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "rgba(255,255,255,0.6)", margin: "0 0 1.5rem 0", textAlign: "center", maxWidth: "480px", lineHeight: 1.5 }}>
        Monetize your site for the AI era
      </p>

      <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", margin: "0 0 3rem 0", textAlign: "center", maxWidth: "420px", lineHeight: 1.7 }}>
        AI bots read your site thousands of times a day — for free. One tag. They pay. You earn USDC instantly on Arc.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
        <Link href="/dashboard" style={{ background: "white", color: "#1a1a2e", padding: "0.875rem 2rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "inline-block" }}>
          View Dashboard →
        </Link>
        <a href="https://github.com/divergenttt/CrawlPay-" target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", padding: "0.875rem 2rem", borderRadius: "12px", textDecoration: "none", fontWeight: 500, fontSize: "1rem", border: "1px solid rgba(255,255,255,0.12)", display: "inline-block" }}>
          GitHub
        </a>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem", padding: "1rem 2rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { value: "200+", label: "Transactions on Arc Testnet" },
          { value: "5", label: "AI bots supported" },
          { value: "MIT", label: "Open source license" },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.2rem" }}>{item.value}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
        {[
          { label: "Payment per crawl", value: "$0.001 USDC" },
          { label: "Settlement time", value: "< 1 second" },
          { label: "Gas cost", value: "~$0.000006" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{stat.value}</div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", maxWidth: "700px", marginBottom: "4rem" }}>
        {[
          { step: "01", title: "Add one tag", desc: "Paste our script to your site" },
          { step: "02", title: "Bot visits", desc: "AI crawler requests your page" },
          { step: "03", title: "Auto payment", desc: "Bot pays $0.001 USDC via Arc" },
        ].map((item) => (
          <div key={item.step} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem 1rem", flex: "1", minWidth: "180px", maxWidth: "220px" }}>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{item.step}</div>
            <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.4rem" }}>{item.title}</div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <section style={{ width: "100%", maxWidth: "1100px", marginTop: "2rem" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, margin: "0 0 2rem 0", textAlign: "center", letterSpacing: "-0.02em" }}>
          Add to your site in 2 minutes
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", width: "100%", alignItems: "stretch" }}>
          {[
            { step: "1", title: "Install", code: INSTALL_CMD },
            { step: "2", title: "Add middleware.ts to your Next.js project", highlighted: true },
            { step: "3", title: "Done", desc: "AI bots pay. You earn USDC." },
          ].map((item) => (
            <div key={item.step} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem 1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                STEP {item.step}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "code" in item || "highlighted" in item ? 0 : "0.5rem" }}>
                {item.title}
              </div>
              {"highlighted" in item && item.highlighted ? (
                <MiddlewareCodeBlock />
              ) : "code" in item && item.code ? (
                <pre style={installCodeStyle}>{item.code}</pre>
              ) : (
                <div style={{ marginTop: "0.5rem" }}>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                    {"desc" in item ? item.desc : null}
                  </p>
                  {["Instant USDC payments", "Real-time dashboard", "No KYC required", "Arc Testnet ready"].map((line) => (
                    <div key={line} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#10B981", fontSize: "0.85rem" }}>→</span>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="https://github.com/divergenttt/CrawlPay-SDK" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", color: "white", padding: "0.875rem 2rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem", border: "1px solid rgba(255,255,255,0.12)" }}>
            View SDK on GitHub
          </a>
        </div>
      </section>

      <div style={{ marginTop: "4rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
        Built on Arc · Powered by Circle Nanopayments
      </div>

    </main>
  );
}