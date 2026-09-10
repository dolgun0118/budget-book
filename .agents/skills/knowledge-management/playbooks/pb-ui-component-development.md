# Box 및 Recipe 기반 UI 컴포넌트 개발 절차 가이드

> **문서 ID**: PB-UI-001  
> **최초 작성일**: 2026-09-11  
> **최종 수정일**: 2026-09-11  
> **버전**: v1.0.0  
> **상태**: Active  

---

# 목적
프로젝트 내에서 일관된 디자인 시스템(디자인 토큰, Sprinkles, Recipes)을 활용하여 고성능의 재사용 가능한 UI 컴포넌트를 구축하기 위함입니다.

---

# 언제 사용하는가
- 신규 UI 컴포넌트(예: Input, Badge, Card, Modal, Avatar 등)를 개발할 때
- 기존 인라인 스타일 컴포넌트를 디자인 시스템 표준 컴포넌트로 리팩토링할 때

---

# 필요한 입력
- 컴포넌트 디자인 명세 및 필요 배리언트(Variant), 크기(Size) 정의
- 컴포넌트가 담당할 인터랙션 및 접근성 요구사항

---

# 작업 절차

## Step 1: 레이아웃 vs 배리언트 분기 판단
1. **단순 레이아웃 조립**: 추가 상태가 없는 컨테이너는 별도 컴포넌트 대신 `<Box>`에 Sprinkles props(`display`, `p`, `gap`, `bg`, `rounded` 등)를 전달하여 구성합니다.
2. **배리언트가 필요한 UI 요소**: `Button`, `Badge`, `Input` 등 다양한 시각적 상태(`variant`, `size`)를 가지는 경우 `src/components/ui/[컴포넌트명]/` 폴더를 생성하고 `Step 2`로 진행합니다.

## Step 2: Recipe 스타일 정의 (`[컴포넌트명].css.ts`)
1. `@vanilla-extract/recipes`의 `recipe()`를 사용하여 기본 스타일(`base`)과 배리언트(`variants`), 기본값(`defaultVariants`)을 정의합니다.
2. 모든 색상, 간격, 테두리 반경은 하드코딩하지 않고 `@/styles/theme.css`의 `vars` 토큰을 참조합니다.
   ```typescript
   import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
   import { vars } from "@/styles/theme.css";

   export const badgeRecipe = recipe({
     base: {
       display: "inline-flex",
       alignItems: "center",
       borderRadius: vars.radii.full,
       fontWeight: vars.fontWeight.medium,
     },
     variants: {
       variant: {
         primary: { backgroundColor: vars.color.primarySubtle, color: vars.color.primary },
         neutral: { backgroundColor: vars.color.secondary, color: vars.color.text },
       },
       size: {
         sm: { padding: `2px ${vars.space["2"]}`, fontSize: vars.fontSize.xs },
         md: { padding: `4px ${vars.space["3"]}`, fontSize: vars.fontSize.sm },
       },
     },
     defaultVariants: { variant: "primary", size: "md" },
   });

   export type BadgeVariants = RecipeVariants<typeof badgeRecipe>;
   ```

## Step 3: 컴포넌트 구현 (`[컴포넌트명].tsx`)
1. 필요 시 `@radix-ui/react-slot`의 `Slot`을 활용하여 다형성(`asChild`)을 지원합니다.
2. `clsx`를 사용해 recipe 클래스와 사용자 지정 `className`을 병합합니다.
3. `index.ts`를 생성하여 컴포넌트와 타입을 export하고, `src/components/ui/index.ts` 배럴 파일에 등록합니다.

## Step 4: 빌드 및 린트 검증
1. `pnpm lint` 및 `pnpm build`를 실행하여 컴파일과 정적 스타일 추출이 정상 완료되는지 확인합니다.

---

# 판단 기준
- **임의 CSS 작성 금지**: 헥스 컬러코드(`#123456`)나 픽셀 단위(`margin: 17px`)를 직접 작성하지 않고 반드시 `vars.color`, `vars.space`에 정의된 토큰을 사용합니다.
- **다형성 지원 여부**: 링크(`<a>`)나 라우터 링크(`Next Link`)로 교체될 가능성이 있는 클릭 가능한 요소(버튼, 배지 등)는 `asChild` prop을 제공합니다.

---

# 예외 상황
- **기존 토큰에 없는 새로운 색상/간격이 필요한 경우**:
  - 대처: 컴포넌트 내부에서 하드코딩하지 않고, [src/styles/tokens/](file:///C:/Users/zipo1/workspace/budget-book/src/styles/tokens)에 새 토큰을 추가하고 팀/사용자에게 토큰 확장을 제안합니다.

---

# 금지사항
- **금지 1**: 인라인 `style={{ ... }}` 속성을 통한 스타일링 금지
- **금지 2**: `@vanilla-extract/css`의 `style()`을 `.tsx` 파일 내부에 직접 선언하는 행위 금지
- **금지 3**: `design-token`을 우회하여 임의의 RGB/HEX 색상값을 컴포넌트에 직접 주입하는 행위 금지

---

# 결과물 형식
- 디렉터리: `src/components/ui/[컴포넌트명]/`
  - `[컴포넌트명].tsx`: 컴포넌트 본문
  - `[컴포넌트명].css.ts`: Recipe 스타일 명세
  - `index.ts`: export 정의
- 등록: `src/components/ui/index.ts`에 re-export

---

# 검수 체크리스트
- [ ] 디자인 토큰(`vars`)을 온전히 활용하고 하드코딩된 스타일 값이 없는가?
- [ ] 반응형 조건이나 다크모드 환경에서 올바른 색상 대비를 유지하는가?
- [ ] `pnpm lint` 및 `pnpm build`가 에러 없이 통과하는가?
- [ ] 컴포넌트가 `src/components/ui/index.ts`에 정상 등록되어 외부에서 깔끔히 임포트 가능한가?

---

# 관련 Knowledge
- [KN-ARCH-001: Vanilla-Extract Sprinkles & Recipes 기반 디자인 시스템 아키텍처](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-arch-design-system-sprinkles.md)
