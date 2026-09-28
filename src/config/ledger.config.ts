/**
 * 가계부 전역 설정값
 * 쿼리 범위, 테이블명 등 하드코딩 값을 한 곳에서 관리합니다.
 */

// ─── Supabase 테이블명 ────────────────────────────────────────────────────────
export const LEDGER_TABLE = "ledger_entries" as const;
export const MAJOR_CATEGORIES_TABLE = "major_categories" as const;
export const SUB_CATEGORIES_TABLE = "sub_categories" as const;

// ─── 기본 조회 기간 설정 ───────────────────────────────────────────────────────
/** 기본 조회 기간: 최근 N년 */
export const DEFAULT_FETCH_YEARS = 1;

/** 오늘 기준 N년 전 날짜를 YYYY-MM-DD 형식으로 반환 */
export function getDateYearsAgo(years: number = DEFAULT_FETCH_YEARS): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

/** 특정 YYYY-MM 월의 시작일 / 종료일 반환 */
export function getMonthRange(month: string): { from: string; to: string } {
  const [year, mon] = month.split("-").map(Number);
  const from = `${month}-01`;
  // 다음 달 1일 - 1일 = 해당 월 마지막 날
  const lastDay = new Date(year, mon, 0).getDate();
  const to = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

// ─── Realtime 채널명 ──────────────────────────────────────────────────────────
export const LEDGER_REALTIME_CHANNEL = "ledger_entries_changes" as const;

// ─── "전체 내역" 필터 키 ──────────────────────────────────────────────────────
export const ALL_MONTHS_KEY = "all" as const;
