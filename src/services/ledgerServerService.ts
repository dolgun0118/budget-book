import { supabase } from "@/lib/supabase";
import { Entry, MajorCategory, CategoryMap, CategoryType, DEFAULT_CATEGORY_MAP } from "@/types/ledger";
import { AppInitialConfig } from "@/types/config";
import {
  LEDGER_TABLE,
  MAJOR_CATEGORIES_TABLE,
  SUB_CATEGORIES_TABLE,
  ALL_MONTHS_KEY,
  getDateYearsAgo,
  getMonthRange,
} from "@/config/ledger.config";
import { APP_DISPLAY_NAME, APP_LOGO_TEXT, APP_SUBTITLE } from "@/config/app.config";
import { TABLE_MIN_WIDTH, FORM_DEFAULT_ADD_ROW_COUNT } from "@/config/ui.config";

interface RawEntryRecord {
  id?: string | number;
  date?: string;
  major?: string;
  sub?: string;
  item?: string;
  amount?: number | string;
}

export function normalizeEntry(entry: RawEntryRecord): Entry {
  return {
    id: String(entry.id || ""),
    date: String(entry.date || ""),
    major: (entry.major as MajorCategory) || "income",
    sub: String(entry.sub || ""),
    item: String(entry.item || ""),
    amount: Number(entry.amount || 0),
  };
}

interface MajorRow {
  id: string;
  label: string;
  type: CategoryType;
  sort_order: number;
}

interface SubRow {
  id: string;
  major_id: string;
  value: string;
  label: string;
  sort_order: number;
}

function buildCategoryMap(majorsData: MajorRow[], subsData: SubRow[]): CategoryMap {
  const map: CategoryMap = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_MAP));

  majorsData.forEach((m) => {
    if (!map[m.id]) {
      map[m.id] = { label: m.label, type: m.type, subs: {} };
    } else {
      map[m.id].label = m.label;
      map[m.id].type = m.type;
    }
  });

  subsData.forEach((s) => {
    if (map[s.major_id]) {
      map[s.major_id].subs[s.value] = s.label;
    }
  });

  return map;
}

/**
 * 서버 컴포넌트에서 초기 진입 시 필요한 설정값 및 데이터를 한 번에 가져오는 함수
 */
export async function getInitialLedgerData(): Promise<{
  initialConfig: AppInitialConfig;
  initialEntries: Entry[];
}> {
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // 1. 카테고리 정보와 전체 날짜 목록 병렬 조회
  const [majorsRes, subsRes, datesRes] = await Promise.all([
    supabase.from(MAJOR_CATEGORIES_TABLE).select("*").order("sort_order"),
    supabase.from(SUB_CATEGORIES_TABLE).select("*").order("sort_order"),
    supabase.from(LEDGER_TABLE).select("date").order("date", { ascending: false }),
  ]);

  let categoryMap: CategoryMap = DEFAULT_CATEGORY_MAP;
  if (majorsRes.data && subsRes.data) {
    categoryMap = buildCategoryMap(majorsRes.data as MajorRow[], subsRes.data as SubRow[]);
  }

  // availableMonths 집계 (최신순)
  let availableMonths: string[] = [];
  if (datesRes.data) {
    availableMonths = Array.from(
      new Set(datesRes.data.map((row: { date: string }) => row.date.slice(0, 7)).filter(Boolean))
    ).sort().reverse() as string[];
  }

  // 기본 월 설정: 최신 데이터가 있는 월 또는 당월, 없으면 ALL_MONTHS_KEY
  const defaultMonth = availableMonths.includes(currentYearMonth)
    ? currentYearMonth
    : availableMonths[0] || ALL_MONTHS_KEY;

  // 2. 초기 선택 월의 내역 데이터 조회
  let entriesQuery = supabase
    .from(LEDGER_TABLE)
    .select("*")
    .order("date", { ascending: false });

  if (defaultMonth === ALL_MONTHS_KEY) {
    entriesQuery = entriesQuery.gte("date", getDateYearsAgo());
  } else {
    const { from, to } = getMonthRange(defaultMonth);
    entriesQuery = entriesQuery.gte("date", from).lte("date", to);
  }

  const { data: entriesData } = await entriesQuery;
  const initialEntries = entriesData ? entriesData.map(normalizeEntry) : [];

  const initialConfig: AppInitialConfig = {
    dateFilter: {
      availableMonths,
      defaultMonth,
      currentYearMonth,
    },
    categoryMap,
    branding: {
      appName: APP_DISPLAY_NAME,
      appLogoText: APP_LOGO_TEXT,
      subtitle: APP_SUBTITLE,
    },
    limits: {
      pageSize: 50,
      maxEntryAmount: 1_000_000_000,
      defaultAddRowCount: FORM_DEFAULT_ADD_ROW_COUNT,
      tableMinWidth: TABLE_MIN_WIDTH,
    },
  };

  return {
    initialConfig,
    initialEntries,
  };
}
