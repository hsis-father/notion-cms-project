"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, ArrowLeftRight, Package } from "lucide-react";
import axios from "axios";

interface OnchainData {
  hashRate: number;
  txCount24h: number;
  mempoolSize: number;
  mempoolTxCount: number;
}

function formatHashrate(gh: number): string {
  if (gh >= 1e9) return `${(gh / 1e9).toFixed(2)} EH/s`;
  if (gh >= 1e6) return `${(gh / 1e6).toFixed(2)} PH/s`;
  if (gh >= 1e3) return `${(gh / 1e3).toFixed(2)} TH/s`;
  return `${gh.toFixed(2)} GH/s`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${(bytes / 1e3).toFixed(2)} KB`;
}

export function OnchainMetrics() {
  const { data, isLoading } = useQuery<OnchainData>({
    queryKey: ["bitcoin-onchain"],
    queryFn: () => axios.get("/api/bitcoin/onchain").then((r) => r.data),
    refetchInterval: 120_000,
  });

  const metrics = [
    {
      title: "네트워크 해시레이트",
      icon: Cpu,
      value: data ? formatHashrate(data.hashRate) : "-",
      desc: "채굴 난이도 지표",
    },
    {
      title: "24시간 거래 수",
      icon: ArrowLeftRight,
      value: data ? data.txCount24h.toLocaleString() : "-",
      desc: "온체인 활동량",
    },
    {
      title: "멤풀 크기",
      icon: Package,
      value: data ? formatBytes(data.mempoolSize) : "-",
      desc: `미확인 TX: ${data ? data.mempoolTxCount.toLocaleString() : "-"}건`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map(({ title, icon: Icon, value, desc }) => (
        <Card key={title}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Icon className="h-4 w-4" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-7 w-28 bg-muted rounded animate-pulse mb-1" />
            ) : (
              <p className="text-xl font-bold">{value}</p>
            )}
            <p className="text-xs text-muted-foreground">{desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
