"use client";

import { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { Entry, MajorCategory, CATEGORY_MAP, LedgerTotals } from "@/types/ledger";

const STORAGE_KEY = "budget_book_entries";

const INITIAL_ENTRIES: Entry[] = [
  {
    id: "seed-1",
    date: "2026-09-01",
    major: "income",
    sub: "mine",
    item: "9월 급여",
    amount: 3500000,
  },
  {
    id: "seed-2",
    date: "2026-09-02",
    major: "income",
    sub: "spouse",
    item: "배우자 급여",
    amount: 3200000,
  },
  {
    id: "seed-3",
    date: "2026-09-05",
    major: "common",
    sub: "fixed",
    item: "아파트 관리비",
    amount: 280000,
  },
  {
    id: "seed-4",
    date: "2026-09-06",
    major: "common",
    sub: "variable",
    item: "주말 마트 장보기",
    amount: 145000,
  },
  {
    id: "seed-5",
    date: "2026-09-08",
    major: "personal",
    sub: "mine",
    item: "교통비 충전",
    amount: 65000,
  },
  {
    id: "seed-6",
    date: "2026-09-09",
    major: "personal",
    sub: "spouse",
    item: "도서 구입",
    amount: 38000,
  },
  {
    id: "seed-7",
    date: "2026-09-10",
    major: "savings",
    sub: "common",
    item: "주택청약 및 주택자금 적금",
    amount: 1500000,
  },
  {
    id: "seed-8",
    date: "2026-09-10",
    major: "savings",
    sub: "mine",
    item: "개인연금저축",
    amount: 300000,
  },
];

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  window.addEventListener("storage", listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") {
    return JSON.stringify(INITIAL_ENTRIES);
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENTRIES));
    return JSON.stringify(INITIAL_ENTRIES);
  }
  return saved;
}

function getServerSnapshot(): string {
  return JSON.stringify(INITIAL_ENTRIES);
}

export function useLedger() {
  const [currentMonth, setCurrentMonth] = useState<string>("all");

  const rawEntries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const entries: Entry[] = useMemo(() => {
    try {
      return JSON.parse(rawEntries);
    } catch {
      return INITIAL_ENTRIES;
    }
  }, [rawEntries]);

  // 변경 사항 LocalStorage 동기화
  const persistEntries = useCallback((newEntries: Entry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      emitChange();
    } catch (err) {
      console.error("가계부 데이터 저장 실패:", err);
    }
  }, []);

  // 월 추출 헬퍼 (YYYY-MM)
  const monthOf = useCallback((dateStr: string) => {
    return dateStr ? dateStr.slice(0, 7) : "";
  }, []);

  // 사용 가능한 월 목록
  const availableMonths = useMemo(() => {
    const months = Array.from(
      new Set(entries.map((e) => monthOf(e.date)).filter(Boolean))
    ).sort().reverse();
    return months;
  }, [entries, monthOf]);

  // 필터링된 내역
  const filteredEntries = useMemo(() => {
    if (currentMonth === "all") return entries;
    return entries.filter((e) => monthOf(e.date) === currentMonth);
  }, [entries, currentMonth, monthOf]);

  // 합계 계산
  const totals: LedgerTotals = useMemo(() => {
    const res = {
      income: 0,
      common: 0,
      personal: 0,
      savings: 0,
      totalExpense: 0,
      balance: 0,
    };

    filteredEntries.forEach((e) => {
      if (e.major === "income") res.income += e.amount;
      else if (e.major === "common") res.common += e.amount;
      else if (e.major === "personal") res.personal += e.amount;
      else if (e.major === "savings") res.savings += e.amount;
    });

    res.totalExpense = res.common + res.personal;
    res.balance = res.income - res.totalExpense - res.savings;

    return res;
  }, [filteredEntries]);

  // 소분류별 그룹화
  const groupedBySub = useMemo(() => {
    const result: Record<MajorCategory, Record<string, Entry[]>> = {
      income: {},
      common: {},
      personal: {},
      savings: {},
    };

    (Object.keys(CATEGORY_MAP) as MajorCategory[]).forEach((major) => {
      Object.keys(CATEGORY_MAP[major].subs).forEach((sub) => {
        result[major][sub] = [];
      });
    });

    filteredEntries.forEach((e) => {
      if (result[e.major] && result[e.major][e.sub]) {
        result[e.major][e.sub].push(e);
      }
    });

    return result;
  }, [filteredEntries]);

  // 내역 추가
  const addEntry = useCallback(
    (entry: Omit<Entry, "id">) => {
      const newEntry: Entry = {
        ...entry,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      };
      persistEntries([newEntry, ...entries]);
    },
    [entries, persistEntries]
  );

  // 내역 삭제
  const deleteEntry = useCallback(
    (id: string) => {
      persistEntries(entries.filter((e) => e.id !== id));
    },
    [entries, persistEntries]
  );

  return {
    entries,
    filteredEntries,
    isLoaded: true,
    currentMonth,
    setCurrentMonth,
    availableMonths,
    totals,
    groupedBySub,
    addEntry,
    deleteEntry,
  };
}
