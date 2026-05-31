import type { Metadata } from "next"
import { fetchPages } from "@/lib/notion"
import PostList from "@/components/post/PostList"

type Props = {
  params: Promise<{ name: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await fetchPages()
    const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))]
    return categories.map((name) => ({ name: encodeURIComponent(name) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const categoryName = decodeURIComponent(name)
  return {
    title: `${categoryName} 카테고리`,
    description: `${categoryName} 카테고리의 글 목록`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params
  const categoryName = decodeURIComponent(name)

  let posts: import("@/types/notion").Post[] = []
  try {
    const allPosts = await fetchPages()
    posts = allPosts.filter((p) => p.category === categoryName)
  } catch {
    posts = []
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">카테고리</p>
        <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        <p className="text-muted-foreground mt-1">총 {posts.length}개의 글</p>
      </section>

      <PostList posts={posts} />
    </div>
  )
}
