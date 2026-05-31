"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import {
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateMovingAverages,
} from "@/lib/indicators";
import type { OHLCVData } from "@/lib/indicators";

const signalColors = {
  bullish: "default",
  bearish: "destructive",
  neutral: "secondary",
} as const;

const signalLabels = {
  bullish: "상승",
  bearish: "하락",
  neutral: "중립",
  oversold: "과매도",
  overbought: "과매수",
};

export function TechnicalIndicators() {
  const { data: ohlcvData, isLoading } = useQuery<OHLCVData[]>({
    queryKey: ["bitcoin-ohlcv", "90"],
    queryFn: () => axios.get("/api/bitcoin/ohlcv?days=90").then((r) => r.data),
    refetchInterval: 300_000,
  });

  if (isLoading) return <IndicatorSkeleton />;
  if (!ohlcvData || ohlcvData.length === 0) return null;

  const closes = ohlcvData.map((d) => d.close);
  const currentPrice = closes[closes.length - 1];

  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const bb = calculateBollingerBands(closes);
  const ma = calculateMovingAverages(closes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* RSI */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">RSI (14)</CardTitle>
            <Badge variant={rsi.signal === "oversold" ? "default" : rsi.signal === "overbought" ? "destructive" : "secondary"}>
              {signalLabels[rsi.signal]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{rsi.value}</span>
            <div className="text-xs text-right text-muted-foreground">
              <p>과매도 &lt; 30</p>
              <p>과매수 &gt; 70</p>
            </div>
          </div>
          <Progress value={rsi.value} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </CardContent>
      </Card>

      {/* MACD */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">MACD (12,26,9)</CardTitle>
            <Badge variant={signalColors[macd.trend]}>
              {signalLabels[macd.trend]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">MACD</p>
              <p className={`font-bold text-sm ${macd.macd >= 0 ? "text-green-500" : "text-red-500"}`}>
                {macd.macd.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Signal</p>
              <p className="font-bold text-sm">{macd.signal.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Histogram</p>
              <p className={`font-bold text-sm ${macd.histogram >= 0 ? "text-green-500" : "text-red-500"}`}>
                {macd.histogram.toFixed(0)}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {macd.trend === "bullish" ? "MACD가 Signal 위 → 상승 모멘텀" :
             macd.trend === "bearish" ? "MACD가 Signal 아래 → 하락 모멘텀" : "신호 대기 중"}
          </p>
        </CardContent>
      </Card>

      {/* 볼린저 밴드 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">볼린저 밴드 (20,2)</CardTitle>
            <Badge variant={
              bb.position === "near_lower" || bb.position === "below" ? "default" :
              bb.position === "near_upper" || bb.position === "above" ? "destructive" : "secondary"
            }>
              %B {bb.percentB.toFixed(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">상단</span>
              <span className="font-medium">${bb.upper.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">중간 (SMA20)</span>
              <span className="font-medium">${bb.middle.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">현재가</span>
              <span className="font-bold text-primary">${currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">하단</span>
              <span className="font-medium">${bb.lower.toLocaleString()}</span>
            </div>
          </div>
          <Progress value={Math.min(100, Math.max(0, bb.percentB))} className="h-2" />
        </CardContent>
      </Card>

      {/* 이동평균선 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">이동평균선</CardTitle>
            <Badge variant={signalColors[ma.trend]}>
              {signalLabels[ma.trend]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1 text-sm">
            {[
              { label: "MA7", value: ma.ma7, compare: currentPrice },
              { label: "MA30", value: ma.ma30, compare: currentPrice },
              { label: "MA200", value: ma.ma200, compare: currentPrice },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-medium ${
                  value > 0 && currentPrice > value ? "text-green-500" : "text-red-500"
                }`}>
                  {value > 0 ? `$${value.toLocaleString()}` : "데이터 부족"}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-1">
              <span className="text-muted-foreground font-medium">현재가</span>
              <span className="font-bold text-primary">${currentPrice.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IndicatorSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
