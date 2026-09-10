# Knowledge 디렉터리 안내

본 디렉터리는 프로젝트 전반에서 검증된 **"무엇을 알고 있는가(What we know)"**를 체계적으로 축적하는 지식 저장소입니다.

단순 메모나 미확인 정보가 아닌, 실제 프로젝트 진행을 통해 획득한 경험, 원칙, 의사결정 내역, 검증된 사실 및 문제 해결 패턴을 보관합니다.

---

## 1. 지식 5대 분류 체계 (필수 구분 규칙)

Knowledge 문서 내에서는 정보의 신뢰도를 엄격히 보장하기 위해 다음 5가지 유형을 명확히 구분하여 기술합니다:

1. **Fact (검증된 사실)**
   - 객관적으로 입증된 데이터, 공식 라이브러리 스펙, 테스트 결과, 런타임 수치 등
   - *절대 규칙: AI Agent가 추측한 내용을 사실로 기록하지 않습니다.*
2. **Observation (관찰된 현상)**
   - 프로젝트 수행 중 직접 측정되거나 관찰된 실제 동작 및 사용자 반응
3. **Hypothesis (가설)**
   - 아직 완전히 입증되지 않았으나 검증이 진행 중이거나 필요한 추론과 예상
4. **Decision (의사결정)**
   - 특정 시점에 확정된 아키텍처/비즈니스 결정과 그에 대한 근거, 기각된 대안
5. **Lesson (도출된 교훈)**
   - 성공 또는 실패 경험, 회고를 통해 획득한 핵심 시사점 및 미래 지침

---

## 2. 지식 등록 및 갱신 원칙

사용자가 지식 추가/수정을 요청하거나 Agent가 새로운 지식을 제안할 때는 다음 절차를 반드시 준수합니다:

1. **기존 문서 검색**: 키워드 기반으로 유사 문서가 이미 있는지 확인합니다.
2. **중복 확인 (Deduplication)**: 동일한 지식이 여러 파일에 흩어지지 않도록 단일 문서에서 통합 관리합니다.
3. **충돌 검증 (Conflict Check)**: 기존 지식과 상충되는 경우, 기존 내용을 덮어쓰지 않고 변경 이유를 명시하고 사용자에게 알립니다.
4. **점진적 공개 (Progressive Disclosure)**: 문서는 주제별로 모듈화하여 필요한 지식만 최소한으로 로드되도록 설계합니다.

---

## 3. 파일 네이밍 및 템플릿

- **파일명 규칙**: `kn-<카테고리>-<주제>.md` (소문자 및 하이픈 권장)  
  *카테고리 예시*: `arch`(아키텍처), `tech`(기술스펙), `biz`(비즈니스/도메인), `troubleshooting`(문제해결)  
  *파일명 예시*: `kn-arch-state-management.md`, `kn-tech-nextjs-routing.md`, `kn-troubleshooting-auth-token.md`
- **템플릿**: [templates/knowledge-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/knowledge-template.md) 활용

---

## 4. 지식 문서 목록 (인덱스)

> *현재는 시스템 초기 뼈대 구축 상태로, 실제 프로젝트 수행 중 검증된 사실과 결정 사항이 점진적으로 축적될 예정입니다.*

| 지식 ID | 분류 | 제목 | 링크 | 검증 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **KN-TECH-001** | 기술스펙 / 아키텍처 | Next.js 16 환경의 Vanilla-Extract 도입 및 빌드 파이프라인 설정 | [kn-tech-vanilla-extract-setup.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-vanilla-extract-setup.md) | Verified |
| **KN-TECH-002** | 기술스펙 / 프로젝트원칙 | Husky 및 lint-staged를 활용한 Git 커밋 사전 품질 게이트 구축 | [kn-tech-git-hooks-quality-gate.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-git-hooks-quality-gate.md) | Verified |
| **KN-TECH-003** | 기술스펙 | useSyncExternalStore 기반 LocalStorage 동기화 패턴 | [kn-tech-localstorage-sync-pattern.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-tech-localstorage-sync-pattern.md) | Verified |
| **KN-ARCH-001** | 아키텍처 / 디자인시스템 | Vanilla-Extract Sprinkles & Recipes 기반 디자인 시스템 아키텍처 | [kn-arch-design-system-sprinkles.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-arch-design-system-sprinkles.md) | Verified |
| **KN-BIZ-001** | 비즈니스 / 도메인 | 부부 공동 가계부 도메인 모델 및 분류 체계 | [kn-biz-budget-book-domain-model.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge/kn-biz-budget-book-domain-model.md) | Verified |



