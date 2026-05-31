export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-6 mt-12">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} 개발 블로그 · Notion CMS 기반</p>
      </div>
    </footer>
  )
}
