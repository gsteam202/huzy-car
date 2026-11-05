"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendPoint {
  year: string;
  avgPrice: number; // 만원 단위
  minPrice: number;
  maxPrice: number;
  depreciationRate: number;
}

export function PriceTrendChart({ data }: { data: TrendPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        시세 추이 데이터가 충분하지 않습니다.
      </div>
    );
  }

  // Reverse so older year is on left, newer on right
  const sorted = [...data].reverse();

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sorted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#94a3b8"
            tickFormatter={(val) => `${val.toLocaleString()}만`}
          />
          <Tooltip
            formatter={(value: any, name: any) => {
              if (name === "avgPrice") return [`${value.toLocaleString()}만원`, "평균 시세"];
              if (name === "minPrice") return [`${value.toLocaleString()}만원`, "최저 시세"];
              if (name === "maxPrice") return [`${value.toLocaleString()}만원`, "최고 시세"];
              return [value, name];
            }}
          />
          <Legend
            formatter={(val) => {
              if (val === "avgPrice") return "평균 시세";
              if (val === "minPrice") return "최저 시세";
              if (val === "maxPrice") return "최고 시세";
              return val;
            }}
          />
          <Line
            type="monotone"
            dataKey="avgPrice"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="minPrice"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="maxPrice"
            stroke="#cbd5e1"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
