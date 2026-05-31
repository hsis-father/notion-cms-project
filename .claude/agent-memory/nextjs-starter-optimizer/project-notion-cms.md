---
name: project-notion-cms
description: Notion CMS 블로그 프로젝트 초기화 패턴 및 특이사항 기록
metadata:
  type: project
---

이 프로젝트는 `my-app/` 디렉토리를 Notion CMS 기반 개인 블로그로 변환하는 작업이다.

**Why:** Next.js 기본 스타터킷 데모 콘텐츠를 제거하고 PRD/ROADMAP 기반의 타입 안전한 뼈대 구조로 교체하여 Phase별 개발이 가능하도록 기반을 마련하기 위함.

**How to apply:** Phase 2부터는 `lib/notion.ts`의 TODO 함수들을 순서대로 구현하고, Phase 3에서 컴포넌트를 채워나간다.

## 특이사항

- Next.js 16.2.6 / React 19 / Tailwind CSS v4 사용 (`tailwind.config.ts` 없음, `@import "tailwindcss"` 방식)
- `@/*` 경로 별칭이 `./src/*`가 아닌 `./*`로 설정됨 (src/ 디렉토리 없음)
- `.gitignore`에 `.env*` 전체 무시 규칙 있음 → `.env.example`은 `!.env.example`로 예외 처리 필요
- shadcn/ui는 Tailwind v4 호환성 문제로 CLI 초기화 없이 `components/ui/` 디렉토리만 생성

## 구현된 파일 목록 (Phase 1 완료)

- `types/notion.ts` — Post, Category, NotionBlock 타입
- `lib/notion.ts` — Notion 클라이언트 초기화 + 함수 시그니처
- `lib/utils.ts` — cn(), formatDate(), createSlug()
- `components/layout/Header.tsx`, `Footer.tsx` — 뼈대
- `components/post/PostCard.tsx`, `PostList.tsx`, `NotionRenderer.tsx` — 뼈대
- `app/posts/[slug]/page.tsx`, `app/category/[name]/page.tsx` — 동적 라우트 플레이스홀더
- `.env.example` — Notion API 키 템플릿

## 설치된 패키지

- `@notionhq/client` — Notion API 클라이언트
- `lucide-react` — 아이콘
- `clsx` + `tailwind-merge` — cn() 유틸리티

## 동적 라우트 params 처리 주의

Next.js 16에서 동적 라우트의 `params`는 `Promise` 타입으로 변경됨:
```typescript
type Props = { params: Promise<{ slug: string }> };
const { slug } = await params;
```
