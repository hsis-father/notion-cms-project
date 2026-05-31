import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Layers, Zap, Shield, BarChart3, Palette, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Next.js 15",
    description: "App Router, Server Components, 최신 React 기능을 활용한 고성능 구조",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Palette,
    title: "shadcn/ui",
    description: "접근성을 고려한 아름다운 UI 컴포넌트 라이브러리",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "TypeScript",
    description: "타입 안전성으로 버그를 예방하고 개발 생산성을 높입니다",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "React Query",
    description: "서버 상태 관리, 캐싱, 자동 리페치로 데이터 동기화",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Bitcoin,
    title: "비트코인 분석",
    description: "실시간 온체인 데이터와 기술적 지표로 가격 방향성 예측",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Layers,
    title: "확장 가능한 구조",
    description: "컴포넌트, 페이지, API Route Handler 기반의 확장 가능한 아키텍처",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const techStack = [
  "Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4",
  "shadcn/ui", "React Query", "Recharts", "next-themes",
];

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4">
      {/* 히어로 섹션 */}
      <section className="py-20 text-center">
        <Badge variant="secondary" className="mb-4 gap-1">
          <Zap className="h-3 w-3" />
          Next.js 15 + shadcn/ui
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          나만의 웹 앱을{" "}
          <span className="text-primary">빠르게</span> 시작하세요
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Next.js 15, TypeScript, Tailwind CSS, shadcn/ui로 구성된 프로덕션 레디 스타터킷입니다.
          비트코인 온체인 분석 페이지가 포함되어 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/bitcoin">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Bitcoin className="h-5 w-5" />
              비트코인 분석 보기
            </Button>
          </Link>
          <Link href="/components">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Layers className="h-5 w-5" />
              컴포넌트 예제
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">포함된 기능</h2>
          <p className="text-muted-foreground">개발을 빠르게 시작하기 위한 모든 것이 준비되어 있습니다</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} mb-2`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="py-16 border-t">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">기술 스택</h2>
          <p className="text-muted-foreground text-sm">검증된 최신 기술로 구성</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm py-1 px-3">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 border-t">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-10 text-center">
            <Bitcoin className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">비트코인 분석 대시보드</h2>
            <p className="opacity-80 mb-6 max-w-md mx-auto">
              RSI, MACD, 볼린저 밴드, 이동평균선 등 기술적 지표와 온체인 데이터로
              가격 방향성을 분석합니다.
            </p>
            <Link href="/bitcoin">
              <Button variant="secondary" size="lg" className="gap-2">
                분석 시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
