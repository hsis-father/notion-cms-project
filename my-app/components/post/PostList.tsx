import PostCard from "./PostCard"
import type { Post } from "@/types/notion"

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">아직 발행된 글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
