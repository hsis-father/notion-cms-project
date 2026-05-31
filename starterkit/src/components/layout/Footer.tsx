import { Layers } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-screen-xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            <span>Next.js 15 StarterKit</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">홈</Link>
            <Link href="/bitcoin" className="hover:text-foreground transition-colors">비트코인</Link>
            <Link href="/components" className="hover:text-foreground transition-colors">컴포넌트</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StarterKit. Powered by Next.js & shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
