"use client";

import { useState, useCallback } from "react";
import {
  MajorRow,
  SubRow,
  fetchMajors,
  fetchSubs,
  createMajor,
  updateMajor,
  deleteMajor,
  createSub,
  updateSub,
  deleteSub,
} from "@/services/categoryService";
import { CategoryType } from "@/types/ledger";

interface UseCategoriesProps {
  initialMajors: MajorRow[];
  initialSubs: SubRow[];
}

export function useCategories({ initialMajors, initialSubs }: UseCategoriesProps) {
  const [majors, setMajors] = useState<MajorRow[]>(initialMajors);
  const [subs, setSubs] = useState<SubRow[]>(initialSubs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ─── 전체 새로고침 ────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const [newMajors, newSubs] = await Promise.all([fetchMajors(), fetchSubs()]);
      setMajors(newMajors);
      setSubs(newSubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "새로고침 실패");
    }
  }, []);

  // ─── 대분류 추가 ──────────────────────────────────────────────────────────────
  const addMajor = useCallback(
    async (payload: { id: string; label: string; type: CategoryType }) => {
      setIsLoading(true);
      setError(null);
      try {
        const sort_order = majors.length > 0 ? Math.max(...majors.map((m) => m.sort_order)) + 1 : 0;
        const created = await createMajor({ ...payload, sort_order });
        setMajors((prev) => [...prev, created]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "대분류 추가 실패");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [majors]
  );

  // ─── 대분류 수정 ──────────────────────────────────────────────────────────────
  const editMajor = useCallback(
    async (id: string, patch: Partial<Pick<MajorRow, "label" | "type">>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await updateMajor(id, patch);
        setMajors((prev) => prev.map((m) => (m.id === id ? updated : m)));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "대분류 수정 실패");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ─── 대분류 삭제 ──────────────────────────────────────────────────────────────
  const removeMajor = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteMajor(id);
      setMajors((prev) => prev.filter((m) => m.id !== id));
      setSubs((prev) => prev.filter((s) => s.major_id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "대분류 삭제 실패");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── 소분류 추가 ──────────────────────────────────────────────────────────────
  const addSub = useCallback(
    async (payload: { major_id: string; value: string; label: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const siblingSubs = subs.filter((s) => s.major_id === payload.major_id);
        const sort_order =
          siblingSubs.length > 0 ? Math.max(...siblingSubs.map((s) => s.sort_order)) + 1 : 0;
        const created = await createSub({ ...payload, sort_order });
        setSubs((prev) => [...prev, created]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "소분류 추가 실패");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [subs]
  );

  // ─── 소분류 수정 ──────────────────────────────────────────────────────────────
  const editSub = useCallback(
    async (id: string, patch: Partial<Pick<SubRow, "value" | "label">>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await updateSub(id, patch);
        setSubs((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "소분류 수정 실패");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ─── 소분류 삭제 ──────────────────────────────────────────────────────────────
  const removeSub = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteSub(id);
      setSubs((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "소분류 삭제 실패");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── 특정 대분류의 소분류 조회 ──────────────────────────────────────────────────
  const getSubsForMajor = useCallback(
    (majorId: string) => subs.filter((s) => s.major_id === majorId),
    [subs]
  );

  return {
    majors,
    subs,
    isLoading,
    error,
    clearError,
    refresh,
    addMajor,
    editMajor,
    removeMajor,
    addSub,
    editSub,
    removeSub,
    getSubsForMajor,
  };
}
