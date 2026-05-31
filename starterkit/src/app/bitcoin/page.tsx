import { PriceCard } from "@/components/bitcoin/PriceCard";
import { OnchainMetrics } from "@/components/bitcoin/OnchainMetrics";
import { TechnicalIndicators } from "@/components/bitcoin/TechnicalIndicators";
import { FearGreedGauge } from "@/components/bitcoin/FearGreedGauge";
import { PredictionPanel } from "@/components/bitcoin/PredictionPanel";
import { PriceChart } from "@/components/bitcoin/PriceChart";
import { Bitcoin, RefreshCw } from "lucide-react";

export const metadata = {
  title: "비트코인 분석 | StarterKit",
  description: "비트코인 온체인 데이터 및 기술적 지표 분석",
};

export default function BitcoinPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Bitcoin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">비트코인 분석 대시보드</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              실시간 온체인 데이터 및 기술적 지표 기반 가격 방향성 분석
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 가격 카드 */}
        <PriceCard />

        {/* 온체인 지표 */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            온체인 지표
          </h2>
          <OnchainMetrics />
        </section>

        {/* 가격 차트 */}
        <PriceChart />

        {/* 기술적 지표 */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            기술적 지표
          </h2>
          <TechnicalIndicators />
        </section>

        {/* 공포탐욕지수 + 예측 패널 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <FearGreedGauge />
          </div>
          <div className="lg:col-span-3">
            <PredictionPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
