# Playbooks 디렉터리 안내

본 디렉터리는 **"어떻게 일을 수행하는가(How-to)"**를 정의한 구체적인 업무 실행 절차서(Playbook)를 보관하는 저장소입니다.

단순한 원칙이나 개념 설명은 플레이북이 아닙니다. AI Agent가 실제 독립적으로 작업을 완수할 수 있을 정도로 구체적인 단계별 행동 지침, 판단 기준, 금지사항, 체크리스트를 포함해야 합니다.

---

## 1. 플레이북의 역할과 기준

- **구체성 (Actionable)**: AI Agent가 읽고 즉각적인 커맨드 실행, 코드 작성, 검증을 수행할 수 있어야 합니다.
- **표준화 (Standardized)**: 모든 플레이북은 통일된 구조를 갖추어 예측 가능성을 보장합니다.
- **방어적 설계 (Defensive)**: 예외 상황과 금지사항을 명시하여 환각이나 잘못된 구현을 사전에 차단합니다.
- **품질 보증 (Quality Gate)**: 셀프 검수가 가능한 검수 체크리스트를 필수 포함합니다.

---

## 2. 플레이북 필수 구조

모든 플레이북은 [templates/playbook-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/playbook-template.md)를 기반으로 작성되어야 하며, 다음 필수 섹션을 누락 없이 포함해야 합니다:

1. **# 목적**: 이 절차가 왜 필요하며 어떤 가치를 만드는가
2. **# 언제 사용하는가**: 적용 조건 및 트리거 시점
3. **# 필요한 입력**: 사전 준비 데이터 및 의존성
4. **# 작업 절차**: 구체적인 실행 단계 (Step 1, Step 2, Step 3 ...)
5. **# 판단 기준**: 의사결정이 필요할 때의 명확한 분기 기준
6. **# 예외 상황**: 돌발 이슈별 대응 방법
7. **# 금지사항**: 절대 하지 말아야 할 행동
8. **# 결과물 형식**: 산출물의 디렉터리, 포맷, 규격
9. **# 검수 체크리스트**: 완료 후 자가 검증 항목
10. **# 관련 Knowledge**: 배경이 되는 지식 문서 연결

---

## 3. 파일 네이밍 및 관리 규칙

- **파일명 규칙**: `pb-<분야>-<수행작업>.md` (소문자 및 하이픈 권장)  
  *예시*: `pb-ui-component-creation.md`, `pb-api-endpoint-setup.md`, `pb-db-migration.md`
- **신규 생성 방법**:
  1. `../templates/playbook-template.md` 복사
  2. 고유 식별자(`PB-xxx`) 및 메타데이터 기입
  3. 모든 필수 섹션 구체화
  4. 본 `README.md`의 인덱스 목록에 링크 추가

---

## 4. 플레이북 목록 (인덱스)

> *현재는 시스템 초기 뼈대 구축 상태로, 실제 업무 진행에 따라 검증된 플레이북이 점진적으로 추가될 예정입니다.*

| 문서 ID | 플레이북 명 | 적용 시점 | 링크 | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **PB-STYLING-001** | vanilla-extract 컴포넌트 스타일링 및 디자인 토큰 적용 가이드 | 컴포넌트 및 페이지 스타일 작성 시 | [pb-styling-vanilla-extract.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-styling-vanilla-extract.md) | Active |
| **PB-DEV-001** | 코드 품질 검증 및 커밋 표준 절차 가이드 | Git 커밋 및 변경 사항 정리 시 | [pb-code-quality-and-commit.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-code-quality-and-commit.md) | Active |
| **PB-UI-001** | Box 및 Recipe 기반 UI 컴포넌트 개발 절차 가이드 | 신규 UI 컴포넌트 개발 시 | [pb-ui-component-development.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-ui-component-development.md) | Active |
| **PB-LEGACY-001** | 레거시 단일 HTML 앱 → Next.js App Router 마이그레이션 절차 | 단일 HTML/바닐라 앱을 Next.js로 전환할 때 | [pb-legacy-html-migration.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-legacy-html-migration.md) | Active |
| **PB-ARCH-001** | Server-Driven 초기 데이터 주입 및 320px 모바일 반응형 구현 가이드 | SSR 초기 하이드레이션 구축 및 모바일 반응형 최적화 시 | [pb-server-driven-hydration-and-responsive.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-server-driven-hydration-and-responsive.md) | Active |



