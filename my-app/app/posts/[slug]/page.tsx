import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchPages, fetchPageBySlug, fetchPageContent } from "@/lib/notion"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import NotionRenderer from "@/components/post/NotionRenderer"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await fetchPages()
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPageBySlug(slug)
  if (!post) return { title: "글을 찾을 수 없습니다" }
  return {
    title: post.title,
    description: post.summary || `${post.title} - 개발 블로그`,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.published,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  let post = null
  let allPosts: import("@/types/notion").Post[] = []

  try {
    ;[post, allPosts] = await Promise.all([fetchPageBySlug(slug), fetchPages()])
  } catch {
    notFound()
  }

  if (!post) notFound()

  const blocks = await fetchPageContent(post.id)

  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = allPosts[currentIndex + 1] ?? null
  const nextPost = allPosts[currentIndex - 1] ?? null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.category && (
            <Badge variant="secondary">{post.category}</Badge>
          )}
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">{post.title}</h1>

        {post.published && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <time dateTime={post.published}>{formatDate(post.published)}</time>
          </div>
        )}
      </header>

      <Separator className="mb-8" />

      <NotionRenderer blocks={blocks} />

      <Separator className="mt-12 mb-8" />

      <nav className="flex items-center justify-between gap-4">
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="line-clamp-1">{prevPost.title}</span>
          </Link>
        ) : (
          <span />
        )}

        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group text-right"
          >
            <span className="line-clamp-1">{nextPost.title}</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
