import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  )
}
