# Next.js 16 환경의 Vanilla-Extract 도입 및 빌드 파이프라인 설정

> **지식 ID**: KN-TECH-001  
> **카테고리**: 기술스펙 | 아키텍처  
> **최초 등록일**: 2026-09-11  
> **최종 갱신일**: 2026-09-11  
> **검증 상태**: Verified (검증됨)  
> **관련 키워드**: `#vanilla-extract`, `#nextjs16`, `#webpack`, `#turbopack`, `#zero-runtime-css`  

---

## 1. 지식 개요 (Overview)
본 문서는 Next.js 16 프로젝트에서 제로 런타임(Zero-runtime) 타입 세이프 스타일링 도구인 **vanilla-extract**를 성공적으로 도입하기 위해 필요한 설정과 빌드 번들러 제약 및 해결 방안을 기술합니다.

---

## 2. 5대 분류 체계별 지식 상세 (Categorized Content)

### 2.1 Fact (검증된 사실)
- **번들러 기본값**: Next.js 16.3.4부터는 개발 서버(`next dev`) 및 프로덕션 빌드(`next build`) 시 Turbopack이 기본 번들러로 활성화됩니다.
- **플러그인 구조**: `@vanilla-extract/next-plugin`은 Webpack 로더 체인을 기반으로 빌드 타임에 `.css.ts` 파일을 파싱하여 정적 CSS 파일로 추출합니다.
- **Turbopack 제약**: Next.js 16에서 Turbopack으로 실행 시 페이지 데이터 수집 단계(`Collecting page data`)에서 `.css.ts` 파일의 스타일 스코프가 할당되지 않아 빌드가 중단됩니다.
- **Webpack 우회 실행**: `next dev --webpack` 및 `next build --webpack` 플래그를 사용하면 Webpack 파이프라인을 강제하여 정상적으로 번들링 및 정적 CSS 추출이 완료됩니다.
- **pnpm v12 빌드 스크립트 정책**: vanilla-extract의 의존성인 `@swc/core` 및 `esbuild`는 pnpm v12의 보안 정책상 `pnpm-workspace.yaml`의 `allowBuilds`에 명시적으로 허용되어야 실행 스크립트가 차단되지 않습니다.

### 2.2 Observation (관찰된 현상)
- Turbopack 활성화 상태에서 `next build` 실행 시 다음과 같은 에러 로그가 발생했습니다:
  ```text
  Error: Styles were unable to be assigned to a file. This is generally caused by one of the following:
  - You may have created styles outside of a '.css.ts' context
  - You may have incorrect configuration.
  ```
- `--webpack` 플래그를 추가한 후 실행한 결과, `Compiled successfully in 6.6s`로 통과하며 모든 정적 라우트(`○ /`, `○ /_not-found`)가 정상 생성되었습니다.

### 2.3 Hypothesis (가설)
- 향후 `@vanilla-extract/next-plugin` 또는 Next.js 공식 Turbopack transform 지원이 안정화되면, `--webpack` 플래그 없이 순수 Turbopack 환경에서도 빌드가 가능해질 것으로 예상됩니다.

### 2.4 Decision (의사결정)
- **스타일링 도구 선정**: 런타임 오버헤드가 없고 완벽한 TypeScript 정적 타입 검사를 보장하는 `@vanilla-extract/css`를 프로젝트의 주 스타일링 라이브러리로 채택했습니다.
- **빌드 스크립트 표준화**: Next.js 16 환경에서 번들링 오류를 방지하기 위해 [package.json](file:///C:/Users/zipo1/workspace/budget-book/package.json)의 `dev` 및 `build` 스크립트에 `--webpack` 플래그를 기본 지정하기로 결정했습니다.

### 2.5 Lesson (도출된 교훈)
- **파일명 규칙 준수**: vanilla-extract 스타일 정의 함수(`style()`, `styleVariants()`, `createTheme()`)는 반드시 `.css.ts` 확장자를 가진 독립 파일에서만 작성되어야 합니다. `.tsx` 파일 내부에 직접 스타일을 선언하면 추출 실패가 발생합니다.
- **프레임워크 버전 검증**: 프레임워크의 메이저 버전 업데이트 시(Next.js 16의 Turbopack 기본화 등), 기존 Webpack 전용 플러그인이 영향을 받으므로 빌드 파이프라인 호환성을 선제적으로 확인해야 합니다.

---

## 3. 반복되는 문제와 해결 방법 (Troubleshooting)
- **증상/문제점**: `Styles were unable to be assigned to a file` 에러 발생
- **근본 원인**: Next.js 16의 기본 번들러인 Turbopack 환경에서 vanilla-extract 스타일 평가 파이프라인 미호환
- **해결 절차**:
  1. [package.json](file:///C:/Users/zipo1/workspace/budget-book/package.json)의 스크립트를 `next dev --webpack`, `next build --webpack`으로 수정
  2. [next.config.ts](file:///C:/Users/zipo1/workspace/budget-book/next.config.ts)에 `createVanillaExtractPlugin()` 래핑 적용
- **재발 방지 대책**: 신규 개발 환경 셋업 시 Webpack 플래그 누락 여부를 체크리스트에 포함

---

## 4. 연관 문서 및 플레이북
- [PB-STYLING-001: vanilla-extract 스타일 작성 및 관리 플레이북](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-styling-vanilla-extract.md)

---

## 5. 변경 이력 (Changelog)
- **2026-09-11**: 최초 작성 (vanilla-extract 패키지 설치 및 Next.js 16 호환성 검증 결과 기록)
