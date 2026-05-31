import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/providers/Providers"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: {
    default: "개발 블로그",
    template: "%s | 개발 블로그",
  },
  description: "Notion CMS 기반 개인 기술 블로그",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            본문으로 이동
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
