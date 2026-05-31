import type { Metadata } from "next"
import { Megaphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ReportForm from "@/components/report/ReportForm"

export const metadata: Metadata = {
  title: "신고 게시판",
  description: "버그, 오류, 기능 요청 등을 신고해 주세요.",
}

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-start gap-3">
        <Megaphone className="mt-1 h-7 w-7 shrink-0 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">신고 게시판</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            버그, 오류, 기능 요청 등 불편한 사항을 알려주세요. 빠르게 검토하겠습니다.
          </p>
        </div>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3 text-center text-sm">
        {[
          { label: "버그 신고", desc: "예상치 못한 오작동" },
          { label: "기능 요청", desc: "새로운 기능 제안" },
          { label: "오류 신고", desc: "콘텐츠 오류 제보" },
        ].map(({ label, desc }) => (
          <div key={label} className="rounded-lg border bg-muted/40 px-3 py-3">
            <p className="font-medium">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      <Separator className="mb-8" />

      <Card>
        <CardHeader>
          <CardTitle>신고 작성</CardTitle>
          <CardDescription>
            <span className="text-destructive font-medium">*</span> 표시 항목은 필수입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ReportForm />
        </CardContent>
      </Card>
    </div>
  )
}
