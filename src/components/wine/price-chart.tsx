"use client";

import type { PricePoint } from "@/types/wine";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
  priceHistory: PricePoint[];
  className?: string;
}

interface TooltipPayloadItem {
  value: number;
  payload: PricePoint;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold text-foreground">
        {formatPrice(data.value)}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatDate(data.payload.date)}
      </p>
      <p className="text-xs text-muted-foreground">
        {data.payload.source}
      </p>
    </div>
  );
}

export function PriceChart({ priceHistory, className }: PriceChartProps) {
  if (priceHistory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        価格履歴データがありません。
      </p>
    );
  }

  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={sortedHistory}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value: string) => {
              const d = new Date(value);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => `¥${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#722f37"
            strokeWidth={2}
            dot={{ fill: "#722f37", r: 3 }}
            activeDot={{ r: 5, fill: "#722f37" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
