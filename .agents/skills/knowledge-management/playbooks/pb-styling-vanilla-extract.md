# vanilla-extract 컴포넌트 스타일링 및 디자인 토큰 적용 가이드

> **문서 ID**: PB-STYLING-001  
> **최초 작성일**: 2026-09-11  
> **최종 수정일**: 2026-09-11  
> **버전**: v1.0.0  
> **상태**: Active  

---

# 목적
본 프로젝트에서 UI 컴포넌트 개발 시 제로 런타임 CSS 라이브러리인 **vanilla-extract**를 사용하여 타입 안정성을 갖춘 고성능 스타일을 일관되게 작성하고 유지보수하기 위함입니다.

---

# 언제 사용하는가
- 신규 페이지 또는 UI 컴포넌트를 생성하고 스타일을 지정할 때
- 기존 인라인 스타일이나 CSS 파일을 vanilla-extract로 마이그레이션할 때
- 테마 색상, 폰트, 반응형 미디어 쿼리 스타일을 작성할 때

---

# 필요한 입력
- 구현할 컴포넌트의 디자인 명세 (레이아웃, 색상, 타이포그래피, 반응형 규칙 등)
- 컴포넌트 소스 파일 경로 (예: `src/components/common/Button.tsx`)

---

# 작업 절차

## Step 1: 스타일 파일 생성 및 분리
1. 스타일을 적용할 컴포넌트와 동일한 디렉터리에 `.css.ts` 확장자를 가진 스타일 전용 파일을 생성합니다.
   - 예: `Button.tsx` -> `Button.css.ts`
   - 예: `page.tsx` -> `page.css.ts`
2. 필요한 vanilla-extract 함수(`style`, `styleVariants`, `createVar` 등)를 `@vanilla-extract/css`에서 임포트합니다.

## Step 2: 스타일 선언 및 클래스 정의
1. `style()` 함수를 사용하여 CSS 객체를 정의하고 명시적인 이름으로 `export`합니다.
   ```typescript
   import { style } from "@vanilla-extract/css";

   export const container = style({
     display: "flex",
     flexDirection: "column",
     padding: "16px",
     "@media": {
       "(max-width: 768px)": {
         padding: "8px",
       },
     },
   });
   ```
2. 상태나 변형(Variant)이 필요한 경우 `styleVariants()`를 활용하여 여러 스타일 세트를 분기합니다.
   ```typescript
   export const buttonVariant = styleVariants({
     primary: { background: "#000", color: "#fff" },
     secondary: { background: "#f5f5f5", color: "#333" },
   });
   ```

## Step 3: 컴포넌트 연결 및 클래스 바인딩
1. 컴포넌트 파일(`.tsx`)에서 생성한 스타일 객체를 `import * as styles from "./[Name].css";` 형태로 가져옵니다.
2. JSX 요소의 `className` 속성에 해당 스타일을 바인딩합니다.
   ```tsx
   import * as styles from "./Button.css";

   export function Button({ variant = "primary", children }) {
     return <button className={`${styles.base} ${styles.buttonVariant[variant]}`}>{children}</button>;
   }
   ```

## Step 4: 검증 및 빌드 확인
1. 터미널에서 `pnpm build` 또는 `pnpm dev`를 실행하여 Webpack 빌드 에러 없이 정상적으로 CSS가 생성되는지 확인합니다.
2. `pnpm lint`를 실행하여 린트 오류가 없는지 검증합니다.

---

# 판단 기준
- **공통/재사용 여부**: 여러 컴포넌트에서 반복되는 유틸리티성 스타일은 `src/styles/` 하위의 공통 파일로 분리하고, 특정 컴포넌트에 종속적인 스타일은 해당 컴포넌트와 동일 폴더의 `.css.ts`에 둡니다.
- **조합 vs 단일 정의**: 기본 스타일 위에 추가 변형이 필요한 경우, `style([baseStyle, { ...extra }])` 배열 구문을 사용하여 스타일을 합성합니다.

---

# 예외 상황
- **빌드 중 `Styles were unable to be assigned to a file` 발생**:
  - 원인: `.css.ts` 외부(예: `.tsx` 파일)에서 `style()`을 호출했거나, 번들러가 Webpack 모드로 실행되지 않음.
  - 대처: 스타일 함수 호출 위치를 `.css.ts`로 이동하고, `pnpm dev` 또는 `pnpm build` 스크립트에 `--webpack` 플래그가 포함되어 있는지 확인합니다.
- **다크 모드 및 미디어 쿼리 충돌**:
  - 대처: `@media` 블록 내에 `(prefers-color-scheme: dark)`를 명시적으로 그룹화하여 관리합니다.

---

# 금지사항
- **금지 1**: `.tsx` 또는 일반 `.ts` 파일 내에서 `style()`, `styleVariants()`를 직접 호출하는 행위 금지 (빌드 파이프라인 실패 원인)
- **금지 2**: 인라인 `style={{ ... }}` 속성을 사용하여 성능 및 디자인 일관성을 저해하는 행위 금지
- **금지 3**: `package.json`의 빌드 스크립트에서 임의로 `--webpack` 플래그를 제거하는 행위 금지

---

# 결과물 형식
- 파일 경로: `src/**/[컴포넌트명].css.ts`
- 파일 내부: `@vanilla-extract/css` 기반의 모듈화된 export 변수들
- 컴포넌트: 네임스페이스 임포트(`import * as styles from "./[컴포넌트명].css"`)를 통한 클래스 적용

---

# 검수 체크리스트
- [ ] 스타일 정의 파일의 확장자가 반드시 `.css.ts`인가?
- [ ] `.tsx` 파일 내부에 직접 작성된 `style()` 호출이 없는가?
- [ ] 반응형 미디어 쿼리와 다크 모드 스타일이 정상 동작하는가?
- [ ] `pnpm build` 실행 시 번들링 및 정적 CSS 추출 에러가 발생하지 않는가?
- [ ] `pnpm lint` 검사를 통과하는가?

---

# 관련 Knowledge
- [KN-TECH-001: Next.js 16 환경의 Vanilla-Extract 도입 및 빌드 파이프라인 설정](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-vanilla-extract-setup.md)
