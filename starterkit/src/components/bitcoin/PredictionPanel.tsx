"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import axios from "axios";
import {
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateMovingAverages,
  calculatePrediction,
} from "@/lib/indicators";
import type { OHLCVData, SignalItem } from "@/lib/indicators";

interface FearGreedData {
  current: { value: number; classification: string };
}

const directionConfig = {
  strong_buy: {
    label: "강한 매수",
    icon: TrendingUp,
    color: "text-green-500",
    badgeVariant: "default" as const,
  },
  buy: {
    label: "매수",
    icon: TrendingUp,
    color: "text-green-400",
    badgeVariant: "default" as const,
  },
  neutral: {
    label: "중립",
    icon: Minus,
    color: "text-yellow-500",
    badgeVariant: "secondary" as const,
  },
  sell: {
    label: "매도",
    icon: TrendingDown,
    color: "text-red-400",
    badgeVariant: "destructive" as const,
  },
  strong_sell: {
    label: "강한 매도",
    icon: TrendingDown,
    color: "text-red-600",
    badgeVariant: "destructive" as const,
  },
};

function SignalRow({ signal }: { signal: SignalItem }) {
  const dotColor =
    signal.signal === "bullish" ? "bg-green-500" :
    signal.signal === "bearish" ? "bg-red-500" : "bg-gray-400";

  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-0">
      <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{signal.name}</span>
          <Badge
            variant={
              signal.signal === "bullish" ? "default" :
              signal.signal === "bearish" ? "destructive" : "secondary"
            }
            className="text-xs"
          >
            {signal.score > 0 ? `+${signal.score}` : signal.score}점
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
      </div>
    </div>
  );
}

export function PredictionPanel() {
  const { data: ohlcvData, isLoading: ohlcvLoading } = useQuery<OHLCVData[]>({
    queryKey: ["bitcoin-ohlcv", "90"],
    queryFn: () => axios.get("/api/bitcoin/ohlcv?days=90").then((r) => r.data),
    refetchInterval: 300_000,
  });

  const { data: fgData, isLoading: fgLoading } = useQuery<FearGreedData>({
    queryKey: ["fear-greed"],
    queryFn: () => axios.get("/api/bitcoin/fear-greed").then((r) => r.data),
    refetchInterval: 3_600_000,
  });

  const isLoading = ohlcvLoading || fgLoading;

  if (isLoading) return <PredictionSkeleton />;
  if (!ohlcvData || ohlcvData.length === 0) return null;

  const closes = ohlcvData.map((d) => d.close);
  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const bb = calculateBollingerBands(closes);
  const ma = calculateMovingAverages(closes);
  const fearGreedValue = fgData?.current.value ?? 50;

  const prediction = calculatePrediction(rsi, macd, bb, ma, fearGreedValue);
  const config = directionConfig[prediction.direction];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          가격 방향성 예측 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 종합 점수 */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground">종합 예측</p>
            <div className="flex items-center gap-2 mt-1">
              <Icon className={`h-6 w-6 ${config.color}`} />
              <span className={`text-2xl font-bold ${config.color}`}>{config.label}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">강세 점수</p>
            <p className="text-4xl font-bold">{prediction.total}<span className="text-base font-normal text-muted-foreground">/100</span></p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>강한 매도</span>
            <span>중립</span>
            <span>강한 매수</span>
          </div>
          <Progress value={prediction.total} className="h-3" />
        </div>

        {/* 개별 신호 */}
        <div>
          <p className="text-sm font-medium mb-2">신호 상세</p>
          <div>
            {prediction.signals.map((signal) => (
              <SignalRow key={signal.name} signal={signal} />
            ))}
          </div>
        </div>

        {/* 면책 고지 */}
        <p className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
          ⚠️ 본 분석은 기술적 지표를 기반으로 한 참고용 정보입니다. 실제 투자 결정에는
          더 많은 요인을 검토하고 전문가 조언을 구하시기 바랍니다.
        </p>
      </CardContent>
    </Card>
  );
}

function PredictionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-24 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
