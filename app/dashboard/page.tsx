"use client";

import { useEffect, useState } from "react";
import RevenueChart from "@/components/revenue-chart";
import type { ChartDay, Payment } from "@/lib/types";
import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d3a 50%, #1a1a2e 100%)",
  color: "white",
  padding: "2rem",
  fontFamily: "system-ui, sans-serif",
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "1.5rem",
  border: "1px solid rgba(255,255,255,0.08)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const sectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "1.5rem",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: "1.5rem",
};

const tableContainerStyle: CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "1.5rem",
  border: "1px solid rgba(255,255,255,0.08)",
};

const titleStyle: CSSProperties = {
  fontSize: "1.875rem",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.02em",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: "1rem",
  marginTop: 0,
  color: "rgba(255,255,255,0.7)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const cardLabelStyle: CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "0.75rem",
  marginBottom: "0.5rem",
  marginTop: 0,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 500,
};

const cardValueStyle: CSSProperties = {
  fontSize: "1.75rem",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.02em",
};

const tableStyle: CSSProperties = {
  width: "100%",
  textAlign: "left",
  fontSize: "0.875rem",
  borderCollapse: "collapse",
};

const thStyle: CSSProperties = {
  color: "rgba(255,255,255,0.3)",
  paddingBottom: "0.75rem",
  fontWeight: 500,
  textAlign: "left",
  textTransform: "uppercase",
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
};

const rowStyle: CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.06)",
};

const tdStyle: CSSProperties = {
  padding: "0.875rem 0",
  verticalAlign: "middle",
};

const emptyCellStyle: CSSProperties = {
  ...tdStyle,
  textAlign: "center",
  color: "rgba(255,255,255,0.3)",
  padding: "3rem 0",
};

function toNumber(value: number | string | null | undefined): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : parseFloat(value) || 0;
}

function formatUsdc(amount: number): string {
  return `$${amount.toFixed(3)} USDC`;
}

function formatTxHash(txHash: string | null | undefined): string {
  if (!txHash || txHash.trim() === "") return "pending";
  return txHash.length > 8 ? `${txHash.slice(0, 8)}...` : txHash;
}

function formatRelativeTime(dateStr: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 10000);
  if (diffSec < 60) return `${Math.max(diffSec, 1)} sec ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

function dateKeyLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildChartData(payments: Payment[]): ChartDay[] {
  const days: ChartDay[] = [];
  const keys: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: 0,
    });
    keys.push(dateKeyLocal(d));
  }

  const revenueByDay = new Map(keys.map((k) => [k, 0]));
  for (const p of payments) {
    const key = dateKeyLocal(new Date(p.created_at));
    if (revenueByDay.has(key)) {
      revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + toNumber(p.amount_usdc));
    }
  }

  return days.map((day, i) => ({
    label: day.label,
    revenue: revenueByDay.get(keys[i]) ?? 0,
  }));
}

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchData() {
    try {
      const res = await fetch(`/api/payments?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        console.error("Fetch error:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const recent = payments.slice(0, 100);
  const totalEarned = payments.reduce((sum, p) => sum + toNumber(p.amount_usdc), 0);
  const totalRequests = payments.length;
  const uniqueBots = new Set(payments.map((p) => p.bot_name)).size;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEarned = payments
    .filter((p) => new Date(p.created_at) >= todayStart)
    .reduce((sum, p) => sum + toNumber(p.amount_usdc), 0);

  const chartData = buildChartData(payments);

  const stats = [
    { label: "Total Earned", value: formatUsdc(totalEarned) },
    { label: "Total Requests", value: String(totalRequests) },
    { label: "Unique Bots", value: String(uniqueBots) },
    { label: "Today", value: formatUsdc(todayEarned) },
  ];

  return (
    <main style={pageStyle}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={titleStyle}>CrawlPay Dashboard</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10B981",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#10B981",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              marginTop: "2px",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Arc Testnet ·{" "}
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Connecting..."}
          </p>
        </div>

        <a
          href="/"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.6)",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "0.85rem",
            border: "1px solid rgba(255,255,255,0.1)",
            fontWeight: 500,
          }}
        >
          ← Home
        </a>
      </div>

      <div style={gridStyle}>
        {stats.map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <p style={cardLabelStyle}>{stat.label}</p>
            <p style={cardValueStyle}>{stat.value}</p>
          </div>
        ))}
      </div>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Revenue — last 7 days</h2>
        <RevenueChart data={chartData} />
      </section>

      <section style={tableContainerStyle}>
        <h2 style={sectionTitleStyle}>Recent Payments</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Bot</th>
                <th style={thStyle}>Page</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>TxHash</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr style={rowStyle}>
                  <td colSpan={5} style={emptyCellStyle}>
                    No payments yet. Run simulate-bots.ts to test.
                  </td>
                </tr>
              ) : (
                recent.map((p) => (
                  <tr key={p.id} style={rowStyle}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{p.bot_name}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                      }}
                    >
                      {p.page_url}
                    </td>
                    <td style={{ ...tdStyle, color: "#60A5FA", fontWeight: 500 }}>
                      {toNumber(p.amount_usdc).toFixed(3)} USDC
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                      }}
                    >
                      {p.tx_hash && p.tx_hash.startsWith("0x") ? (
                        <a
                          href={`https://testnet.arcscan.app/tx/${p.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#60A5FA", textDecoration: "none" }}
                        >
                          {formatTxHash(p.tx_hash)}
                        </a>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          {formatTxHash(p.tx_hash)}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {formatRelativeTime(p.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
