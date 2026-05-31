# ROADMAP: 개인 개발 블로그 (Notion CMS 기반)

> PRD 기준 버전: v1.0.0 | 작성일: 2026-05-31

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 | 누적 |
|-------|------|-----------|------|
| Phase 1 | 프로젝트 초기 설정 | 1~2일 | ~2일 |
| Phase 2 | 공통 모듈 개발 | 2~3일 | ~5일 |
| Phase 3 | 핵심 기능 개발 | 3~4일 | ~9일 |
| Phase 4 | 추가 기능 개발 | 2~3일 | ~12일 |
| Phase 5 | 최적화 및 배포 | 1~2일 | ~14일 |

---

## Phase 1: 프로젝트 초기 설정 (1~2일)

> **이유:** 견고한 기반 없이는 기능 개발이 어려움

### 목표
Next.js 프로젝트 구조를 설정하고, Notion API 연동을 위한 환경을 구축한다.

### 작업 목록

- [ ] **Next.js 15 프로젝트 생성**
  - `create-next-app`으로 App Router 기반 프로젝트 생성
  - TypeScript 설정

- [ ] **패키지 및 도구 설정**
  - Tailwind CSS 설정
  - shadcn/ui 초기화
  - Lucide React 설치
  - `@notionhq/client` 패키지 설치

- [ ] **Notion API 환경 구축**
  - Notion Integration 생성 및 API 키 발급
  - Notion 데이터베이스 생성 및 속성 구조 설정 (PRD 5.1 참고)
  - `.env.local` 파일 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)

- [ ] **기본 레이아웃 구조 생성**
  - `app/layout.tsx` 공통 레이아웃 뼈대 작성
  - 디렉토리 구조 초기화 (`app/`, `components/`, `lib/`, `types/`)

### 완료 기준
- `npm run dev` 실행 시 Next.js 기본 화면이 정상 출력됨
- `.env.local`에 Notion 키가 설정되어 있음

---

## Phase 2: 공통 모듈 개발 (2~3일)

> **이유:** 모든 기능에서 재사용되는 코드를 먼저 만들어야 중복을 방지할 수 있음

### 목표
Notion API 공통 함수, 공통 컴포넌트, 타입 정의를 완성하여 이후 기능 개발의 기반을 마련한다.

### 작업 목록

- [ ] **Notion API 클라이언트 및 공통 함수 구현** (`lib/notion.ts`)
  - Notion API 클라이언트 초기화
  - `fetchPages` — 발행된 글 목록 조회 (`Status = 발행됨`, 최신순 정렬)
  - `fetchPageContent` — 개별 글의 블록 콘텐츠 조회

- [ ] **공통 타입 정의** (`types/notion.ts`)
  - `Post` 타입 (title, category, tags, published, status, slug)
  - `Category` 타입
  - Notion 블록 관련 타입

- [ ] **공통 컴포넌트 구현**
  - `components/layout/Header.tsx` — 로고, 네비게이션
  - `components/layout/Footer.tsx`
  - `components/post/PostCard.tsx` — 제목, 카테고리, 태그, 발행일, 요약 표시

- [ ] **유틸리티 함수 구현** (`lib/utils.ts`)
  - 날짜 포맷 함수
  - slug 생성/파싱 함수

### 완료 기준
- `fetchPages()` 호출 시 Notion 데이터베이스에서 글 목록이 반환됨
- `PostCard` 컴포넌트에 mock 데이터를 넣었을 때 정상 렌더링됨

---

## Phase 3: 핵심 기능 개발 (3~4일)

> **이유:** 블로그의 가장 기본이 되는 기능으로, 이 단계가 완료되어야 블로그로서의 역할을 할 수 있음

### 목표
블로그 글 목록 페이지와 글 상세 페이지를 구현하고, Notion 콘텐츠 렌더링을 완성한다.

### 작업 목록

- [ ] **글 목록 페이지** (`app/page.tsx`)
  - `fetchPages()`로 글 목록 데이터 조회 (서버 컴포넌트)
  - `PostList` 컴포넌트로 카드 그리드 렌더링
  - 기본 레이아웃(Header + 콘텐츠 + Footer) 적용

- [ ] **Notion 콘텐츠 렌더러** (`components/post/NotionRenderer.tsx`)
  - 지원 블록 타입 구현:
    - 단락 (`paragraph`)
    - 제목 (`heading_1`, `heading_2`, `heading_3`)
    - 코드 블록 (`code`)
    - 이미지 (`image`)
    - 목록 (`bulleted_list_item`, `numbered_list_item`)
    - 인용구 (`quote`)
    - 구분선 (`divider`)

- [ ] **글 상세 페이지** (`app/posts/[slug]/page.tsx`)
  - `getPostBySlug`, `getPostContent` 함수 구현
  - `NotionRenderer`로 본문 렌더링
  - 제목, 카테고리, 태그, 발행일 표시
  - 이전 글 / 다음 글 네비게이션

### 완료 기준
- 홈(`/`)에서 Notion의 발행된 글 목록이 카드 형태로 노출됨
- 카드 클릭 시 `/posts/[slug]`로 이동하여 본문이 정상 렌더링됨
- 이전/다음 글 네비게이션이 동작함

---

## Phase 4: 추가 기능 개발 (2~3일)

> **이유:** 핵심 기능이 완성된 후 사용성을 높이는 부가 기능을 추가

### 목표
카테고리 필터링, 검색 기능, SEO 최적화를 추가하여 블로그의 완성도를 높인다.

### 작업 목록

- [ ] **카테고리 필터링**
  - 카테고리 필터 버튼 컴포넌트 구현
  - 선택된 카테고리에 해당하는 글만 필터링하여 표시
  - 카테고리별 페이지 구현 (`app/category/[name]/page.tsx`)

- [ ] **검색 기능**
  - 검색창 컴포넌트 구현
  - 클라이언트 사이드 필터링 (글 제목 기준)
  - 검색 결과 실시간 반영

- [ ] **SEO 최적화**
  - Next.js Metadata API 활용
  - 페이지별 `title`, `description` 동적 설정
  - 글 상세 페이지 OG 메타데이터 설정

### 완료 기준
- 카테고리 버튼 클릭 시 해당 카테고리의 글만 표시됨
- 검색창에 키워드 입력 시 관련 글이 실시간으로 필터링됨
- 각 페이지의 `<title>`이 Notion 글 제목과 일치함

---

## Phase 5: 최적화 및 배포 (1~2일)

> **이유:** 기능이 완성된 후 품질을 높이고 실제 서비스 환경에 배포

### 목표
성능 최적화, 반응형 디자인 점검을 완료하고 Vercel에 배포한다.

### 작업 목록

- [ ] **성능 최적화**
  - Next.js `Image` 컴포넌트로 이미지 최적화
  - 불필요한 리렌더링 점검
  - LCP 3초 이내 달성 확인

- [ ] **반응형 디자인 개선**
  - 모바일(360px~), 태블릿(768px~), 데스크탑(1024px~) 전체 점검
  - Tailwind CSS 반응형 유틸리티 적용 완료

- [ ] **UI 마무리**
  - shadcn/ui 컴포넌트로 전체 스타일 통일
  - 접근성 점검 (시맨틱 HTML, `alt` 텍스트)

- [ ] **Vercel 배포**
  - GitHub 연동 및 Vercel 프로젝트 생성
  - 환경 변수 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`) Vercel에 등록
  - 프로덕션 배포 및 동작 확인

### 완료 기준
- Vercel에서 발급된 URL로 블로그에 정상 접근 가능
- 모바일/태블릿/데스크탑 모두 레이아웃이 깨지지 않음
- LCP 3초 이내 달성

---

## MVP 체크리스트

PRD 7장 기준 MVP 범위 최종 확인

- [ ] Notion API 연동 (글 목록, 글 상세)
- [ ] 글 목록 페이지 (`/`)
- [ ] 글 상세 페이지 (`/posts/[slug]`)
- [ ] 카테고리 필터링
- [ ] 기본 검색 (클라이언트 사이드)
- [ ] Tailwind CSS 기반 기본 스타일링
- [ ] 반응형 디자인
- [ ] Vercel 배포

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0.0 | 2026-05-31 | 최초 작성 |
