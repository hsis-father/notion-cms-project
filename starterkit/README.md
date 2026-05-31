# Next.js 15 StarterKit

Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui 기반의 프로덕션 레디 웹 애플리케이션 스타터킷입니다.  
**비트코인 온체인 데이터 & 기술적 지표 분석 대시보드**가 포함되어 있습니다.

---

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| [Next.js](https://nextjs.org) | 15 (App Router) | 풀스택 프레임워크 |
| [React](https://react.dev) | 19 | UI 라이브러리 |
| [TypeScript](https://www.typescriptlang.org) | 5.x | 타입 안전성 |
| [Tailwind CSS](https://tailwindcss.com) | v4 | 유틸리티 CSS |
| [shadcn/ui](https://ui.shadcn.com) | latest | UI 컴포넌트 |
| [TanStack Query](https://tanstack.com/query) | v5 | 서버 상태 관리 |
| [Recharts](https://recharts.org) | v2 | 차트 라이브러리 |
| [next-themes](https://github.com/pacocoursey/next-themes) | latest | 다크/라이트 테마 |
| [Lucide React](https://lucide.dev) | latest | 아이콘 |
| [Axios](https://axios-http.com) | latest | HTTP 클라이언트 |

---

## 프로젝트 구조

```
starterkit/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/
│   │   │   └── bitcoin/            # 비트코인 API Route Handlers
│   │   │       ├── price/          # 현재 가격 & 시장 데이터
│   │   │       ├── ohlcv/          # OHLCV 캔들 데이터
│   │   │       ├── onchain/        # 온체인 지표 (해시레이트, 거래수 등)
│   │   │       └── fear-greed/     # 공포·탐욕 지수
│   │   ├── bitcoin/                # 비트코인 분석 페이지
│   │   ├── components/             # UI 컴포넌트 예제 페이지
│   │   ├── globals.css
│   │   ├── layout.tsx              # 루트 레이아웃 (Navbar, Footer 포함)
│   │   └── page.tsx                # 홈 페이지
│   ├── components/
│   │   ├── bitcoin/                # 비트코인 분석 컴포넌트
│   │   │   ├── PriceCard.tsx       # 현재 가격 & 시장 지표 카드
│   │   │   ├── OnchainMetrics.tsx  # 온체인 지표 카드
│   │   │   ├── TechnicalIndicators.tsx  # RSI, MACD, BB, MA 카드
│   │   │   ├── FearGreedGauge.tsx  # 공포·탐욕 게이지
│   │   │   ├── PriceChart.tsx      # 볼린저 밴드 포함 가격 차트
│   │   │   └── PredictionPanel.tsx # 종합 방향성 예측 패널
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   │   ├── Navbar.tsx          # 상단 네비게이션 바
│   │   │   ├── Footer.tsx          # 하단 푸터
│   │   │   └── ThemeToggle.tsx     # 다크/라이트 테마 전환 버튼
│   │   └── ui/                     # shadcn/ui 컴포넌트
│   ├── lib/
│   │   ├── indicators.ts           # 기술적 지표 계산 로직 (RSI, MACD, BB, MA)
│   │   ├── queryClient.ts          # TanStack Query 설정
│   │   └── utils.ts                # 공통 유틸리티 (cn 등)
│   └── providers/
│       └── Providers.tsx           # QueryClient + ThemeProvider 래퍼
├── public/
├── components.json                 # shadcn/ui 설정
├── next.config.ts
└── tsconfig.json
```

---

## 시작하기

### 사전 요구사항

- **Node.js** 18.17 이상
- **npm** 9 이상 (또는 pnpm / yarn)

### 설치 및 실행

```bash
# 1. 프로젝트 폴더로 이동
cd starterkit

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인합니다.

### 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 타입 검사
npx tsc --noEmit

# 린트
npm run lint
```

---

## 페이지 소개

### 홈 (`/`)

스타터킷 소개 랜딩 페이지입니다.

- 기능 카드 그리드 (Next.js 15, shadcn/ui, TypeScript, React Query 등)
- 기술 스택 뱃지 목록
- 비트코인 분석 페이지 & 컴포넌트 예제 페이지 바로가기 버튼

---

### 비트코인 분석 (`/bitcoin`)

실시간 온체인 데이터와 기술적 지표를 활용한 **가격 방향성 분석 대시보드**입니다.

#### 사용 API (무료, 인증 불필요)

| 데이터 | API 출처 | 갱신 주기 |
|--------|----------|-----------|
| 현재 가격, 시가총액, 24h 거래량 | CoinGecko API | 60초 |
| OHLCV 캔들 데이터 | CoinGecko API | 5분 |
| 네트워크 해시레이트, 24h 거래 수 | Blockchain.info API | 10분 |
| 멤풀 크기, 미확인 TX 수 | Mempool.space API | 60초 |
| 공포·탐욕 지수 | Alternative.me API | 1시간 |

#### 표시되는 기술적 지표

| 지표 | 파라미터 | 신호 기준 |
|------|----------|-----------|
| **RSI** | 기간 14 | ≤30 과매도(매수), ≥70 과매수(매도) |
| **MACD** | 12 / 26 / 9 | MACD > Signal → 상승, MACD < Signal → 하락 |
| **볼린저 밴드** | 기간 20, 2σ | 하단 근접 → 반등, 상단 근접 → 조정 |
| **이동평균선** | MA7, MA30, MA200 | 가격 > MA200 & MA7 > MA30 → 강세 배열 |

#### 가격 방향성 예측 알고리즘

5개 신호(RSI, MACD, 볼린저 밴드, 이동평균선, 공포·탐욕지수)에 각각 점수를 부여하여 **0~100점**으로 환산합니다.

| 점수 | 예측 방향 |
|------|-----------|
| 70 ~ 100 | 강한 매수 |
| 55 ~ 69 | 매수 |
| 45 ~ 54 | 중립 |
| 30 ~ 44 | 매도 |
| 0 ~ 29 | 강한 매도 |

> ⚠️ **면책 고지:** 본 분석은 기술적 지표 기반의 참고용 정보입니다.  
> 실제 투자 결정 전 더 많은 요인을 검토하고 전문가 조언을 구하시기 바랍니다.

---

### 컴포넌트 예제 (`/components`)

shadcn/ui 기반 컴포넌트 갤러리입니다. 실제 사용 코드를 참고하여 새 페이지에 바로 적용할 수 있습니다.

| 컴포넌트 | 예제 내용 |
|----------|-----------|
| **Button** | 6가지 variant, 3가지 size, 아이콘 포함 |
| **Badge** | 상태 표시용 뱃지 4종 |
| **Card** | 기능 소개 / 가격 플랜 / 사용자 리뷰 카드 |
| **Tabs** | 개요·상세·설정 탭 전환 |
| **Progress** | 진행률 표시 바 |
| **Avatar** | 단일 아바타, 그룹 오버랩 아바타 |

---

## 주요 기능 설명

### 다크/라이트 테마

네비게이션 바 우측의 달/해 아이콘 버튼으로 테마를 전환합니다.  
`next-themes` 기반이며 시스템 설정을 기본값으로 사용합니다.

### 반응형 레이아웃

- **데스크탑 (md 이상):** 가로 네비게이션 바
- **모바일 (md 미만):** 햄버거 메뉴 → 사이드 Sheet 패널

### 서버사이드 API 프록시

외부 API 호출은 모두 `src/app/api/bitcoin/` 내부 Route Handler를 통해 서버에서 처리합니다.  
CORS 문제를 방지하고, 향후 API 키 추가 시 클라이언트에 노출되지 않습니다.

### 자동 데이터 갱신

TanStack Query의 `refetchInterval` 설정으로 페이지 새로고침 없이 데이터가 자동 갱신됩니다.  
네트워크 오류 시 최대 2회 자동 재시도합니다.

---

## 확장 가이드

### 새 페이지 추가

```
1. src/app/[page-name]/page.tsx 파일 생성
2. src/components/layout/Navbar.tsx의 navItems 배열에 항목 추가
```

### 새 shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [컴포넌트명]
# 예: npx shadcn@latest add dialog
# 예: npx shadcn@latest add select
```

### 환경 변수 설정 (API 키 사용 시)

```bash
# .env.local 파일 생성
COINGECKO_API_KEY=your_api_key_here
```

---

## 라이선스

MIT License
