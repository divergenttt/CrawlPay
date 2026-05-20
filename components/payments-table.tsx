"use client";

import type { Payment } from "@/lib/types";
import { formatShortTxHash, getScannerLink } from "@/lib/utils";
import type { CSSProperties } from "react";

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

const linkStyle: CSSProperties = {
  color: "#60A5FA",
  textDecoration: "none",
};

const mutedStyle: CSSProperties = {
  color: "rgba(255,255,255,0.3)",
};

function toNumber(value: number | string | null | undefined): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : parseFloat(value) || 0;
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

function TxHashCell({ txHash }: { txHash: string | null | undefined }) {
  const label = formatShortTxHash(txHash);
  const scannerUrl = txHash ? getScannerLink(txHash) : "";

  if (!scannerUrl) {
    return <span style={mutedStyle}>{label}</span>;
  }

  return (
    <a
      href={scannerUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      title={txHash ?? undefined}
    >
      {label}
    </a>
  );
}

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const recent = payments.slice(0, 100);

  return (
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
                  <TxHashCell txHash={p.tx_hash} />
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
  );
}
