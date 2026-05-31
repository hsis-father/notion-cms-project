import Image from "next/image"
import type { NotionBlock } from "@/types/notion"

function extractText(richText: Array<{ plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean } }>): string {
  return richText?.map((t) => t.plain_text).join("") ?? ""
}

function RichText({ richText }: { richText: Array<{ plain_text: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean } }> }) {
  return (
    <>
      {richText?.map((t, i) => {
        const text = t.plain_text
        const a = t.annotations ?? {}
        if (a.code) return <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{text}</code>
        if (a.bold && a.italic) return <strong key={i}><em>{text}</em></strong>
        if (a.bold) return <strong key={i}>{text}</strong>
        if (a.italic) return <em key={i}>{text}</em>
        return <span key={i}>{text}</span>
      })}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any) {
  const { type } = block

  switch (type) {
    case "paragraph":
      return (
        <p className="mb-4 leading-7 text-foreground/90">
          <RichText richText={block.paragraph?.rich_text ?? []} />
        </p>
      )
    case "heading_1":
      return (
        <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight">
          <RichText richText={block.heading_1?.rich_text ?? []} />
        </h1>
      )
    case "heading_2":
      return (
        <h2 className="mt-6 mb-3 text-2xl font-semibold tracking-tight border-b pb-2">
          <RichText richText={block.heading_2?.rich_text ?? []} />
        </h2>
      )
    case "heading_3":
      return (
        <h3 className="mt-5 mb-2 text-xl font-semibold">
          <RichText richText={block.heading_3?.rich_text ?? []} />
        </h3>
      )
    case "bulleted_list_item":
      return (
        <li className="ml-6 mb-1 list-disc leading-7">
          <RichText richText={block.bulleted_list_item?.rich_text ?? []} />
        </li>
      )
    case "numbered_list_item":
      return (
        <li className="ml-6 mb-1 list-decimal leading-7">
          <RichText richText={block.numbered_list_item?.rich_text ?? []} />
        </li>
      )
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4">
          <code className="font-mono text-sm text-foreground">
            {extractText(block.code?.rich_text ?? [])}
          </code>
          {block.code?.language && (
            <div className="mt-2 text-xs text-muted-foreground">{block.code.language}</div>
          )}
        </pre>
      )
    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
          <RichText richText={block.quote?.rich_text ?? []} />
        </blockquote>
      )
    case "divider":
      return <hr className="my-6 border-border" />
    case "image": {
      const src =
        block.image?.type === "external"
          ? block.image.external?.url
          : block.image?.file?.url
      const caption = extractText(block.image?.caption ?? [])
      if (!src) return null
      return (
        <figure className="my-6">
          <div className="relative w-full overflow-hidden rounded-lg" style={{ minHeight: 200 }}>
            <Image
              src={src}
              alt={caption || "블로그 이미지"}
              width={800}
              height={450}
              className="w-full h-auto rounded-lg object-cover"
              unoptimized={src.includes("prod-files-secure")}
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>
          )}
        </figure>
      )
    }
    default:
      return null
  }
}

export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  // 리스트 항목 그룹화를 위한 렌더링
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i] as { type: string; id: string }

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const Tag = block.type === "bulleted_list_item" ? "ul" : "ol"
      const listItems: React.ReactNode[] = []

      while (i < blocks.length && (blocks[i] as { type: string }).type === block.type) {
        listItems.push(
          <span key={(blocks[i] as { id: string }).id}>
            {renderBlock(blocks[i])}
          </span>
        )
        i++
      }

      elements.push(
        <Tag key={`list-${block.id}`} className="my-4 space-y-1">
          {listItems}
        </Tag>
      )
    } else {
      const rendered = renderBlock(block)
      if (rendered) {
        elements.push(
          <span key={block.id} className="block">
            {rendered}
          </span>
        )
      }
      i++
    }
  }

  return (
    <article className="prose prose-neutral max-w-none dark:prose-invert">
      {elements}
    </article>
  )
}
