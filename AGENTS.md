<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Agent 기본 행동 원칙 및 지식 시스템 규약 (AGENTS.md)

이 문서는 본 프로젝트에서 활동하는 모든 AI Agent가 지켜야 할 최상위 공통 행동 원칙을 정의합니다.
특정 업무의 세부 실행 절차나 지식은 본 문서에 직접 작성하지 않으며, `.agents/skills/knowledge-management/` 하위의 체계화된 Knowledge 및 Playbook을 통해 관리합니다.

---

## 1. 핵심 운영 원칙

모든 Agent는 작업을 시작하거나 지식을 다룰 때 다음 7대 원칙을 철저히 준수해야 합니다.

1. **Knowledge 우선 참고 (Knowledge-First)**
   - 임의의 가정이나 일반 지식에만 의존하지 말고, 프로젝트에 이미 축적된 [Knowledge](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge)를 우선적으로 탐색하고 반영합니다.
2. **기존 Playbook 우선 확인 및 준수 (Playbook-Driven)**
   - 업무 지시를 받으면 해당 작업에 대해 사전 정의된 [Playbook](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks)이 있는지 먼저 확인하고, 절차와 검수 체크리스트를 준수합니다.
3. **근거 없는 내용 등록 금지 (No Ungrounded Knowledge)**
   - 추측, 환각(Hallucination), 또는 검증되지 않은 가정을 사실인 것처럼 Knowledge로 저장하지 않습니다.
   - 모든 지식은 프로젝트 내 실제 소스코드, 실행 결과, 공식 문서, 명시적 사용자 피드백 등의 확실한 근거에 기반해야 합니다.
4. **지식 유형의 엄격한 구분 (Categorization)**
   - 정보를 다룰 때는 반드시 아래의 구분을 엄격히 적용합니다:
     - **Fact (사실)**: 객관적으로 검증된 사실, 데이터, 기술 사양
     - **Observation (관찰)**: 프로젝트 수행 중 관측된 현상 및 동작
     - **Hypothesis (가설)**: 아직 완전히 검증되지 않은 추론이나 전제
     - **Decision (결정)**: 특정 시점에 합의되거나 확정된 의사결정과 그 배경
     - **Lesson (교훈)**: 실제 경험, 성공/실패 사례로부터 도출된 통찰
5. **지식 충돌 감지 및 가시화 (Conflict Detection)**
   - 새로 발견된 정보가 기존 Knowledge나 Playbook의 내용과 상충될 경우, 임의로 덮어쓰지 않고 충돌 내용을 명확히 사용자에게 보고하고 기록합니다.
6. **지속적인 지식/플레이북 개선 제안 (Continuous Improvement)**
   - 업무 수행 과정에서 새로운 패턴, 문제 해결법, 개선된 작업 절차가 발견되면 작업 완료 시 적절한 Knowledge 또는 Playbook 업데이트 후보를 사용자에게 제안합니다.
7. **중복 배제 및 단일 진실 공급원 유지 (Single Source of Truth, SSOT)**
   - 동일한 지식이나 절차가 여러 문서에 중복 기술되지 않도록 관리합니다.
   - 상위 문서에는 링크와 인덱스만 제공하고, 세부 내용은 전용 문서로 분리합니다.

---

## 2. 지식 관리 시스템 구조 및 역할

본 프로젝트의 업무 지식 시스템은 `.agents/skills/knowledge-management/`에 위치하며 다음과 같이 구성됩니다.

```text
.agents/skills/knowledge-management/
├── SKILL.md            # Agent 지식 활용 및 관리 워크플로우 정의
├── playbooks/          # "어떻게 일을 수행하는가" (구체적 실행 절차, 체크리스트)
├── knowledge/          # "무엇을 알고 있는가" (검증된 사실, 결정, 교훈, 패턴)
├── examples/           # 실제 축적된 모범/실패 사례
│   ├── good/           # 성공 사례 및 좋은 판단 사례
│   └── bad/            # 실패 사례, 잘못된 판단, 이슈 사례
└── templates/          # 반복 사용되는 표준 문서 서식
```

- **[SKILL.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/SKILL.md)**: Agent가 요청을 분석하고, 필요한 문서를 선별하여 로드하고, 결과를 검수하는 표준 흐름을 제어합니다.
- **[playbooks/](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks)**: AI가 즉시 실행할 수 있을 정도로 구체적인 절차를 담습니다. 단순 원칙을 기술하지 않습니다.
- **[knowledge/](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/knowledge)**: 5대 유형(Fact/Observation/Hypothesis/Decision/Lesson)으로 구분된 프로젝트 지식 저장소입니다.
- **[examples/](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/examples)**: 좋은 결과와 실패한 결과를 '이유/맥락'과 함께 보관하여 품질 판단의 기준점으로 삼습니다.
- **[templates/](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates)**: 지식, 플레이북, 분석, 기획, 검수, 회고 등을 일관된 양식으로 작성하기 위한 템플릿 모음입니다.

---

## 3. 점진적 공개(Progressive Disclosure) 원칙

- 상위 문서(`AGENTS.md`, `GEMINI.md`, `SKILL.md`)에 모든 세부 지식을 나열하지 않습니다.
- Agent는 사용자의 요청에 꼭 필요한 플레이북과 지식 파일만 타겟팅하여 읽어 들임으로써, 불필요한 컨텍스트 토큰 소모를 방지하고 작업 집중도를 극대화합니다.
