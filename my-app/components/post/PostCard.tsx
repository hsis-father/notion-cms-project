import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/notion"

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            {post.category && (
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            )}
          </div>
          <CardTitle className="text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>

        {post.summary && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
          </CardContent>
        )}

        <CardFooter className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{post.published ? formatDate(post.published) : "날짜 없음"}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
