import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Layers, Star, Heart, Zap, Check } from "lucide-react";

export const metadata = {
  title: "컴포넌트 | StarterKit",
  description: "shadcn/ui 기반 UI 컴포넌트 예제",
};

export default function ComponentsPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">UI 컴포넌트</h1>
        <p className="text-muted-foreground">shadcn/ui 기반 컴포넌트 예제 모음입니다.</p>
      </div>

      <div className="space-y-10">
        {/* 버튼 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">버튼 (Button)</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-3">
            <Button>기본</Button>
            <Button variant="secondary">보조</Button>
            <Button variant="outline">테두리</Button>
            <Button variant="ghost">고스트</Button>
            <Button variant="destructive">위험</Button>
            <Button variant="link">링크</Button>
            <Button disabled>비활성</Button>
            <Button size="sm">소형</Button>
            <Button size="lg">대형</Button>
            <Button size="icon"><Star className="h-4 w-4" /></Button>
            <Button className="gap-2"><Heart className="h-4 w-4" />아이콘 포함</Button>
          </div>
        </section>

        {/* 배지 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">배지 (Badge)</h2>
          <Separator className="mb-4" />
          <div className="flex flex-wrap gap-3">
            <Badge>기본</Badge>
            <Badge variant="secondary">보조</Badge>
            <Badge variant="outline">테두리</Badge>
            <Badge variant="destructive">위험</Badge>
            <Badge className="bg-green-500 text-white">커스텀</Badge>
          </div>
        </section>

        {/* 카드 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">카드 (Card)</h2>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  기능 카드
                </CardTitle>
                <CardDescription>카드 설명 텍스트입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  카드 본문 내용이 여기에 들어갑니다. 다양한 UI 요소를 담을 수 있습니다.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">확인</Button>
                <Button size="sm" variant="outline">취소</Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">추천</Badge>
                <CardTitle>프리미엄 플랜</CardTitle>
                <CardDescription>모든 기능 사용 가능</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">₩19,900<span className="text-base font-normal text-muted-foreground">/월</span></p>
                <ul className="space-y-2">
                  {["무제한 프로젝트", "팀 협업", "우선 지원", "고급 분석"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">시작하기</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>KD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">김도현</CardTitle>
                    <CardDescription>프론트엔드 개발자</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "이 스타터킷 덕분에 프로젝트를 훨씬 빠르게 시작할 수 있었어요!"
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 탭 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">탭 (Tabs)</h2>
          <Separator className="mb-4" />
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="details">상세</TabsTrigger>
              <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">개요 탭 내용입니다. 프로젝트의 전반적인 정보를 표시합니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">상세 탭 내용입니다. 더 자세한 정보를 표시합니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">설정 탭 내용입니다. 환경설정 옵션을 표시합니다.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* 프로그레스 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">진행 표시 (Progress)</h2>
          <Separator className="mb-4" />
          <div className="space-y-4 max-w-md">
            {[
              { label: "전체 완성도", value: 78, color: "" },
              { label: "성능 점수", value: 95, color: "bg-green-500" },
              { label: "오류율", value: 15, color: "bg-red-500" },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{value}%</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </section>

        {/* 아바타 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">아바타 (Avatar)</h2>
          <Separator className="mb-4" />
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>KD</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">S</AvatarFallback>
            </Avatar>
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter) => (
                <Avatar key={letter} className="border-2 border-background">
                  <AvatarFallback className="text-xs">{letter}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                +5
              </div>
            </div>
          </div>
        </section>

        {/* 기술 스택 정보 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">기술 스택</h2>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "Next.js 15", color: "bg-black text-white dark:bg-white dark:text-black" },
              { name: "TypeScript", color: "bg-blue-600 text-white" },
              { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
              { name: "shadcn/ui", color: "bg-zinc-800 text-white" },
              { name: "React Query", color: "bg-red-500 text-white" },
              { name: "Recharts", color: "bg-green-600 text-white" },
            ].map(({ name, color }) => (
              <div key={name} className={`rounded-lg px-3 py-2 text-center text-sm font-medium ${color}`}>
                {name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
