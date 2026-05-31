"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import PostList from "./PostList"
import type { Post } from "@/types/notion"

type Props = {
  posts: Post[]
  categories: string[]
}

export default function PostListClient({ posts, categories }: Props) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const filtered = posts.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true
    return matchesQuery && matchesCategory
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="글 제목 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
          >
            전체
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      {query && (
        <p className="mb-4 text-sm text-muted-foreground">
          &ldquo;{query}&rdquo; 검색 결과 {filtered.length}개
        </p>
      )}

      <PostList posts={filtered} />
    </div>
  )
}
