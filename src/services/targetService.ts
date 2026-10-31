"use client";

import { useSyncExternalStore } from "react";

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
 * 특정 월 기준 소분류의 유효 목표 금액 산출
 * - 해당 월에 설정값이 있으면 그 값 사용
 * - 해당 월에 없으면 이전 월 중 가장 최신 설정값을 승계 (과거 값 보존 원칙)
 */
export function getSubTargetAmount(
  targets: TargetAmountMap,
  majorId: string,
  subValue: string,
  month: string
): number {
  const fullKey = `${majorId}:${subValue}`;

  if (!month || month === "all") {
    // 전체 조회 시 가장 최근 월의 설정값 반환
    const allMonths = Object.keys(targets).sort().reverse();
    for (const m of allMonths) {
      if (targets[m]?.[fullKey] !== undefined) return targets[m][fullKey];
      if (targets[m]?.[subValue] !== undefined) return targets[m][subValue];
    }
    return 0;
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

  return 0;
}

/**
 * 특정 월부터 적용될 소분류 목표 금액 저장
 */
export function saveSubTargetAmount(
  majorId: string,
  subValue: string,
  month: string,
  amount: number
): void {
  if (typeof window === "undefined") return;

  const currentMap = loadTargetAmountMap();
  const fullKey = `${majorId}:${subValue}`;

  if (!currentMap[month]) {
    currentMap[month] = {};
  }

  currentMap[month][fullKey] = Math.max(0, Math.round(amount));

  try {
    localStorage.setItem(TARGET_STORAGE_KEY, JSON.stringify(currentMap));
    emitChange();
  } catch (err) {
    console.error("목표 금액 저장 실패:", err);
  }
}

/**
 * 소분류 목표 금액을 실시간 구독하는 React 훅
 */
export function useSubTargets(): TargetAmountMap {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  try {
    return JSON.parse(raw) as TargetAmountMap;
  } catch {
    return {};
  }
}
