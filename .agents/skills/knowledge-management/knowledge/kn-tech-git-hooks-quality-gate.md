# Husky 및 lint-staged를 활용한 Git 커밋 사전 품질 게이트 구축

> **지식 ID**: KN-TECH-002  
> **카테고리**: 기술스펙 | 프로젝트원칙  
> **최초 등록일**: 2026-09-11  
> **최종 갱신일**: 2026-09-11  
> **검증 상태**: Verified (검증됨)  
> **관련 키워드**: `#husky`, `#lint-staged`, `#eslint9`, `#git-hooks`, `#code-quality`  

---

## 1. 지식 개요 (Overview)
코드 커밋 시점에 자동으로 변경된 파일만을 검사하여 코드 컨벤션 위반과 문법 오류를 사전에 차단하는 **Git Pre-commit Hook 및 lint-staged 품질 게이트** 운영 지침입니다.

---

## 2. 5대 분류 체계별 지식 상세 (Categorized Content)

### 2.1 Fact (검증된 사실)
- **Husky v9 아키텍처**: 최신 Husky는 별도의 복잡한 설정 없이 `.husky/pre-commit` 단일 쉘 파일로 Git 훅을 관리합니다.
- **자동 초기화 생명주기**: `package.json`의 `"prepare": "husky"` 스크립트는 개발자가 `pnpm install`을 실행할 때마다 로컬 `.git/hooks/`에 자동으로 심볼릭 링크/스크립트를 구성합니다.
- **ESLint 9 Flat Config 호환성**: 본 프로젝트의 `eslint.config.mjs` 기반 Flat Config는 `lint-staged`가 파일 경로 목록을 인자로 전달할 때 추가 플래그 없이도 정상적으로 개별 파일을 타겟팅하여 `--fix`를 수행합니다.
- **성능 최적화**: 프로젝트 전체 파일을 스캔하지 않고 `git add`된 스테이징 파일만 처리하므로 커밋 지연 시간이 1~2초 이내로 유지됩니다.

### 2.2 Observation (관찰된 현상)
- [src/app/page.tsx](file:///C:/Users/zipo1/workspace/budget-book/src/app/page.tsx) 스테이징 후 `pnpm exec lint-staged`를 수동 검증한 결과, 원본 백업 → 린트 및 자동 수정(`eslint --fix`) → 스테이징 반영 단계가 원활하게 완료되었습니다.

### 2.3 Hypothesis (가설)
- 로컬 커밋 시점의 강제 검증을 통해 CI/CD 파이프라인 단계에서의 린트/포맷팅 실패율을 거의 0%로 줄일 수 있습니다.

### 2.4 Decision (의사결정)
- 모든 Git 커밋 전 자동 검증을 위해 `husky` + `lint-staged`를 필수로 도입했습니다.
- 린트 설정은 [.lintstagedrc.json](file:///C:/Users/zipo1/workspace/budget-book/.lintstagedrc.json) 파일로 분리하여 규칙 확장 시 `package.json` 오염을 방지하기로 결정했습니다.

### 2.5 Lesson (도출된 교훈)
- **초기 클론 편의성**: `prepare` 스크립트를 누락할 경우 신규 개발자나 CI 환경에서 훅이 활성화되지 않으므로, 패키지 매니저 설정 시 `prepare: "husky"` 등록 여부를 상시 점검해야 합니다.

---

## 3. 반복되는 문제와 해결 방법 (Troubleshooting)
- **증상/문제점**: 커밋 시 린트 에러로 인해 `git commit`이 거절됨
- **근본 원인**: 코드가 프로젝트의 ESLint 규칙을 위반했으며 자동 수정(`--fix`)이 불가능한 경우
- **해결 절차**:
  1. 터미널 출력에 표시된 린트 에러 파일 및 라인 확인
  2. 수동으로 코드 규칙 위반 수정
  3. `git add [수정한 파일]` 재수행 후 다시 커밋

---

## 4. 연관 문서 및 플레이북
- [PB-DEV-001: 코드 품질 검증 및 커밋 가이드 플레이북](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-code-quality-and-commit.md)

---

## 5. 변경 이력 (Changelog)
- **2026-09-11**: 최초 작성 (Husky 9 + lint-staged 17 설정 및 동작 검증 결과 등록)
