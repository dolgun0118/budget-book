# Vanilla-Extract Sprinkles & Recipes 기반 디자인 시스템 아키텍처

> **지식 ID**: KN-ARCH-001  
> **카테고리**: 아키텍처 | 비즈니스  
> **최초 등록일**: 2026-09-11  
> **최종 갱신일**: 2026-09-11  
> **검증 상태**: Verified (검증됨)  
> **관련 키워드**: `#design-system`, `#sprinkles`, `#recipes`, `#pastel-sky-blue`, `#polymorphic-box`  

---

## 1. 지식 개요 (Overview)
본 문서는 가계부 서비스(Budget Book)의 UI 일관성과 개발 생산성을 위해 구축된 **Vanilla-Extract 기반 디자인 시스템 아키텍처**와 **파스텔 스카이블루(하늘색) 토큰 사양**을 정의합니다.

---

## 2. 5대 분류 체계별 지식 상세 (Categorized Content)

### 2.1 Fact (검증된 사실)
- **Zero-runtime 유틸리티**: `@vanilla-extract/sprinkles`는 빌드 타임에 CSS 변수와 원자적(Atomic) 클래스를 사전 생성하여 런타임 CSS-in-JS의 성능 오버헤드가 전혀 발생하지 않습니다.
- **파스텔 하늘색(Pastel Sky Blue) 컬러 사양**:
  - `primary` (Light): `#3898EC` (밝고 청량한 파스텔 블루)
  - `primaryHover`: `#2A84D6`, `primaryActive`: `#1E70BF`
  - `primarySubtle`: `#EBF4FD` (배지 및 하이라이트 배경용)
  - `primary` (Dark): `#60A5FA` (다크모드 명도 대비용 선명한 파스텔 블루)
  - `background` (Light / Dark): `#F8FAFC` / `#0B111A`
  - `surface` (Light / Dark): `#FFFFFF` / `#111827`
- **React 19 컴포넌트 규격**: React 19에서는 함수형 컴포넌트의 prop으로 `ref`가 직접 전달되므로 `forwardRef` 래핑 없이도 다형성 컴포넌트를 타입 안전하게 구현할 수 있습니다.

### 2.2 Observation (관찰된 현상)
- Sprinkles 기반의 `<Box>` 및 Recipes 기반의 `<Button>` 컴포넌트를 도입한 후, 매번 별도 `.css.ts` 파일을 만들지 않고도 대부분의 레이아웃과 배리언트 조합이 JSX 내에서 100% 타입 안전하게 완료됨을 확인했습니다.
- Next.js 16 Webpack 프로덕션 빌드에서 정적 페이지 추출 시간이 약 1.5초로 매우 빠르고 안정적으로 동작했습니다.

### 2.3 Hypothesis (가설)
- 디자인 토큰을 강제함으로써 임의의 매직 넘버(예: `padding: 13px`)나 부정확한 헥스 컬러 사용을 사전에 방지하여 장기적인 유지보수 비용을 50% 이상 절감할 수 있습니다.

### 2.4 Decision (의사결정)
- **Primary 브랜드 컬러**: 신뢰감 있고 부드러운 인상을 주는 **파스텔 하늘색(Pastel Sky Blue)**을 메인 테마 색상으로 확정했습니다.
- **컴포넌트 패턴 채택 (`b-free` 참조)**:
  - Atomic 유틸리티: `@vanilla-extract/sprinkles`
  - 멀티 배리언트: `@vanilla-extract/recipes`
  - 컴포넌트 다형성/합성: `@radix-ui/react-slot` (`asChild`)

### 2.5 Lesson (도출된 교훈)
- **중앙 집중식 토큰 관리의 가치**: 색상 팔레트를 단일 파일([src/styles/tokens/colors.ts](file:///C:/Users/zipo1/workspace/budget-book/src/styles/tokens/colors.ts))에 추상화해 두었기 때문에, 초록색에서 하늘색으로의 테마 변경이 컴포넌트 코드 수정 없이 즉각적이고 안전하게 완료되었습니다.

---

## 3. 구조 다이어그램
```text
src/
├── styles/
│   ├── tokens/ (colors, space, radii, typography)
│   ├── theme.css.ts (createThemeContract, light/dark 전역 바인딩)
│   └── sprinkles.css.ts (반응형 & 컬러 원자 프로퍼티)
└── components/
    └── ui/
        ├── Box (다형성 레이아웃 원시 컴포넌트)
        └── Button (Recipe 기반 다중 배리언트 컴포넌트)
```

---

## 4. 연관 문서 및 플레이북
- [PB-UI-001: Box 및 Recipe 기반 UI 컴포넌트 개발 플레이북](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-ui-component-development.md)

---

## 5. 변경 이력 (Changelog)
- **2026-09-11**: 최초 작성 (Sprinkles 도입 및 파스텔 하늘색 테마 확정)
