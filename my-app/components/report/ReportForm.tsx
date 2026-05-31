"use client"

import { useActionState, useRef } from "react"
import { CheckCircle2, AlertCircle, Send } from "lucide-react"
import { submitReport, type ReportFormState } from "@/app/report/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const CATEGORIES = ["버그 신고", "기능 요청", "오류 신고", "기타"] as const

const initialState: ReportFormState = { status: "idle", message: "" }

export default function ReportForm() {
  const [state, action, isPending] = useActionState(submitReport, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-lg font-semibold">{state.message}</p>
        <Button
          variant="outline"
          onClick={() => {
            formRef.current?.reset()
            window.location.reload()
          }}
        >
          새 신고 작성하기
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5">
      {state.status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <fieldset className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          카테고리 <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                "has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary",
                "hover:bg-muted"
              )}
            >
              <input
                type="radio"
                name="category"
                value={cat}
                className="sr-only"
                required
              />
              {cat}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          제목 <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          placeholder="신고 제목을 입력하세요 (5자 이상)"
          maxLength={100}
          required
        />
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium">
          내용 <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="content"
          name="content"
          placeholder="신고 내용을 자세히 입력해 주세요 (10자 이상)"
          rows={6}
          maxLength={2000}
          required
        />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
            이름 <span className="text-xs">(선택)</span>
          </label>
          <Input id="name" name="name" placeholder="익명" maxLength={50} />
        </fieldset>

        <fieldset className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            이메일 <span className="text-xs">(선택 · 답변 수신용)</span>
          </label>
          <Input id="email" name="email" type="email" placeholder="example@email.com" maxLength={100} />
        </fieldset>
      </div>

      <Button type="submit" disabled={isPending} className="self-end gap-2">
        <Send className="h-4 w-4" />
        {isPending ? "접수 중..." : "신고 접수하기"}
      </Button>
    </form>
  )
}
