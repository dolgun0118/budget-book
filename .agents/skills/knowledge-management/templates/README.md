# Templates 디렉터리 안내

본 디렉터리는 프로젝트 진행 중 반복적으로 작성되는 모든 정형 문서의 표준 서식을 보관하는 장소입니다.
일관된 구조로 문서를 작성함으로써 AI Agent와 작업자 간의 소통 비용을 줄이고, 문서 검색과 파싱의 정확도를 보장합니다.

---

## 제공되는 표준 템플릿 목록

| 템플릿 파일명 | 용도 및 설명 | 연관 디렉터리 |
| :--- | :--- | :--- |
| **[playbook-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/playbook-template.md)** | 실행 가능한 구체적 작업 절차서 작성 서식 | `../playbooks/` |
| **[knowledge-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/knowledge-template.md)** | Fact, Observation, Hypothesis, Decision, Lesson 5대 분류 기반 지식 작성 서식 | `../knowledge/` |
| **[example-good-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/example-good-template.md)** | 성공 요인 및 판단 근거가 포함된 모범 사례 서식 | `../examples/good/` |
| **[example-bad-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/example-bad-template.md)** | 발생 문제, 근본 원인 분석, 재발 방지책이 포함된 실패 사례 서식 | `../examples/bad/` |
| **[analysis-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/analysis-template.md)** | 기술 스택, 성능, 이슈 원인 조사 및 분석 서식 | 작업 산출물 |
| **[planning-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/planning-template.md)** | 기능 명세, 일정, 마일스톤, 리스크 관리를 위한 기획 서식 | 작업 산출물 |
| **[review-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/review-template.md)** | 플레이북 체크리스트 검증 및 결과물 품질 평가 검수 서식 | 작업 산출물 |
| **[retrospective-template.md](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/templates/retrospective-template.md)** | KPT 기반 회고 및 지식/플레이북 업데이트 도출 서식 | 지식 발전 루프 |

---

## 템플릿 활용 지침

1. **복사 후 작성**: 문서를 새로 작성할 때는 해당 템플릿을 복사하여 대상 디렉터리에 새로운 파일로 저장한 후 내용을 채웁니다.
2. **필수 섹션 유지**: 템플릿에 지정된 `#` 및 `##` 헤더 구조는 AI Agent가 문서를 파싱하고 검색하는 데 사용되므로 임의로 삭제하거나 변경하지 않습니다.
3. **가상 내용 금지**: 아직 실제 데이터나 검증된 사실이 없는 빈 항목은 임의로 지어내지 않고 비워두거나 `TBD`로 표시합니다.
