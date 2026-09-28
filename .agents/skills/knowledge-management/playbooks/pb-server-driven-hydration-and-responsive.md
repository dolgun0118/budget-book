# Server-Driven 초기 데이터 주입 및 320px 모바일 반응형 구현 가이드

> **문서 ID**: PB-ARCH-001  
> **최초 작성일**: 2026-09-28  
> **최종 수정일**: 2026-09-28  
> **버전**: v1.0.0  
> **상태**: Active  

---

# 목적
1. 클라이언트의 워터폴(Waterfall) 비동기 호출 및 localStorage 의존성을 제거하고, Next.js Server Component 기반의 **Server-Driven Hydration 아키텍처**를 구축합니다.
2. 초소형 모바일 디바이스(**최소 320px**)에서도 레이아웃 깨짐, 가로 스크롤 밀림, 텍스트 꺾임 없이 완벽히 동작하는 반응형 UI를 구현합니다.

---

# 언제 사용하는가
- 클라이언트 컴포넌트 진입 시 여러 API/DB 조회를 반복하며 로딩 스피너(워터폴)가 발생하는 기능을 리팩토링할 때
- 날짜 필터, 카테고리 등 초기 구동 메타데이터를 클라이언트 연산 대신 서버에서 한 번에 조립해 내려주고자 할 때
- 모바일(최소 폭 320px ~ 태블릿/데스크톱) 전 기기 대응 반응형 레이아웃을 작성하거나 검증할 때
- 하드코딩된 설정값(매직 넘버, 인라인 HEX 색상, 레이아웃 규격 등)을 전역 config 및 토큰 시스템으로 추출할 때

---

# 필요한 입력
- 데이터베이스 모델 및 조회 대상 테이블 명세 (`ledger_entries`, `major_categories`, `sub_categories`)
- 서비스 및 브랜딩 설정값 (`APP_TITLE`, `APP_DISPLAY_NAME` 등)
- 반응형 UI 타깃 규격 (최소 320px, 모바일 패딩, 테이블 최소 스크롤 폭 등)

---

# 작업 절차

## Step 1: 클라이언트 로컬 캐시(localStorage) Fallback 제거 및 단일 진실 공급원(SSOT) 확립
1. 훅 및 컴포넌트에서 `localStorage` 관련 읽기/쓰기/임시 저장 로직을 전면 제거합니다.
2. 데이터 저장소의 유일한 진실 공급원(SSOT)을 Supabase/서버 DB로 일원화합니다.
3. 조회 실패 또는 데이터 부재 시 임의의 로컬 fallback을 만들지 않고 빈 배열(`[]`) 또는 명시적 에러 상태로 처리합니다.

## Step 2: 하드코딩 값의 Config 및 토큰 분리
1. **앱 메타데이터/브랜딩**: `src/config/app.config.ts`
   - `APP_TITLE`, `APP_DESCRIPTION`, `APP_LOCALE` ("ko")
   - `APP_LOGO_TEXT`, `APP_DISPLAY_NAME`, `APP_SUBTITLE`
2. **UI 정책 및 레이아웃 규격**: `src/config/ui.config.ts`
   - `LAYOUT_MAX_WIDTH` ("960px")
   - `TABLE_MIN_WIDTH` ("640px")
   - `FORM_DEFAULT_ADD_ROW_COUNT` (3), `PANEL_EMPTY_SUB_PREVIEW_COUNT` (4)
   - `SUBCATEGORY_COLOR_PALETTE` (중복 선언되었던 인라인 컬러 배열 통합)
3. **디자인 토큰 시스템 확장**: `src/styles/tokens/colors.ts`
   - 인라인 HEX 대신 시맨틱 토큰 추가: `success`, `danger`, `save`, `warning`
   - 컴포넌트에서는 `var(--color-*)` CSS 변수를 참조하도록 전환

## Step 3: Server-Driven Initial Config & Hydration 서비스 구축
1. **타입 정의 (`src/types/config.ts`)**:
   - `dateFilter` (`availableMonths`, `defaultMonth`, `currentYearMonth`)
   - `categoryMap`, `branding`, `limits`를 묶은 `AppInitialConfig` 인터페이스 정의
2. **서버 서비스 레이어 생성 (`src/services/ledgerServerService.ts`)**:
   - 서버 환경에서 DB의 카테고리 정보와 전체 날짜 목록을 병렬 조회하여 최신 `availableMonths`를 집계
   - 기본 선택 월(최신 데이터 월 또는 당월)에 해당하는 `initialEntries`를 서버에서 즉시 조회하여 초기 데이터 패키지 완성
3. **Server Component 진입점 작성 (`src/app/page.tsx`)**:
   - `page.tsx`를 비동기 서버 컴포넌트로 선언 (`async function Home()`)
   - `getInitialLedgerData()`를 호출하여 완성된 `initialConfig`와 `initialEntries`를 클라이언트 루트 컴포넌트에 주입
4. **클라이언트 컴포넌트/훅 수화 (Hydration)**:
   - 클라이언트는 주입받은 `initialConfig`와 `initialEntries`로 `isLoaded: true` 상태로 즉시 렌더링 시작
   - 상단 날짜 필터 변경 시에만 해당 월의 범위 데이터(`.gte().lte()`)를 온디맨드로 조회
   - Realtime 이벤트 수신 시에는 현재 선택된 월 기준으로만 재조회 실행

## Step 4: 320px 초소형 모바일 반응형 최적화
1. **표준 Viewport 명시 (`layout.tsx`)**:
   - `export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };`
2. **반응형 타이포그래피 Sprinkles 활성화 (`sprinkles.css.ts`)**:
   - `fontSize`, `fontWeight`를 `responsiveProperties`로 배치하여 모바일/태블릿 분기 대응
3. **헤더 레이아웃 (`LedgerHeader.tsx`)**:
   - `flexDirection={{ mobile: "column", tablet: "row" }}`
   - 320px 모바일에서 로고+타이틀 영역과 드롭다운이 위아래로 자연스럽게 배치되고 `keep-all` 처리
4. **요약 카드 2열 그리드 (`LedgerSummary.tsx`)**:
   - `minmax(135px, 1fr)` 및 모바일 패딩 `p: 3 (12px)` 적용하여 320px 화면에서도 4개 카드가 2열 2행으로 안정적 노출
5. **날짜 영역 최소 너비(`minWidth`) 보장**:
   - `LedgerPanel` 리스트: `minWidth: "76px"`, `whiteSpace: "nowrap"`, `tabular-nums`
   - `LedgerTable`: `minWidth: "105px"`, `whiteSpace: "nowrap"`
   - `LedgerEntryForm`: `minWidth: "140px"`, `whiteSpace: "nowrap"`
6. **테이블 가로 스크롤 보호**:
   - 다중 컬럼 테이블은 `minWidth: TABLE_MIN_WIDTH (640px)`와 부모 컨테이너의 `overflowX: "auto"`로 보호하여 전체 페이지가 좌우로 흔들리거나 깨지지 않도록 격리

## Step 5: 컴파일 및 정적 타입 검증
1. `node node_modules/typescript/bin/tsc --noEmit` 실행
2. 타입 에러 제로(0) 확인

---

# 판단 기준
- **서버 주도 vs 클라이언트 비동기**: 초기 렌더링에 필수적인 메타데이터(카테고리, 날짜 목록, 기본 데이터)는 무조건 서버(SSR)에서 조립하여 1회에 내려준다.
- **날짜 필터 조회 방식**: 전체 내역(1년치)을 클라이언트에 다 담아두고 메모리 필터링하지 않고, DB 레벨의 날짜 범위 쿼리(`.gte`, `.lte`)로 온디맨드 fetch한다.
- **테이블 vs 모바일 카드**: 컬럼 수가 5개 이상인 데이터 테이블은 320px 모바일에서 억지로 찌그러뜨리지 않고 `TABLE_MIN_WIDTH`와 `overflowX: auto`로 스크롤을 유도한다.
- **날짜 UI**: 날짜 표시는 항상 `minWidth`와 `whiteSpace: "nowrap"`, `tabular-nums`를 부여해 줄바꿈을 방지한다.

---

# 금지사항
- ❌ 컴포넌트 내부에 인라인 HEX 컬러코드(`#3898EC`, `#248A54` 등) 직접 하드코딩 금지 (디자인 토큰 또는 테마 변수 사용할 것)
- ❌ 클라이언트 진입 시 `useEffect` 안에서 3~4개의 개별 쿼리를 연쇄 호출하는 워터폴(Waterfall) 패턴 작성 금지
- ❌ 모바일(320px) 가용 폭을 고려하지 않고 고정 `px` 너비로 부모 컨테이너를 지정하는 행위 금지
- ❌ DB 데이터와 동기화되지 않는 임의의 `localStorage` 복사본 저장 금지

---

# 결과물 형식
- `src/config/` 하위 전역 설정 파일 (`app.config.ts`, `ui.config.ts`, `ledger.config.ts`)
- `src/types/config.ts` (초기 하이드레이션 규격)
- `src/services/ledgerServerService.ts` (서버 패칭 로직)
- `src/components/ledger/LedgerApp.tsx` (클라이언트 루트 컨테이너)
- `src/app/page.tsx` (Server Component)

---

# 검수 체크리스트
- [ ] TypeScript 컴파일 에러(`tsc --noEmit`)가 없는가?
- [ ] 브라우저 개발자 도구 디바이스 툴바에서 320px 폭으로 확인 시 가로 스크롤 및 텍스트 꺾임이 없는가?
- [ ] 날짜(`YYYY-MM-DD`)가 어떤 상황에서도 한 줄로 온전히 노출되는가?
- [ ] 상단 요약 카드가 320px 화면에서 2열 그리드로 정렬되는가?
- [ ] 컴포넌트 인라인 HEX 색상이 테마 CSS 변수로 전환되었는가?
- [ ] 서버 컴포넌트(`page.tsx`)에서 초기 주입 후 클라이언트에 불필요한 초기 로딩 스피너가 뜨지 않는가?

---

# 관련 Knowledge
- [kn-arch-design-system-sprinkles.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-arch-design-system-sprinkles.md) - vanilla-extract Sprinkles 디자인 시스템 아키텍처
- [kn-biz-budget-book-domain-model.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-biz-budget-book-domain-model.md) - 가계부 도메인 모델 및 대/소분류 체계
