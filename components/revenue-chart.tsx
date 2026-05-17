"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartDay } from "@/lib/types";

function RevenueChart({ data }: { data: ChartDay[] }) {
  return (
    <div style={{ height: "280px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px",
            }}
            formatter={(value) => {
              const n = typeof value === "number" ? value : Number(value ?? 0);
              return [`$${n.toFixed(3)} USDC`, "Revenue"];
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
            cursor={false}
          />
          <Bar dataKey="revenue" fill="rgba(255,255,255,0.7)" radius={[4, 4, 0, 0]} activeBar={{ fill: "rgba(255,255,255,0.95)" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { RevenueChart };
export default RevenueChart;