"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { calculateBollingerBands } from "@/lib/indicators";
import type { OHLCVData } from "@/lib/indicators";

const PERIODS = [
  { label: "14일", days: "14" },
  { label: "30일", days: "30" },
  { label: "90일", days: "90" },
];

function formatPrice(v: number): string {
  if (v >= 100_000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

interface ChartPoint {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
}

export function PriceChart() {
  const [period, setPeriod] = useState("30");

  const { data: ohlcvData, isLoading } = useQuery<OHLCVData[]>({
    queryKey: ["bitcoin-ohlcv", period],
    queryFn: () => axios.get(`/api/bitcoin/ohlcv?days=${period}`).then((r) => r.data),
    refetchInterval: 300_000,
  });

  const chartData: ChartPoint[] = (ohlcvData ?? []).map((d) => ({
    date: new Date(d.time).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
    close: d.close,
    open: d.open,
    high: d.high,
    low: d.low,
  }));

  const closes = (ohlcvData ?? []).map((d) => d.close);
  const bb = closes.length >= 20 ? calculateBollingerBands(closes) : null;

  const minPrice = Math.min(...closes) * 0.98;
  const maxPrice = Math.max(...closes) * 1.02;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">가격 차트</CardTitle>
          <div className="flex gap-1">
            {PERIODS.map(({ label, days }) => (
              <Button
                key={days}
                variant={period === days ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPeriod(days)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-muted rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                interval="preserveStartEnd"
                className="text-muted-foreground"
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tickFormatter={formatPrice}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={60}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "종가"]}
                labelClassName="text-xs font-medium"
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                  fontSize: "12px",
                }}
              />
              {bb && (
                <>
                  <ReferenceLine y={bb.upper} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "BB상단", position: "insideTopRight", fontSize: 10, fill: "#ef4444" }} />
                  <ReferenceLine y={bb.middle} stroke="#6b7280" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "SMA20", position: "insideTopRight", fontSize: 10, fill: "#6b7280" }} />
                  <ReferenceLine y={bb.lower} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1.5} label={{ value: "BB하단", position: "insideBottomRight", fontSize: 10, fill: "#22c55e" }} />
                </>
              )}
              <Area
                type="monotone"
                dataKey="close"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
