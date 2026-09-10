# 레거시 단일 HTML 앱 → Next.js App Router 마이그레이션 플레이북

> **문서 ID**: PB-LEGACY-001  
> **최초 작성일**: 2026-09-11  
> **최종 수정일**: 2026-09-11  
> **버전**: v1.0.0  
> **상태**: Active  

---

# 목적
단일 파일(`.html`)로 구성된 레거시 바닐라 JavaScript 가계부 앱을 **Next.js 16 App Router + Vanilla-Extract 디자인 시스템** 기반으로 안전하게 분해·재구축하여, 유지보수 가능하고 타입 안전한 모던 애플리케이션으로 전환하기 위함입니다.

---

# 언제 사용하는가
- 기존 HTML 단일 파일 또는 레거시 프론트엔드 코드를 Next.js App Router 구조로 전환할 때
- 상태 관리, 스타일링, 데이터 모델이 뒤섞인 HTML을 역할 분리된 컴포넌트 구조로 분해할 때

---

# 필요한 입력
- 전환할 레거시 HTML 파일 전체 내용 (구조, 스타일, 데이터, 비즈니스 로직 포함)
- 전환 후 목표 Next.js 프로젝트가 세팅된 상태 (vanilla-extract, sprinkles, recipes 설치 완료)

---

# 작업 절차

## Step 1: 레거시 HTML 분석 및 구성 요소 파악
1. HTML 파일을 전체 읽어 다음 항목을 식별합니다:
   - **데이터 모델**: 어떤 데이터 구조를 다루는가? (ex: `Entry`, `Category`)
   - **비즈니스 로직**: 집계, 필터링, 계산 공식
   - **UI 섹션**: 헤더, 요약 카드, 패널, 폼, 테이블 등 독립 가능한 UI 단위
   - **상태**: 전역 변수(`let entries`, `let currentMonth`)와 DOM 이벤트 연결 구조
   - **영속성**: `localStorage`, 외부 API 등 데이터 저장 방식

## Step 2: 도메인 타입 및 상수 정의 (`src/types/`)
1. HTML의 데이터 구조(`CATEGORY_MAP`, 배열 모델 등)를 TypeScript `interface`와 `const`로 변환합니다.
2. 파일 위치: `src/types/[도메인명].ts`
3. 참고: [src/types/ledger.ts](file:///C:/Users/zipo1/workspace/budget-book/src/types/ledger.ts)

## Step 3: 상태 관리 훅 구현 (`src/hooks/`)
1. 레거시 HTML의 전역 변수와 이벤트 핸들러를 **Custom Hook**으로 통합합니다.
2. `localStorage` 동기화가 필요한 경우 **`useSyncExternalStore` 패턴**을 사용합니다. ([KN-TECH-003](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-localstorage-sync-pattern.md) 참조)
3. `useEffect + setState` 동기 호출 방식은 사용하지 않습니다.
4. 훅에서 노출: `data`, `filteredData`, `totals/aggregates`, `add`, `delete`, `setFilter` 등

## Step 4: UI 프리미티브 확장 (`src/components/ui/`)
1. 레거시 HTML의 폼 요소(`<select>`, `<input>`, `<button>`)가 디자인 시스템에 없으면 [PB-UI-001](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-ui-component-development.md) 절차에 따라 Recipe 기반 컴포넌트를 추가 구현합니다.
2. 배지/태그 같은 순수 표시용 컴포넌트도 이 단계에서 추가합니다.

## Step 5: 도메인(Feature) 컴포넌트 구현 (`src/components/[feature]/`)
1. Step 1에서 식별한 UI 섹션을 독립 컴포넌트로 분해합니다.
2. 각 컴포넌트는 **`"use client"` 지시어**가 필요한지 판단합니다:
   - 이벤트 핸들러, `useState`, `useRef` 사용 시 → `"use client"` 필수
3. 컴포넌트 Props는 훅에서 받은 데이터/핸들러만 주입합니다 (직접 스토리지 접근 금지).
4. `src/components/[feature]/index.ts` 배럴 파일로 re-export합니다.

## Step 6: 페이지 조립 (`src/app/page.tsx`)
1. 훅과 컴포넌트들을 page.tsx에서 조립합니다.
2. 로딩 상태(초기 데이터 미로드 시)에 대한 빈 상태 UI를 반드시 포함합니다.
3. 기존 HTML의 레이아웃 구조(max-width, 패딩, 섹션 순서)를 `<Box>` Sprinkles로 재현합니다.

## Step 7: 검증
1. `pnpm lint` → 린트 통과 확인
2. `pnpm build` → TypeScript 타입 검사 및 정적 빌드 통과 확인

---

# 판단 기준
- **"use client" 분리 기준**: 클릭 이벤트, 입력 폼, useState 등 인터랙션이 있으면 클라이언트 컴포넌트. 순수 표시만이라면 서버 컴포넌트로 유지.
- **컴포넌트 분리 기준**: 독립적으로 접힘/펼침(아코디언), 독립 폼 제출, 독립 필터 조작이 가능한 단위는 별도 컴포넌트.

---

# 예외 상황
- **레거시 HTML이 외부 API(`window.storage` 등) 의존 시**:
  - 대처: 인터페이스를 추상화하고 초기에는 `localStorage`로 교체. 이후 서버 API 연동으로 단계적 확장.
- **CSS 변수(`:root` 커스텀 프로퍼티) 다수 사용 시**:
  - 대처: `vanilla-extract createGlobalTheme`으로 토큰화, 기존 변수명을 신규 토큰으로 매핑.

---

# 금지사항
- **금지 1**: 레거시 HTML의 인라인 `style` 속성을 그대로 복사하는 행위 금지 — 반드시 Sprinkles props 또는 `vars` 토큰으로 교체
- **금지 2**: `useEffect` 내부에서 `setState`를 동기 호출하는 방식으로 localStorage 읽기 금지
- **금지 3**: 도메인 컴포넌트 내부에서 `localStorage`에 직접 접근하는 행위 금지 — 반드시 훅을 통해 추상화

---

# 결과물 형식
```text
src/
├── types/[도메인].ts           # 도메인 타입 및 상수
├── hooks/use[Domain].ts        # 상태 관리 및 영속성 훅
├── components/
│   ├── ui/                     # 신규 UI 프리미티브 (필요 시)
│   └── [feature]/              # 도메인 컴포넌트 모음
│       ├── [Feature]Header.tsx
│       ├── [Feature]Summary.tsx
│       ├── [Feature]Panel.tsx
│       ├── [Feature]Form.tsx
│       ├── [Feature]Table.tsx
│       └── index.ts
└── app/page.tsx                # 최종 조립 페이지
```

---

# 검수 체크리스트
- [ ] 레거시 HTML의 모든 비즈니스 로직이 TypeScript 타입과 훅으로 이전되었는가?
- [ ] `useEffect + setState` 동기 패턴이 사용되지 않았는가?
- [ ] 모든 스타일이 Vanilla-Extract 토큰(`vars`) 기반으로 작성되었는가?
- [ ] `pnpm lint` 및 `pnpm build`가 에러 없이 통과하는가?
- [ ] 로딩 상태 및 데이터 없음 상태가 UI로 처리되었는가?

---

# 관련 Knowledge
- [KN-BIZ-001: 부부 공동 가계부 도메인 모델 및 분류 체계](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-biz-budget-book-domain-model.md)
- [KN-TECH-003: useSyncExternalStore 기반 LocalStorage 동기화 패턴](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-localstorage-sync-pattern.md)
- [KN-ARCH-001: Vanilla-Extract Sprinkles & Recipes 기반 디자인 시스템 아키텍처](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-arch-design-system-sprinkles.md)
- [PB-UI-001: Box 및 Recipe 기반 UI 컴포넌트 개발 절차 가이드](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-ui-component-development.md)
