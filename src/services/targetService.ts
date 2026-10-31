"use client";

import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { SUB_CATEGORY_TARGETS_TABLE } from "@/config/ledger.config";

export const TARGET_STORAGE_KEY = "budget_book_subcategory_targets";

/**
 * 월별 소분류 목표 금액 구조
 * {
 *   "2026-10": {
 *     "common:food": 600000,
 *     "common:fixed": 1200000
 *   }
 * }
 */
export type TargetAmountMap = Record<string, Record<string, number>>;

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  return localStorage.getItem(TARGET_STORAGE_KEY) ?? "{}";
}

function getServerSnapshot(): string {
  return "{}";
}

/**
 * 로컬 스토리지에서 전체 목표 금액 맵 읽기
 */
export function loadTargetAmountMap(): TargetAmountMap {
  try {
    const raw = getSnapshot();
    return JSON.parse(raw) as TargetAmountMap;
  } catch {
    return {};
  }
}

/**
 * Supabase 서버에서 목표 금액 데이터 조회 및 로컬 캐시 동기화
 */
export async function syncTargetsFromServer(): Promise<TargetAmountMap> {
  try {
    const { data, error } = await supabase
      .from(SUB_CATEGORY_TARGETS_TABLE)
      .select("*");

    if (error) {
      // 테이블이 아직 없거나 권한 오류인 경우 로컬 캐시 유지
      console.warn("Supabase 목표 금액 조회 건너뜀 (테이블 미생성 시):", error.message);
      return loadTargetAmountMap();
    }

    if (data && Array.isArray(data)) {
      const serverMap: TargetAmountMap = {};
      data.forEach((row: { major_id: string; sub_value: string; month: string; amount: number }) => {
        if (!serverMap[row.month]) {
          serverMap[row.month] = {};
        }
        const fullKey = `${row.major_id}:${row.sub_value}`;
        serverMap[row.month][fullKey] = Number(row.amount || 0);
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(TARGET_STORAGE_KEY, JSON.stringify(serverMap));
        emitChange();
      }
      return serverMap;
    }
  } catch (err) {
    console.warn("Supabase 목표 금액 동기화 실패:", err);
  }
  return loadTargetAmountMap();
}

/**
 * 특정 월 기준 소분류의 유효 목표 금액 산출
 * - 해당 월에 설정값이 있으면 그 값 사용
 * - 해당 월에 없으면 이전 월 중 가장 최신 설정값을 승계 (과거 값 보존 원칙)
 */
export function getSubTargetAmount(
  targets: TargetAmountMap,
  majorId: string,
  subValue: string,
  month: string
): number | null {
  const fullKey = `${majorId}:${subValue}`;

  if (!month || month === "all") {
    // 전체 조회 시 가장 최근 월의 설정값 반환
    const allMonths = Object.keys(targets).sort().reverse();
    for (const m of allMonths) {
      if (targets[m]?.[fullKey] !== undefined) return targets[m][fullKey];
      if (targets[m]?.[subValue] !== undefined) return targets[m][subValue];
    }

    return null;
  }

  // 1. 해당 월에 직접 설정된 값 확인
  if (targets[month]?.[fullKey] !== undefined) {
    return targets[month][fullKey];
  }
  if (targets[month]?.[subValue] !== undefined) {
    return targets[month][subValue];
  }

  // 2. 해당 월 이전의 가장 최신 설정값 승계
  const prevMonths = Object.keys(targets)
    .filter((m) => m < month)
    .sort()
    .reverse();

  for (const pm of prevMonths) {
    if (targets[pm]?.[fullKey] !== undefined) {
      return targets[pm][fullKey];
    }
    if (targets[pm]?.[subValue] !== undefined) {
      return targets[pm][subValue];
    }
  }

  return null;
}

/**
 * 특정 월부터 적용될 소분류 목표 금액을 서버(Supabase) 및 로컬스토리지에 저장
 */
export async function saveSubTargetAmount(
  majorId: string,
  subValue: string,
  month: string,
  amount: number
): Promise<void> {
  const cleanAmount = Math.max(0, Math.round(amount));

  // 1. Optimistic Update (클라이언트 즉시 반영)
  if (typeof window !== "undefined") {
    const currentMap = loadTargetAmountMap();
    const fullKey = `${majorId}:${subValue}`;

    if (!currentMap[month]) {
      currentMap[month] = {};
    }
    currentMap[month][fullKey] = cleanAmount;

    try {
      localStorage.setItem(TARGET_STORAGE_KEY, JSON.stringify(currentMap));
      emitChange();
    } catch (err) {
      console.error("로컬 스토리지 목표 금액 저장 실패:", err);
    }
  }

  // 2. 서버 (Supabase) 저장
  try {
    const payload = {
      major_id: majorId,
      sub_value: subValue,
      month: month,
      amount: cleanAmount,
    };

    const { error } = await supabase
      .from(SUB_CATEGORY_TARGETS_TABLE)
      .upsert(payload, { onConflict: "major_id,sub_value,month" });

    if (error) {
      console.warn("Supabase 목표 금액 저장 오류 (테이블 미생성 시 로컬 유지):", error.message);
    }
  } catch (err) {
    console.warn("Supabase 목표 금액 저장 요청 실패:", err);
  }
}

let isRealtimeInitialized = false;

function initRealtimeSync() {
  if (typeof window === "undefined" || isRealtimeInitialized) return;
  isRealtimeInitialized = true;

  try {
    supabase
      .channel("sub_category_targets_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: SUB_CATEGORY_TARGETS_TABLE },
        () => {
          syncTargetsFromServer();
        }
      )
      .subscribe();
  } catch (err) {
    console.warn("Realtime 채널 초기화 실패:", err);
  }
}

/**
 * 소분류 목표 금액을 서버 동기화 및 실시간 구독하는 React 훅
 */
export function useSubTargets(): TargetAmountMap {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 마운트 시 서버 데이터 동기화 및 실시간 구독 (싱글톤)
  useEffect(() => {
    syncTargetsFromServer();
    initRealtimeSync();
  }, []);

  try {
    return JSON.parse(raw) as TargetAmountMap;
  } catch {
    return {};
  }
}
