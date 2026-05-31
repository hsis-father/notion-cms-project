"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { href: "/", label: "홈" },
  { href: "/category/Frontend", label: "Frontend" },
  { href: "/category/Backend", label: "Backend" },
  { href: "/category/DevOps", label: "DevOps" },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <BookOpen className="h-5 w-5" />
          <span>개발 블로그</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(pathname === href && "bg-muted font-medium")}
              >
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === href && "bg-muted font-medium")}
              >
                {label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
