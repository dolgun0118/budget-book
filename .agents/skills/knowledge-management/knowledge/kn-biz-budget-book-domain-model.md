# 부부 공동 가계부 도메인 모델 및 분류 체계

> **지식 ID**: KN-BIZ-001  
> **카테고리**: 비즈니스 | 도메인  
> **최초 등록일**: 2026-09-11  
> **최종 갱신일**: 2026-09-20  
> **검증 상태**: Verified (검증됨)  
> **관련 키워드**: `#domain-model`, `#category-system`, `#ledger`, `#budget`  

---

## 1. 지식 개요 (Overview)
Budget Book 서비스의 핵심 비즈니스 도메인인 **부부 공동 가계부의 4대 분류 체계**, **순잔액 계산 공식**, **소분류 구조**를 정의합니다.

---

## 2. 5대 분류 체계별 지식 상세 (Categorized Content)

### 2.1 Fact (검증된 사실)

#### 4대 대분류 체계
| 대분류 Key | 레이블 | 타입 | 소분류 |
| :--- | :--- | :--- | :--- |
| `income` | 수입내역 | income | `donggun` (동건), `dabin` (다빈) |
| `common` | 공동생활비 | expense | `fixed` (고정비), `variable` (변동비) |
| `personal` | 개인생활비 | expense | `donggun` (동건), `dabin` (다빈) |
| `savings` | 저축·투자 | save | `common` (공동 저축), `donggun` (동건), `dabin` (다빈) |

#### 순잔액 계산 공식
```
순잔액 = 총 수입 - (공동생활비 + 개인생활비) - 저축·투자
```
- 순잔액이 **양수(+)**: 수입 > 지출+저축 → 여유 현금 발생
- 순잔액이 **음수(-)**: 지출+저축 > 수입 → 초과 지출 경고

#### Entry 데이터 모델
```typescript
interface Entry {
  id: string;        // 고유 식별자 (timestamp + random)
  date: string;      // YYYY-MM-DD
  major: MajorCategory; // "income" | "common" | "personal" | "savings"
  sub: string;       // 소분류 key
  item: string;      // 항목명 (사용자 입력)
  amount: number;    // 금액 (원, 양수)
}
```

### 2.2 Observation (관찰된 현상)
- 가계부 HTML 원본은 `window.storage` 외부 API 의존 → Next.js 전환 시 `localStorage` 기반으로 교체
- 초기 시드 데이터 8건으로 앱 최초 실행 시 빈 화면 방지

### 2.3 Decision (의사결정)
- **저장소**: Supabase PostgreSQL (`ledger_entries` 테이블) 실시간 클라우드 DB 채택 및 `useLedger` 훅 연동 (오프라인 시 LocalStorage Fallback)
- **월별 필터**: YYYY-MM 슬라이싱으로 월 식별 → `"all"` 값이면 전체 내역 표시
- **ID 생성**: Supabase UUID 자동 생성 (`id: uuid primary key`)

### 2.4 Lesson (도출된 교훈)
- 도메인 분류 체계를 `CATEGORY_MAP` 단일 상수로 관리하면 대분류 변경 시 UI 전체가 자동 반응하여 유지보수 비용이 크게 줄어듭니다.
- `소분류(sub)`는 대분류(major)에 종속적이므로, 대분류 선택 변경 시 소분류를 첫 번째 값으로 초기화하는 로직이 필수입니다.

---

## 3. 연관 문서 및 플레이북
- [PB-LEGACY-001: 레거시 HTML → Next.js 마이그레이션 플레이북](file:///C:/Users/zipo1/workspace/budget-book/.agents/skills/knowledge-management/playbooks/pb-legacy-html-migration.md)
- 도메인 타입 소스: [src/types/ledger.ts](file:///C:/Users/zipo1/workspace/budget-book/src/types/ledger.ts)
- Supabase 클라이언트: [src/lib/supabase.ts](file:///C:/Users/zipo1/workspace/budget-book/src/lib/supabase.ts)

---

## 5. 변경 이력 (Changelog)
- **2026-09-20**: Supabase DB (`ledger_entries`) 연동 및 실시간 동기화 지원
- **2026-09-20**: 수입/개인생활비/저축 소분류를 원본 도메인에 맞추어 `mine/spouse`(나/배우자)에서 `donggun/dabin`(동건/다빈)으로 복원
- **2026-09-11**: 최초 작성 (우리집가계부.html → Next.js 마이그레이션 과정에서 도메인 모델 확정)
