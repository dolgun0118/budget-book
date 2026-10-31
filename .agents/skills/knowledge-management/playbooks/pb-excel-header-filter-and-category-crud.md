# 엑셀형 컬럼 헤더 필터 및 카테고리 관리(CRUD) 구현 가이드

> **문서 ID**: PB-FE-002  
> **최초 작성일**: 2026-10-18  
> **최종 수정일**: 2026-10-31  
> **버전**: v1.1.0  
> **상태**: Active  

---

# 목적
1. 가계부 데이터 테이블에서 사용자가 엑셀/스프레드시트처럼 각 열(날짜, 대분류, 소분류, 항목명, 금액)별로 정렬하고 원하는 값들을 체크박스로 다중 필터링할 수 있는 UI/UX를 제공합니다.
2. 부부 가계부의 대분류 및 하위 소분류를 동적으로 추가/수정/삭제(CRUD)할 수 있는 독립된 관리 페이지(`/categories`)를 구축하고 Supabase와 실시간 연동합니다.
3. 대분류의 `type`(`income` | `expense` | `save`) 속성을 기준으로 가계부 총 수입, 총 지출, 총 저축 및 대분류별 합계(`byMajor`)를 동적으로 자동 집계하여, 새 대분류가 추가되어도 코드 수정 없이 즉시 반영되도록 보장합니다.
4. 한글/영문 입력기(IME) 환경에서 숫자/금액 입력 시 발생하는 자판 전환 및 글자 삭제(IME 버퍼 충돌) 문제를 방어합니다.

---

# 언제 사용하는가
- 데이터 테이블에 컬럼별 개별 필터링/정렬(Excel 스타일 필터 팝오버)을 구축할 때
- 비즈니스 분류 체계(대분류, 소분류)의 CRUD 관리 화면 및 서비스를 개발할 때
- 금액/숫자 전용 입력창에서 한/영 자판 전환 방지 및 실시간 비숫자 필터링이 필요할 때

---

# 필요한 입력
- 데이터 목록 (`Entry[]`) 및 카테고리 맵 (`CategoryMap`)
- Supabase `major_categories`, `sub_categories` 테이블 스키마 및 CRUD API
- 디자인 시스템 기본 컴포넌트 (`Box`, `Button`, `Input`, `Badge`)

---

# 작업 절차

## Step 1: 카테고리 CRUD 서비스 및 훅 구축
1. **서비스 계층 (`src/services/categoryService.ts`)**:
   - `fetchMajors()`, `fetchSubs()`: Supabase에서 `sort_order` 기준 조회
   - `createMajor()`, `updateMajor()`, `deleteMajor()`: 대분류 CRUD
   - `createSub()`, `updateSub()`, `deleteSub()`: 소분류 CRUD
2. **상태 관리 훅 (`src/hooks/useCategories.ts`)**:
   - 서버에서 SSR로 주입된 초기 데이터를 기반으로 클라이언트 상태 유지
   - 추가 시 `sort_order` 자동 산출 (`Math.max(...sort_order) + 1`)
   - 대분류 삭제 시 하위 소분류 로컬 상태 자동 연쇄 제거

## Step 2: 카테고리 관리 화면 (`/categories`) 구성
1. **서버 컴포넌트 (`src/app/categories/page.tsx`)**:
   - `fetchMajors()`, `fetchSubs()`를 병렬 호출하여 `initialMajors`, `initialSubs`를 주입
2. **2단 반응형 레이아웃 (`src/components/categories/CategoryApp.tsx`)**:
   - 좌측: 대분류 목록 카드 + 인라인 수정 + 2단계 확인삭제 (`확인삭제` 버튼) + 추가 폼
   - 우측: 선택된 대분류의 소분류 목록 + 인라인 수정 + 삭제 + 추가 폼
   - 상단 헤더: `← 가계부로 돌아가기` 네비게이션 제공

## Step 3: 금액 입력 IME 안전 컴포넌트 (`AmountInput.tsx`)
1. `type="text"`를 사용하여 `TAB` 포커스 시 브라우저가 자판을 영문으로 강제 전환하는 현상 방지.
2. `onKeyDown`에서 스페이스바(`e.key === " "`) 입력 차단.
3. `onInput` 및 `onChange`에서 `e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "")`로 DOM 값을 실시간 정제하여 IME 버퍼 꼬임 및 뒷자리 글자 삭제 방지.

## Step 4: 엑셀형 컬럼 헤더 필터/정렬 (`ColumnHeaderFilter.tsx`)
1. **컬럼별 고유값 집계 (`columnOptions`)**:
   - 테이블 전체 내역에서 고유 날짜, 대분류, 소분류, 항목명을 `Map`으로 집계하여 건수(`count`)와 함께 추출.
2. **헤더 팝오버 컴포넌트 (`ColumnHeaderFilter`)**:
   - 헤더 타이틀 클릭 시 오름차순/내림차순 정렬 토글 (▲/▼ 표시)
   - 우측 깔때기 버튼 클릭 시 드롭다운 팝오버 표시
   - 팝오버 내부:
     - `▲ 오름차순` / `▼ 내림차순` 정렬 버튼
     - 옵션 내 실시간 텍스트 검색창 (옵션 5개 이상 시)
     - `(전체 선택)` 체크박스 (일부 선택 시 `indeterminate` 지원)
     - 개별 값 체크박스 목록 (스크롤 지원, 건수 뱃지)
     - 금액 컬럼 전용: `최소 금액 ~ 최대 금액` 범위 입력창
3. **외부 클릭 감지 (`document.addEventListener("mousedown")`)**:
   - 팝오버 외부 클릭 시 자동으로 닫히도록 이벤트 리스너 등록 및 해제.

## Step 5: 테이블 연동 및 동적 합계 계산
1. `filteredAndSortedEntries`를 `useMemo`로 계산:
   - 날짜, 대분류, 소분류, 항목명, 금액 범위, 빠른 통합 검색어를 AND 조건으로 필터링 후 정렬.
2. 필터 적용 시 뱃지에 `선택 N건 / 전체 M건` 및 실시간 `합계: OOO원` 골드 뱃지 표시.
3. `[✕ 필터 초기화]` 버튼으로 한 번에 모든 컬럼의 필터/정렬 리셋 지원.
4. **대분류 `type` 기반 가계부 전체 합계(`totals`) 동적 집계**:
   - `categoryMap[e.major]?.type`에 따라 수입(`income`), 지출(`expense`), 저축(`save`)을 분기 집계.
   - 대분류 ID를 하드코딩하지 않고 `type === 'expense'`인 모든 대분류를 `totalExpense`에 합산.
   - `byMajor: Record<string, number>`에 각 대분류별 합계를 누적하여, 메인 화면 아코디언 패널에서 `totals.byMajor[majorKey]`로 0ms 즉시 연동.

---

# 판단 기준
- **필터링 위치**: 대용량 데이터가 아닌 월별/기간별 가계부 내역(수백~수천 건)은 브라우저 메모리(FE)에서 즉각 필터링하여 네트워크 지연 없이 0ms 응답속도를 유지합니다.
- **삭제 안전장치**: 대분류나 소분류 삭제 시 실수를 방지하기 위해 첫 클릭 시 "확인삭제" 버튼으로 전환되고 재클릭 시 실제 삭제를 수행하는 2단계 확인 UX를 적용합니다.
- **카테고리 확장성**: 대분류 추가/삭제 시 메인 계산 로직을 수정할 필요가 없도록 `CategoryType`(`income` | `expense` | `save`)을 단일 진실 공급원(SSOT)으로 사용합니다.

---

# 예외 상황 및 트러블슈팅
1. **테이블 스크롤 컨테이너(`overflow: auto`)에 의해 헤더 필터 팝오버가 잘리는 현상**:
   - 원인: 테이블 부모 컨테이너가 가로/세로 스크롤(`overflow-x: auto`, `maxHeight`)을 가질 때, 자식 요소의 `position: absolute`가 스크롤 영역 안으로 제한되어 팝오버 하단 및 우측이 잘림(Clipped).
   - 대처: React `createPortal`을 사용하여 팝오버를 `document.body` 최상단으로 분리 렌더링하고, 버튼의 `getBoundingClientRect()`를 기반으로 뷰포트 절대 좌표(`position: fixed`) 및 화면 밖 탈출 방지 알고리즘 적용.
2. **신규 대분류 추가 시 총 지출이나 수입/저축에 합산되지 않는 현상**:
   - 원인: `major === 'common'`처럼 특정 대분류 ID를 하드코딩하여 비교하면 신규 대분류가 누락됨.
   - 대처: 대분류의 `type`(`CategoryType`) 속성을 기반으로 동적 판별하고, 패널 합계는 `totals.byMajor` 맵을 통해 일원화.
2. **금액 입력 시 한/영 자판이 영문으로 전환되는 현상**:
   - 원인: `type="number"` 또는 `inputMode="numeric"` 설정 시 브라우저가 IME를 끄고 Direct English 모드로 진입.
   - 대처: `type="text"` 사용 및 `replace(/[^0-9]/g, "")` 정규식으로 숫자만 허용.
3. **영문/한글 입력 시 기존 숫자의 뒷자리가 지워지는 현상**:
   - 원인: React controlled state와 브라우저 IME composition 버퍼 간의 충돌.
   - 대처: `e.currentTarget.value = cleaned`로 DOM 값을 직접 동기화하고 스페이스바를 원천 차단.

---

# 검수 체크리스트
- [ ] `/categories` 페이지에서 대분류/소분류 추가, 수정, 삭제가 Supabase에 정상 반영되는가?
- [ ] 신규 대분류(지출/수입/저축) 추가 시 상단 요약 카드(`총 수입`, `총 지출`, `총 저축`, `순잔액`)에 즉시 자동 합산되는가?
- [ ] 테이블 각 열의 깔때기 아이콘 클릭 시 정렬 및 체크박스 필터 팝오버가 정상 동작하는가?
- [ ] 특정 항목명(예: `스타벅스`)만 체크했을 때 해당 항목만 필터링되고 합계 금액이 정확히 계산되는가?
- [ ] 금액 입력 필드에서 한글 자판 상태로 입력해도 자판이 바뀌지 않고 숫자가 지워지지 않는가?
- [ ] `tsc --noEmit` 및 `eslint` 검증을 에러 없이 통과하는가?
