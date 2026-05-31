"use server"

export type ReportCategory = "버그 신고" | "기능 요청" | "오류 신고" | "기타"

export type ReportFormState = {
  status: "idle" | "success" | "error"
  message: string
}

export async function submitReport(
  _prevState: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const title = formData.get("title")?.toString().trim()
  const category = formData.get("category")?.toString().trim()
  const content = formData.get("content")?.toString().trim()
  const name = formData.get("name")?.toString().trim()
  const email = formData.get("email")?.toString().trim()

  if (!title || !category || !content) {
    return { status: "error", message: "제목, 카테고리, 내용은 필수 항목입니다." }
  }
  if (title.length < 5) {
    return { status: "error", message: "제목은 5자 이상 입력해 주세요." }
  }
  if (content.length < 10) {
    return { status: "error", message: "내용은 10자 이상 입력해 주세요." }
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "올바른 이메일 형식이 아닙니다." }
  }

  // 실제 운영 시 여기서 DB 저장 또는 이메일 발송 처리
  console.log("[신고 접수]", { title, category, content, name: name || "익명", email: email || "-" })

  return { status: "success", message: "신고가 접수되었습니다. 검토 후 처리하겠습니다." }
}
