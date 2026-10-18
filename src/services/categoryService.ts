import { supabase } from "@/lib/supabase";
import { CategoryType } from "@/types/ledger";
import { MAJOR_CATEGORIES_TABLE, SUB_CATEGORIES_TABLE } from "@/config/ledger.config";

// ─── 공유 타입 ─────────────────────────────────────────────────────────────────

export interface MajorRow {
  id: string;
  label: string;
  type: CategoryType;
  sort_order: number;
}

export interface SubRow {
  id: string;
  major_id: string;
  value: string;
  label: string;
  sort_order: number;
}

// ─── 읽기 ──────────────────────────────────────────────────────────────────────

export async function fetchMajors(): Promise<MajorRow[]> {
  const { data, error } = await supabase
    .from(MAJOR_CATEGORIES_TABLE)
    .select("*")
    .order("sort_order");

  if (error) throw new Error(error.message);
  return (data as MajorRow[]) ?? [];
}

export async function fetchSubs(majorId?: string): Promise<SubRow[]> {
  let query = supabase
    .from(SUB_CATEGORIES_TABLE)
    .select("*")
    .order("sort_order");

  if (majorId) {
    query = query.eq("major_id", majorId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as SubRow[]) ?? [];
}

// ─── 대분류 CRUD ───────────────────────────────────────────────────────────────

export async function createMajor(payload: {
  id: string;
  label: string;
  type: CategoryType;
  sort_order: number;
}): Promise<MajorRow> {
  const { data, error } = await supabase
    .from(MAJOR_CATEGORIES_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MajorRow;
}

export async function updateMajor(
  id: string,
  patch: Partial<Pick<MajorRow, "label" | "type" | "sort_order">>
): Promise<MajorRow> {
  const { data, error } = await supabase
    .from(MAJOR_CATEGORIES_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MajorRow;
}

export async function deleteMajor(id: string): Promise<void> {
  const { error } = await supabase
    .from(MAJOR_CATEGORIES_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

// ─── 소분류 CRUD ───────────────────────────────────────────────────────────────

export async function createSub(payload: {
  major_id: string;
  value: string;
  label: string;
  sort_order: number;
}): Promise<SubRow> {
  const { data, error } = await supabase
    .from(SUB_CATEGORIES_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as SubRow;
}

export async function updateSub(
  id: string,
  patch: Partial<Pick<SubRow, "value" | "label" | "sort_order">>
): Promise<SubRow> {
  const { data, error } = await supabase
    .from(SUB_CATEGORIES_TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as SubRow;
}

export async function deleteSub(id: string): Promise<void> {
  const { error } = await supabase
    .from(SUB_CATEGORIES_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
