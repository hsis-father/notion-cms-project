# Development Guidelines — Notion CMS Blog

## 1. 프로젝트 개요

- **목적**: Notion을 CMS로 활용한 개인 기술 블로그 구축
- **런타임**: Next.js 16.2.6 / React 19 (App Router)
- **언어**: TypeScript (strict)
- **스타일**: Tailwind CSS 4 + shadcn/ui
- **CMS**: `@notionhq/client` — 서버 사이드 전용
- **상태 관리**: TanStack React Query v5 (클라이언트 페칭 한정)
- **배포**: Vercel (ISR 필수, `next export` 사용 불가)

---

## 2. 프로젝트 구조 및 파일 위치

```
notion-cms-project/
├── my-app/              ← 실제 구현 대상 (모든 기능은 여기에)
│   ├── app/
│   │   ├── layout.tsx           # 공통 레이아웃 (Providers + Navbar + Footer)
│   │   ├── page.tsx             # 홈: 글 목록
│   │   ├── posts/[slug]/page.tsx# 글 상세
│   │   └── category/[name]/page.tsx
│   ├── components/
│   │   ├── layout/              # Header.tsx, Footer.tsx
│   │   ├── post/                # PostCard.tsx, PostList.tsx, NotionRenderer.tsx
│   │   └── ui/                  # shadcn/ui 컴포넌트만
│   ├── lib/
│   │   ├── notion.ts            # Notion API 클라이언트 + 쿼리 함수
│   │   └── utils.ts             # cn() 유틸리티
│   ├── providers/
│   │   └── Providers.tsx        # QueryClientProvider + ThemeProvider
│   └── types/
│       └── notion.ts            # Post, Category 타입
├── starterkit/          ← 참고용 코드베이스 (수정 금지)
└── docs/                ← PRD.md, ROADMAP.md (수정 금지)
```

- **신규 파일은 반드시 `my-app/` 하위에 생성**
- `starterkit/`는 읽기 전용 참고 자료 — 직접 수정하지 않음
- `my-app/`과 `starterkit/` 사이에 코드를 공유(import)하지 않음

---

## 3. Next.js 버전 주의사항

- **코드 작성 전 `node_modules/next/dist/docs/` 문서를 반드시 확인**
- Next.js 16 / React 19는 학습 데이터와 API가 다를 수 있음
- `starterkit/`의 구현 패턴을 우선 참고 기준으로 사용

---

## 4. 컴포넌트 작성 규칙

### 서버 컴포넌트 (기본값)
- `async function` 사용 가능, `fetch` + `revalidate`로 ISR 처리
- Notion API 직접 호출 가능 (`lib/notion.ts` 함수 사용)
- `useState`, `useEffect`, 이벤트 핸들러 사용 불가

### 클라이언트 컴포넌트
- 파일 최상단에 `"use client"` 선언 필수
- 인터랙션(상태, 이벤트)이 필요한 경우에만 사용
- Notion API 직접 호출 금지 — 반드시 API Route 경유

### 판단 기준
```
인터랙션 필요? (useState, useEffect, onClick 등)
  YES → "use client" 추가
  NO  → 서버 컴포넌트 유지 (기본)
```

---

## 5. 데이터 페칭 패턴

### 서버 컴포넌트에서 Notion 직접 조회
```typescript
// app/page.tsx — 서버 컴포넌트
import { fetchPages } from "@/lib/notion";

export default async function Page() {
  const posts = await fetchPages();
  return <PostList posts={posts} />;
}
```

### ISR 설정
```typescript
// lib/notion.ts 내 fetch 호출 시
fetch(url, { next: { revalidate: 60 } }) // 60초 캐시
```

### 클라이언트에서 API Route 경유
```typescript
// 클라이언트 컴포넌트에서는 API Route만 호출
const { data } = useQuery({ queryKey: ["posts"], queryFn: () => axios.get("/api/posts") });
```

---

## 6. Notion API 규칙

- `lib/notion.ts`에 Notion 클라이언트 초기화 및 모든 쿼리 함수 집중
- 구현 함수 목록:
  - `fetchPages()` — Status=발행됨, Published 내림차순 정렬
  - `fetchPageContent(pageId: string)` — 블록 콘텐츠 조회
  - `getPostBySlug(slug: string)` — slug로 단일 글 조회
- `@notionhq/client`는 `lib/notion.ts`에서만 import
- **`NOTION_API_KEY`는 서버 사이드 전용 — `NEXT_PUBLIC_` 접두사 절대 사용 금지**

---

## 7. Notion 데이터베이스 속성

| 속성명 | 타입 | 비고 |
|--------|------|------|
| Title | title | 글 제목, slug 생성 기준 |
| Category | select | Frontend / Backend / DevOps |
| Tags | multi_select | React, TypeScript 등 |
| Published | date | 정렬 기준 |
| Status | select | `초안` / `발행됨` |

- `fetchPages()`는 `Status = 발행됨`인 항목만 반환
- slug는 Title을 kebab-case 변환하여 생성 (`lib/utils.ts`의 `toSlug()` 사용)

---

## 8. 타입 정의 규칙

- 모든 Notion 관련 타입은 `types/notion.ts`에 정의
- 인터페이스 접두사 `I` 사용 금지 (예: `Post` O, `IPost` X)
- 타입 예시:
```typescript
// types/notion.ts
export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  published: string; // ISO 날짜 문자열
  summary: string;
};
```

---

## 9. 파일명 및 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `PostCard.tsx`, `NotionRenderer.tsx` |
| 유틸리티/훅 파일 | camelCase | `notion.ts`, `usePosts.ts` |
| 타입 파일 | camelCase | `notion.ts` |
| 변수/함수명 | camelCase | `fetchPages`, `getPostBySlug` |
| 컴포넌트명 | PascalCase | `PostCard`, `NotionRenderer` |

- 들여쓰기: **2칸**
- 절대 경로: `@/` 사용 (`../../` 상대경로 금지)

---

## 10. 스타일링 규칙

- 모든 스타일은 **Tailwind CSS 유틸리티 클래스** 사용
- 조건부 클래스: `cn()` 함수 사용 (`lib/utils.ts`)
- shadcn/ui 컴포넌트는 `components/ui/`에 위치
- 다크모드: `next-themes`의 `ThemeProvider attribute="class"` 방식
- 인라인 `style` 속성 사용 금지

---

## 11. 공통 레이아웃 구성

`app/layout.tsx`의 구조를 반드시 준수:
```
<html>
  <body>
    <Providers>          ← QueryClientProvider + ThemeProvider
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Providers>
  </body>
</html>
```

- `Providers.tsx`는 `"use client"` 선언 필수
- 새 Provider 추가 시 `providers/Providers.tsx`에만 추가

---

## 12. NotionRenderer 블록 지원 범위

`components/post/NotionRenderer.tsx`에서 처리해야 할 블록 타입:

| 블록 타입 | HTML 변환 |
|-----------|-----------|
| `paragraph` | `<p>` |
| `heading_1` | `<h1>` |
| `heading_2` | `<h2>` |
| `heading_3` | `<h3>` |
| `code` | `<pre><code>` |
| `image` | Next.js `<Image>` |
| `bulleted_list_item` | `<ul><li>` |
| `numbered_list_item` | `<ol><li>` |
| `quote` | `<blockquote>` |
| `divider` | `<hr>` |

- 미지원 블록 타입은 렌더링 없이 건너뜀 (에러 발생 금지)

---

## 13. 환경 변수

```env
# .env.local (git 제외 필수)
NOTION_API_KEY=secret_xxxx        # 서버 전용
NOTION_DATABASE_ID=xxxx           # 서버 전용
```

- `.env.local`을 `.gitignore`에 반드시 포함
- 클라이언트에서 접근 가능한 `NEXT_PUBLIC_` 변수로 Notion 관련 키 절대 노출 금지

---

## 14. 금지 사항

- `@notionhq/client`를 클라이언트 컴포넌트(`"use client"`)에서 import
- `NOTION_API_KEY`를 `NEXT_PUBLIC_NOTION_API_KEY`로 선언
- `next export` 또는 `output: "export"` 설정 (ISR 동작 불가)
- `my-app/`에서 `starterkit/` 코드를 직접 import
- 컴포넌트 파일에 인라인 `style={{ }}` 속성 사용
- `../../` 상대 경로 사용 (`@/` 절대 경로 사용)
- `IPost`, `ICategory` 등 `I` 접두사 타입명 사용
- 서버 컴포넌트에 `useState`, `useEffect` 사용 (`"use client"` 없이)
- `lib/notion.ts` 외부에서 `@notionhq/client` 직접 초기화

---

## 15. 다중 파일 수정 시 동시 처리 규칙

| 변경 사항 | 동시 수정 파일 |
|-----------|--------------|
| 새 Notion 쿼리 함수 추가 | `lib/notion.ts` + `types/notion.ts` |
| 새 페이지 추가 | `app/.../page.tsx` + 필요한 컴포넌트 |
| 새 Provider 추가 | `providers/Providers.tsx` + `app/layout.tsx` (이미 Providers 래핑 중이면 layout.tsx 수정 불필요) |
| shadcn/ui 컴포넌트 추가 | `components/ui/` + 사용하는 컴포넌트 |
