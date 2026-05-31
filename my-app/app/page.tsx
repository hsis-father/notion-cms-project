import { fetchPages } from "@/lib/notion"
import PostListClient from "@/components/post/PostListClient"

export default async function HomePage() {
  let posts: import("@/types/notion").Post[] = []
  try {
    posts = await fetchPages()
  } catch {
    posts = []
  }

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">개발 블로그</h1>
        <p className="text-muted-foreground">Notion으로 작성하는 기술 블로그</p>
      </section>

      <PostListClient posts={posts} categories={categories} />
    </div>
  )
}
