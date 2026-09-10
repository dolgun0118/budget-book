# useSyncExternalStore 기반 LocalStorage 동기화 패턴

> **지식 ID**: KN-TECH-003  
> **카테고리**: 기술스펙 | 아키텍처  
> **최초 등록일**: 2026-09-11  
> **최종 갱신일**: 2026-09-11  
> **검증 상태**: Verified (검증됨)  
> **관련 키워드**: `#useSyncExternalStore`, `#localStorage`, `#react19`, `#state-management`, `#ssr`

---

## 1. 지식 개요 (Overview)
React의 `useEffect` + `setState` 조합으로 localStorage를 읽으면 ESLint `react-hooks/set-state-in-effect` 규칙 위반과 Cascading re-render 문제가 발생합니다. 이를 **`useSyncExternalStore`** 패턴으로 해결한 검증된 구현 방식을 기록합니다.

---

## 2. 5대 분류 체계별 지식 상세 (Categorized Content)

### 2.1 Fact (검증된 사실)
- **`useSyncExternalStore`** (React 18+)는 외부 데이터 소스(localStorage, Zustand 등)를 React와 안전하게 동기화하기 위해 설계된 공식 API입니다.
- `useEffect` 내부에서 `setState`를 동기적으로 호출하면 렌더링이 연쇄적으로 발생(Cascading)하여 성능 저하를 일으킬 수 있습니다.
- `useSyncExternalStore`는 SSR 지원을 위해 **세 번째 인자**(`getServerSnapshot`)를 반드시 제공해야 Next.js App Router에서 Hydration mismatch가 발생하지 않습니다.

### 2.2 Observation (관찰된 현상)
- `useLedger` 훅에서 `useEffect` + `setEntries` 패턴 사용 시 Next.js 16 ESLint(`eslint-config-next`)의 `react-hooks/set-state-in-effect` 규칙에 의해 빌드 에러가 발생했습니다.
- `useSyncExternalStore`로 교체 후 린트 에러 해소, 빌드 정상 통과, SSR Hydration도 안정화되었습니다.

### 2.3 Decision (의사결정)
- 프로젝트 내 `localStorage` 기반 클라이언트 상태 동기화는 `useEffect + setState` 대신 **`useSyncExternalStore` 패턴을 표준**으로 채택합니다.

### 2.4 Lesson (도출된 교훈)
- **패턴 표준 구현 방식:**
  ```typescript
  // 1. 외부 변경 리스너 관리
  let listeners: Array<() => void> = [];
  function emitChange() { for (const l of listeners) l(); }

  // 2. subscribe 함수 (브라우저 storage 이벤트도 구독)
  function subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    window.addEventListener("storage", listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
      window.removeEventListener("storage", listener);
    };
  }

  // 3. 클라이언트 스냅샷 (localStorage에서 직접 읽음)
  function getSnapshot(): string {
    return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT);
  }

  // 4. 서버 스냅샷 (SSR 시 사용, 항상 기본값 반환)
  function getServerSnapshot(): string {
    return JSON.stringify(DEFAULT);
  }

  // 5. Hook 내부 사용
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const data = useMemo(() => JSON.parse(raw), [raw]);
  ```
- **쓰기 시**: `localStorage.setItem(...)` 후 `emitChange()`를 직접 호출하여 동일 탭의 리스너들에게 변경을 전파합니다.
- **크로스 탭 동기화**: `window.addEventListener("storage", ...)` 구독으로 다른 탭에서 변경 시 자동 반영됩니다.

---

## 3. 연관 문서 및 플레이북
- 실제 구현 소스: [src/hooks/useLedger.ts](file:///C:/Users/zipo1/workspace/budget-book/src/hooks/useLedger.ts)

---

## 5. 변경 이력 (Changelog)
- **2026-09-11**: 최초 작성 (`useLedger` 훅 구현 과정에서 ESLint 에러 해결 경험 기록)
