"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Entry, LedgerTotals, CategoryMap } from "@/types/ledger";
import { AppInitialConfig } from "@/types/config";
import { supabase } from "@/lib/supabase";
import {
  LEDGER_TABLE,
  LEDGER_REALTIME_CHANNEL,
  ALL_MONTHS_KEY,
  getDateYearsAgo,
  getMonthRange,
} from "@/config/ledger.config";
import { normalizeEntry } from "@/services/ledgerServerService";

interface UseLedgerProps {
  initialConfig: AppInitialConfig;
  initialEntries: Entry[];
}

export function useLedger({ initialConfig, initialEntries }: UseLedgerProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [availableMonths, setAvailableMonths] = useState<string[]>(
    initialConfig.dateFilter.availableMonths
  );
  const [categoryMap] = useState<CategoryMap>(initialConfig.categoryMap);
  const [isLoaded] = useState(true); // 서버에서 초기 주입받으므로 즉시 loaded 상태
  const [currentMonth, setCurrentMonth] = useState<string>(
    initialConfig.dateFilter.defaultMonth
  );

  // ── 월 목록 최신화 (Realtime 등 발생 시) ──────────────────────────────────
  const refreshAvailableMonths = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(LEDGER_TABLE)
        .select("date")
        .order("date", { ascending: false });

      if (!error && data) {
        const months = Array.from(
          new Set(data.map((row: { date: string }) => row.date.slice(0, 7)).filter(Boolean))
        ).sort().reverse() as string[];
        setAvailableMonths(months);
      }
    } catch (err) {
      console.error("월 목록 로드 실패:", err);
    }
  }, []);

  // ── 특정 월 or 기본 기간 데이터 로드 ────────────────────────────────────────
  const loadEntries = useCallback(async (month: string) => {
    try {
      let query = supabase
        .from(LEDGER_TABLE)
        .select("*")
        .order("date", { ascending: false });

      if (month === ALL_MONTHS_KEY) {
        // 전체 내역: 기본 조회 기간(1년) 적용
        query = query.gte("date", getDateYearsAgo());
      } else {
        // 특정 월: 해당 월의 시작일~종료일만 조회
        const { from, to } = getMonthRange(month);
        query = query.gte("date", from).lte("date", to);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase 데이터 조회 오류:", error.message);
        setEntries([]);
      } else if (data) {
        setEntries(data.map(normalizeEntry));
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setEntries([]);
    }
  }, []);

  // ── Realtime 구독 ─────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(LEDGER_REALTIME_CHANNEL)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: LEDGER_TABLE },
        () => {
          // 실시간 변경 발생 시 월 목록 및 현재 월 내역 갱신
          refreshAvailableMonths();
          loadEntries(currentMonth);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAvailableMonths, loadEntries, currentMonth]);

  // ── 월 변경 시 해당 월 데이터를 새로 fetch ───────────────────────────────────
  const handleMonthChange = useCallback(
    async (month: string) => {
      setCurrentMonth(month);
      await loadEntries(month);
    },
    [loadEntries]
  );

  // ─── 합계 계산 ──────────────────────────────────────────────────────────────
  const totals: LedgerTotals = useMemo(() => {
    const res = { income: 0, common: 0, personal: 0, savings: 0, totalExpense: 0, balance: 0 };

    entries.forEach((e) => {
      if (e.major === "income") res.income += e.amount;
      else if (e.major === "common") res.common += e.amount;
      else if (e.major === "personal") res.personal += e.amount;
      else if (e.major === "savings") res.savings += e.amount;
    });

    res.totalExpense = res.common + res.personal;
    res.balance = res.income - res.totalExpense - res.savings;
    return res;
  }, [entries]);

  // ─── 소분류별 그룹화 ─────────────────────────────────────────────────────────
  const groupedBySub = useMemo(() => {
    const result: Record<string, Record<string, Entry[]>> = {};

    Object.keys(categoryMap).forEach((major) => {
      result[major] = {};
      Object.keys(categoryMap[major].subs).forEach((sub) => {
        result[major][sub] = [];
      });
    });

    entries.forEach((e) => {
      if (!result[e.major]) result[e.major] = {};
      if (!result[e.major][e.sub]) result[e.major][e.sub] = [];
      result[e.major][e.sub].push(e);
    });

    return result;
  }, [entries, categoryMap]);

  // ─── 단일 내역 추가 ──────────────────────────────────────────────────────────
  const addEntry = useCallback(async (entry: Omit<Entry, "id">) => {
    const payload = {
      date: entry.date,
      major: entry.major,
      sub: entry.sub,
      item: entry.item,
      amount: Math.round(entry.amount),
    };

    try {
      const { data, error } = await supabase.from(LEDGER_TABLE).insert([payload]).select();

      if (error) {
        console.error("Supabase 저장 오류:", error.message);
      } else if (data && data.length > 0) {
        const created = normalizeEntry(data[0]);
        setEntries((prev) => [created, ...prev.filter((e) => e.id !== created.id)]);
      }
    } catch (err) {
      console.error("추가 실패:", err);
    }
  }, []);

  // ─── 다중 내역 일괄 추가 ─────────────────────────────────────────────────────
  const addEntries = useCallback(async (newItems: Array<Omit<Entry, "id">>) => {
    if (!newItems || newItems.length === 0) return;

    const payloads = newItems.map((item) => ({
      date: item.date,
      major: item.major,
      sub: item.sub,
      item: item.item,
      amount: Math.round(item.amount),
    }));

    try {
      const { data, error } = await supabase.from(LEDGER_TABLE).insert(payloads).select();

      if (error) {
        console.error("Supabase 일괄 저장 오류:", error.message);
      } else if (data && data.length > 0) {
        const created = data.map(normalizeEntry);
        setEntries((prev) => {
          const createdIds = new Set(created.map((c) => c.id));
          return [...created, ...prev.filter((e) => !createdIds.has(e.id))];
        });
      }
    } catch (err) {
      console.error("일괄 추가 실패:", err);
    }
  }, []);

  // ─── 내역 삭제 ───────────────────────────────────────────────────────────────
  const deleteEntry = useCallback(async (id: string) => {
    // 낙관적 업데이트 (Optimistic UI)
    setEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      const { error } = await supabase.from(LEDGER_TABLE).delete().eq("id", id);

      if (error) {
        console.warn("Supabase 삭제 오류:", error.message);
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  }, []);

  return {
    entries,
    categoryMap,
    filteredEntries: entries,
    isLoaded,
    currentMonth,
    setCurrentMonth: handleMonthChange,
    availableMonths,
    totals,
    groupedBySub,
    addEntry,
    addEntries,
    deleteEntry,
    refetch: () => loadEntries(currentMonth),
  };
}
