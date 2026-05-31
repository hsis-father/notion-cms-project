"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface FearGreedData {
  current: { value: number; classification: string };
  history: Array<{ value: number; classification: string; timestamp: number }>;
}

function getColor(value: number): string {
  if (value <= 20) return "text-red-600";
  if (value <= 40) return "text-orange-500";
  if (value <= 60) return "text-yellow-500";
  if (value <= 80) return "text-lime-500";
  return "text-green-500";
}

function getBgColor(value: number): string {
  if (value <= 20) return "bg-red-500";
  if (value <= 40) return "bg-orange-400";
  if (value <= 60) return "bg-yellow-400";
  if (value <= 80) return "bg-lime-400";
  return "bg-green-500";
}

function translateClassification(cls: string): string {
  const map: Record<string, string> = {
    "Extreme Fear": "극도의 공포",
    Fear: "공포",
    Neutral: "중립",
    Greed: "탐욕",
    "Extreme Greed": "극도의 탐욕",
  };
  return map[cls] ?? cls;
}

export function FearGreedGauge() {
  const { data, isLoading } = useQuery<FearGreedData>({
    queryKey: ["fear-greed"],
    queryFn: () => axios.get("/api/bitcoin/fear-greed").then((r) => r.data),
    refetchInterval: 3_600_000,
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          공포·탐욕 지수 (Fear & Greed)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-5xl font-bold ${getColor(data.current.value)}`}>
                  {data.current.value}
                </p>
                <p className="text-lg font-medium mt-1">
                  {translateClassification(data.current.classification)}
                </p>
              </div>
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 100 60" className="w-full">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={
                      data.current.value <= 20 ? "#dc2626" :
                      data.current.value <= 40 ? "#f97316" :
                      data.current.value <= 60 ? "#eab308" :
                      data.current.value <= 80 ? "#84cc16" : "#22c55e"
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(data.current.value / 100) * 125.6} 125.6`}
                  />
                  <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor" className="fill-foreground">
                    {data.current.value}
                  </text>
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">최근 7일 추이</p>
              <div className="flex gap-1 items-end">
                {data.history.slice(0, 7).reverse().map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm ${getBgColor(item.value)}`}
                      style={{ height: `${Math.max(4, (item.value / 100) * 40)}px` }}
                      title={`${item.value} - ${translateClassification(item.classification)}`}
                    />
                    <span className="text-[9px] text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-red-500">극도 공포</span>
              <span className="text-yellow-500">중립</span>
              <span className="text-green-500">극도 탐욕</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t">
              <div>
                <Badge variant="destructive" className="text-[10px] mb-1">0-24</Badge>
                <p className="text-muted-foreground">극도 공포<br/>역발상 매수</p>
              </div>
              <div>
                <Badge variant="secondary" className="text-[10px] mb-1">25-74</Badge>
                <p className="text-muted-foreground">공포·중립·탐욕<br/>추세 추종</p>
              </div>
              <div>
                <Badge variant="default" className="text-[10px] mb-1">75-100</Badge>
                <p className="text-muted-foreground">극도 탐욕<br/>역발상 매도</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">데이터를 가져오지 못했습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
