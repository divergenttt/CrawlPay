'use client'

import { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import type { ChartDay, Payment } from "@/lib/types";
import type { CSSProperties } from "react";

const RevenueChart = nextDynamic(() => import("@/components/revenue-chart"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "300px", background: "#1F2937", borderRadius: "0.75rem" }} />
  ),
});

const pageStyle: CSSProperties = { minHeight: "100vh", background: "#111827", color: "white", padding: "2rem" };
const cardStyle: CSSProperties = { background: "#1F2937", borderRadius: "0.75rem", padding: "1.5rem" };
const gridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" };
const sectionStyle: CSSProperties = { ...cardStyle, marginBottom: "2rem" };
const tableContainerStyle: CSSProperties = { background: "#1F2937", borderRadius: "0.75rem", padding: "1.5rem" };
const titleStyle: CSSProperties = { fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.5rem", marginTop: 0 };
const subtitleStyle: CSSProperties = { color: "#9CA3AF", marginBottom: "2rem", marginTop: 0 };
const sectionTitleStyle: CSSProperties = { fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", marginTop: 0 };
const cardLabelStyle: CSSProperties = { color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.5rem", marginTop: 0 };
const cardValueStyle: CSSProperties = { fontSize: "1.5rem", fontWeight: 700, margin: 0 };
const tableStyle: CSSProperties = { width: "100%", textAlign: "left", fontSize: "0.875rem", borderCollapse: "collapse" };
const thStyle: CSSProperties = { color: "#9CA3AF", paddingBottom: "0.75rem", fontWeight: 500, textAlign: "left" };
const rowStyle: CSSProperties = { borderTop: "1px solid #374151" };
const tdStyle: CSSProperties = { padding: "1rem 0", verticalAlign: "middle" };
const emptyCellStyle: CSSProperties = { ...tdStyle, textAlign: "center", color: "#6B7280", padding: "2rem 0" };

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
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
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
    days.push({ label: d.toLocaleDateString("en-US", { weekday: "short" }), revenue: 0 });
    keys.push(dateKeyLocal(d));
  }
  const revenueByDay = new Map(keys.map((k) => [k, 0]));
  for (const p of payments) {
    const key = dateKeyLocal(new Date(p.created_at));
    if (revenueByDay.has(key)) {
      revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + toNumber(p.amount_usdc));
    }
  }
  return days.map((day, i) => ({ label: day.label, revenue: revenueByDay.get(keys[i]) ?? 0 }));
}

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchData() {
    try {
      const res = await fetch(`/api/payments?t=${Date.now()}`, { 
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const recent = payments.slice(0, 20);
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <h1 style={{ ...titleStyle, marginBottom: 0 }}>CrawlPay Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 500 }}>LIVE</span>
        </div>
      </div>
      <p style={subtitleStyle}>
      Real-time AI crawler payments on Arc Testnet · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Connecting..."}
      </p>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      {loading ? (
        <div style={{ color: "#9CA3AF", textAlign: "center", padding: "4rem" }}>Loading...</div>
      ) : (
        <>
          <div style={gridStyle}>
            {stats.map((stat) => (
              <div key={stat.label} style={cardStyle}>
                <p style={cardLabelStyle}>{stat.label}</p>
                <p style={cardValueStyle}>{stat.value}</p>
              </div>
            ))}
          </div>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Revenue (last 7 days)</h2>
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
                      <td colSpan={5} style={emptyCellStyle}>No payments yet. Run simulate-bots.ts to test.</td>
                    </tr>
                  ) : (
                    recent.map((p) => (
                      <tr key={p.id} style={rowStyle}>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{p.bot_name}</td>
                        <td style={{ ...tdStyle, color: "#D1D5DB" }}>{p.page_url}</td>
                        <td style={{ ...tdStyle, color: "#60A5FA" }}>{toNumber(p.amount_usdc).toFixed(3)} USDC</td>
                        <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.75rem", color: "#9CA3AF" }}>{formatTxHash(p.tx_hash)}</td>
                        <td style={{ ...tdStyle, color: "#9CA3AF" }}>{formatRelativeTime(p.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
