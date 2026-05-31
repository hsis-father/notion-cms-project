# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 중요: Next.js 버전 주의

이 프로젝트는 **Next.js 16.2.6 / React 19** 를 사용한다. 학습 데이터와 API, 컨벤션, 파일 구조가 다를 수 있으므로, Next.js 관련 코드를 작성하기 전에 반드시 `node_modules/next/dist/docs/`의 가이드를 확인할 것.

## 프로젝트 구조

이 저장소는 두 개의 독립된 Next.js 서브프로젝트와 공통 문서로 구성된다.

```
notion-cms-project/
├── my-app/          # 기본 Next.js 16 스타터 (루트 레벨 app/ 구조)
├── starterkit/      # 기능 완성형 스타터킷 (src/ 구조, 비트코인 대시보드 예제 포함)
└── docs/            # PRD.md, ROADMAP.md — 실제 Notion CMS 블로그 구현 계획
```

실제 Notion CMS 블로그는 아직 구현되지 않았으며, `docs/ROADMAP.md`에 따라 개발 예정이다.

## 개발 명령어

두 서브프로젝트 모두 동일한 스크립트를 사용하며, 각 디렉토리 안에서 실행해야 한다.

```bash
# my-app 또는 starterkit 디렉토리 내에서
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
npm run lint     # ESLint 실행
```

## starterkit 아키텍처

실제 Notion CMS 블로그를 구현할 때 참고할 기준 코드다.

**디렉토리 구조**
- `src/app/` — App Router 페이지 및 API Route Handler
- `src/components/layout/` — Navbar, Footer, ThemeToggle
- `src/components/bitcoin/` — 도메인별 클라이언트 컴포넌트 (데이터 페칭 포함)
- `src/components/ui/` — shadcn/ui 기반 공통 UI 컴포넌트
- `src/lib/` — `utils.ts` (`cn` 함수), `queryClient.ts`, `indicators.ts`
- `src/providers/Providers.tsx` — QueryClientProvider + ThemeProvider 래퍼

**데이터 페칭 패턴**
- 서버 컴포넌트: Next.js `fetch`의 `next: { revalidate: N }` 옵션으로 ISR 처리
- 클라이언트 컴포넌트: TanStack React Query + axios로 API Route 호출
- API Route는 `src/app/api/` 아래에 위치하며 외부 API를 프록시하는 역할

**Provider 적용 방식**
`src/app/layout.tsx`에서 `<Providers>`로 전체를 감싸고, 내부에 `<Navbar>`, `<main>`, `<Footer>` 순서로 배치한다.

**스타일링**
- Tailwind CSS 4 + shadcn/ui 사용
- `cn()` 유틸리티(`clsx` + `tailwind-merge`)로 조건부 클래스 처리
- 다크모드: `next-themes`의 `ThemeProvider`가 `attribute="class"` 방식으로 적용

## Notion CMS 블로그 구현 계획 요약

필수 환경변수 (`.env.local`):
```
NOTION_API_KEY=secret_xxxx
NOTION_DATABASE_ID=xxxx
```

## 프로젝트 문서

@docs/PRD.md
@docs/ROADMAP.md
