import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { Post, NotionBlock } from "@/types/notion"
import { createSlug } from "@/lib/utils"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DATABASE_ID = process.env.NOTION_DATABASE_ID!

type RichTextItem = { plain_text: string }

function extractText(richText: RichTextItem[] | undefined): string {
  return richText?.map((t) => t.plain_text).join("") ?? ""
}

function pageToPost(page: PageObjectResponse): Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>
  const title = extractText(props.Title?.title ?? [])
  return {
    id: page.id,
    slug: createSlug(title),
    title,
    category: props.Category?.select?.name ?? "",
    tags: props.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
    published: props.Published?.date?.start ?? "",
    status: props.Status?.select?.name ?? "초안",
    summary: "",
  }
}

export async function fetchPages(): Promise<Post[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
    filter: {
      property: "Status",
      select: { equals: "발행됨" },
    },
    sorts: [{ property: "Published", direction: "descending" }],
  })

  const pages = response.results.filter(
    (r): r is PageObjectResponse => r.object === "page" && "properties" in r
  )

  const posts = pages.map(pageToPost)

  const postsWithSummary = await Promise.all(
    posts.map(async (post) => {
      try {
        const blocks = await fetchPageContent(post.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstParagraph = blocks.find((b: any) => b.type === "paragraph") as any
        const summaryText = extractText(firstParagraph?.paragraph?.rich_text ?? [])
        return { ...post, summary: summaryText.slice(0, 150) }
      } catch {
        return post
      }
    })
  )

  return postsWithSummary
}

export async function fetchPageBySlug(slug: string): Promise<Post | null> {
  const posts = await fetchPages()
  return posts.find((p) => p.slug === slug) ?? null
}

export async function fetchPageContent(pageId: string): Promise<NotionBlock[]> {
  const response = await notion.blocks.children.list({ block_id: pageId })
  return response.results as NotionBlock[]
}
