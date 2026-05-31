"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Bitcoin, Activity, DollarSign } from "lucide-react";
import axios from "axios";

interface PriceData {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  btcDominance: number;
}

function formatNumber(n: number, decimals = 0): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: decimals })}`;
}

export function PriceCard() {
  const { data, isLoading, error } = useQuery<PriceData>({
    queryKey: ["bitcoin-price"],
    queryFn: () => axios.get("/api/bitcoin/price").then((r) => r.data),
  });

  if (isLoading) return <PriceCardSkeleton />;
  if (error || !data) return <ErrorCard title="가격 데이터 오류" />;

  const isPositive = data.change24h >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Bitcoin className="h-4 w-4" />
            비트코인 현재 가격
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold">
              ${data.price.toLocaleString("en-US")}
            </span>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className="mb-1 gap-1"
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}{data.change24h.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">24시간 변동률</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            시가총액
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.marketCap)}</p>
          <p className="text-xs text-muted-foreground mt-1">BTC 도미넌스 {data.btcDominance.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Activity className="h-4 w-4" />
            24시간 거래량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatNumber(data.volume24h)}</p>
          <p className="text-xs text-muted-foreground mt-1">최근 24시간 기준</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PriceCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className={i === 0 ? "lg:col-span-2" : ""}>
          <CardHeader className="pb-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorCard({ title }: { title: string }) {
  return (
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <p className="text-sm text-destructive">{title}</p>
      </CardContent>
    </Card>
  );
}
