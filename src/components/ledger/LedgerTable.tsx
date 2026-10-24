"use client";

import { useState, useMemo } from "react";
import { Box, Badge, Button, Input } from "@/components/ui";
import { vars } from "@/styles/theme.css";
import { Entry, CATEGORY_MAP, CategoryMap, MajorCategory } from "@/types/ledger";
import { TABLE_MIN_WIDTH } from "@/config/ui.config";
import { ColumnHeaderFilter, ColumnOption } from "./ColumnHeaderFilter";

interface LedgerTableProps {
  entries: Entry[];
  categoryMap?: CategoryMap;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (entry: Entry) => void;
}

interface EditingState {
  id: string;
  date: string;
  major: MajorCategory;
  sub: string;
  item: string;
  amount: string;
}

type SortKey = "date" | "major" | "sub" | "item" | "amount";

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerTable({
  entries,
  categoryMap,
  onDeleteEntry,
  onUpdateEntry,
}: LedgerTableProps) {
  const map = categoryMap || CATEGORY_MAP;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── 정렬 상태 ─────────────────────────────────────────────────────────
  const [sortConfig, setSortConfig] = useState<{
    key: "date" | "major" | "sub" | "item" | "amount";
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  // ── 엑셀형 열별 필터 상태 ───────────────────────────────────────────────
  const [columnFilters, setColumnFilters] = useState<{
    date: string[];
    major: string[];
    sub: string[];
    item: string[];
  }>({
    date: [],
    major: [],
    sub: [],
    item: [],
  });

  // 금액 범위 필터
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  // 전체 검색어
  const [globalSearch, setGlobalSearch] = useState("");

  // 현재 열려있는 헤더 필터 팝오버 키
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // ── 각 열의 고유값 목록 (체크박스 옵션) ──────────────────────────────────
  const columnOptions = useMemo(() => {
    const datesMap = new Map<string, number>();
    const majorsMap = new Map<string, number>();
    const subsMap = new Map<string, number>();
    const itemsMap = new Map<string, number>();

    entries.forEach((e) => {
      datesMap.set(e.date, (datesMap.get(e.date) || 0) + 1);
      majorsMap.set(e.major, (majorsMap.get(e.major) || 0) + 1);
      subsMap.set(e.sub, (subsMap.get(e.sub) || 0) + 1);
      itemsMap.set(e.item, (itemsMap.get(e.item) || 0) + 1);
    });

    const dateOptions: ColumnOption[] = Array.from(datesMap.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([value, count]) => ({ value, label: value, count }));

    const majorOptions: ColumnOption[] = Array.from(majorsMap.entries())
      .map(([value, count]) => ({
        value,
        label: map[value]?.label || value,
        count,
      }));

    const subOptions: ColumnOption[] = Array.from(subsMap.entries())
      .map(([value, count]) => {
        let label = value;
        for (const m of Object.values(map)) {
          if (m.subs[value]) {
            label = m.subs[value];
            break;
          }
        }
        return { value, label, count };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "ko"));

    const itemOptions: ColumnOption[] = Array.from(itemsMap.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label, "ko"));

    return {
      date: dateOptions,
      major: majorOptions,
      sub: subOptions,
      item: itemOptions,
    };
  }, [entries, map]);

  // ── 필터링 및 정렬 적용 ──────────────────────────────────────────────
  const filteredAndSortedEntries = useMemo(() => {
    const result = entries.filter((e) => {
      // 1. 날짜 필터
      if (columnFilters.date.length > 0 && !columnFilters.date.includes(e.date)) {
        return false;
      }
      // 2. 대분류 필터
      if (columnFilters.major.length > 0 && !columnFilters.major.includes(e.major)) {
        return false;
      }
      // 3. 소분류 필터
      if (columnFilters.sub.length > 0 && !columnFilters.sub.includes(e.sub)) {
        return false;
      }
      // 4. 항목명 필터
      if (columnFilters.item.length > 0 && !columnFilters.item.includes(e.item)) {
        return false;
      }
      // 5. 금액 범위 필터
      const min = amountRange.min ? parseFloat(amountRange.min) : null;
      const max = amountRange.max ? parseFloat(amountRange.max) : null;
      if (min !== null && !isNaN(min) && e.amount < min) return false;
      if (max !== null && !isNaN(max) && e.amount > max) return false;

      // 6. 전체 검색어 필터
      if (globalSearch.trim()) {
        const q = globalSearch.trim().toLowerCase();
        const majorLabel = (map[e.major]?.label || "").toLowerCase();
        const subLabel = (map[e.major]?.subs[e.sub] || "").toLowerCase();
        const item = e.item.toLowerCase();
        const date = e.date.toLowerCase();
        const amountStr = String(e.amount);

        if (
          !item.includes(q) &&
          !majorLabel.includes(q) &&
          !subLabel.includes(q) &&
          !date.includes(q) &&
          !amountStr.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });

    // 정렬 적용
    result.sort((a, b) => {
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      if (sortConfig.key === "amount") {
        return (a.amount - b.amount) * dir;
      }
      if (sortConfig.key === "date") {
        return a.date.localeCompare(b.date) * dir;
      }
      if (sortConfig.key === "major") {
        const aLabel = map[a.major]?.label || a.major;
        const bLabel = map[b.major]?.label || b.major;
        return aLabel.localeCompare(bLabel, "ko") * dir;
      }
      if (sortConfig.key === "sub") {
        const aLabel = map[a.major]?.subs[a.sub] || a.sub;
        const bLabel = map[b.major]?.subs[b.sub] || b.sub;
        return aLabel.localeCompare(bLabel, "ko") * dir;
      }
      if (sortConfig.key === "item") {
        return a.item.localeCompare(b.item, "ko") * dir;
      }
      return 0;
    });

    return result;
  }, [entries, columnFilters, amountRange, globalSearch, sortConfig, map]);

  // 필터링된 결과 합계 금액
  const filteredTotalAmount = useMemo(() => {
    return filteredAndSortedEntries.reduce((acc, cur) => acc + cur.amount, 0);
  }, [filteredAndSortedEntries]);

  // 어떤 필터라도 적용되어 있는지 여부
  const hasActiveFilter =
    columnFilters.date.length > 0 ||
    columnFilters.major.length > 0 ||
    columnFilters.sub.length > 0 ||
    columnFilters.item.length > 0 ||
    amountRange.min !== "" ||
    amountRange.max !== "" ||
    globalSearch.trim() !== "";

  // 모든 필터/정렬 초기화
  const handleResetAll = () => {
    setColumnFilters({ date: [], major: [], sub: [], item: [] });
    setAmountRange({ min: "", max: "" });
    setGlobalSearch("");
    setSortConfig({ key: "date", direction: "desc" });
    setOpenPopover(null);
  };

  // ── 인라인 편집 관련 핸들러 ──────────────────────────────────────────
  const handleEditStart = (e: Entry) => {
    setEditingId(e.id);
    setEditingState({
      id: e.id,
      date: e.date,
      major: e.major,
      sub: e.sub,
      item: e.item,
      amount: String(e.amount),
    });
    setErrorMsg(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingState(null);
    setErrorMsg(null);
  };

  const handleFieldChange = (field: keyof EditingState, value: string) => {
    if (!editingState) return;
    setErrorMsg(null);

    if (field === "major") {
      const newMajor = value as MajorCategory;
      const firstSub = Object.keys(map[newMajor]?.subs || {})[0] || "";
      setEditingState({ ...editingState, major: newMajor, sub: firstSub });
    } else {
      setEditingState({ ...editingState, [field]: value });
    }
  };

  const handleEditSave = () => {
    if (!editingState) return;

    const amount = parseFloat(editingState.amount);
    if (!editingState.date) {
      setErrorMsg("날짜를 입력해주세요.");
      return;
    }
    if (!editingState.item.trim()) {
      setErrorMsg("항목명을 입력해주세요.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("금액은 0원 초과로 입력해주세요.");
      return;
    }

    onUpdateEntry({
      id: editingState.id,
      date: editingState.date,
      major: editingState.major,
      sub: editingState.sub,
      item: editingState.item.trim(),
      amount,
    });

    setEditingId(null);
    setEditingState(null);
    setErrorMsg(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap="3" width="100%">
      {/* ── 테이블 상단 툴바 ────────────────────────────────────────────── */}
      <Box
        display="flex"
        flexDirection={{ mobile: "column", tablet: "row" }}
        justifyContent="space-between"
        alignItems={{ mobile: "stretch", tablet: "center" }}
        gap="3"
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap="2" flexWrap="wrap">
          <Box fontSize="base" fontWeight="bold" color="text">
            전체 내역 목록
          </Box>
          <Badge variant="secondary">
            {hasActiveFilter
              ? `${filteredAndSortedEntries.length} / ${entries.length}건`
              : `${entries.length}건`}
          </Badge>
          {hasActiveFilter && (
            <Badge variant="gold">
              합계: {formatWon(filteredTotalAmount)}
            </Badge>
          )}
          {hasActiveFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              style={{
                fontSize: "12px",
                height: "26px",
                padding: "0 8px",
                color: vars.color.destructive,
              }}
            >
              ✕ 필터 초기화
            </Button>
          )}
        </Box>

        {/* 우측 빠른 통합 검색창 */}
        <Box style={{ width: "240px" }}>
          <Input
            type="text"
            size="sm"
            placeholder="빠른 통합 검색..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={{ height: "32px", fontSize: "12px" }}
          />
        </Box>
      </Box>

      {/* 수정 중 에러 메시지 */}
      {errorMsg && (
        <Box
          p="3"
          rounded="lg"
          bg="surfaceSubtle"
          fontSize="xs"
          color="destructive"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="destructive"
        >
          ⚠️ {errorMsg}
        </Box>
      )}

      {/* ── 테이블 본문 ───────────────────────────────────────────────── */}
      <Box
        bg="surface"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{
          overflowX: "auto",
          maxHeight: "calc(100vh - 350px)",
          // 드롭다운 팝오버가 잘리지 않도록 overflow visible 처리 가능한 컨테이너 스타일 유지
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            minWidth: TABLE_MIN_WIDTH,
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: vars.color.surfaceSubtle,
                color: vars.color.text,
                boxShadow: `inset 0 1px 0 0 ${vars.color.border}`,
                position: "sticky",
                top: 0,
                zIndex: 20,
              }}
            >
              {/* 1. 날짜 헤더 필터 */}
              <th style={{ padding: "10px 14px", fontWeight: 600, width: "145px", minWidth: "140px" }}>
                <ColumnHeaderFilter
                  title="날짜"
                  columnKey="date"
                  currentSort={sortConfig}
                  onSort={(key, dir) => setSortConfig({ key: key as SortKey, direction: dir })}
                  selectedValues={columnFilters.date}
                  onFilterChange={(vals) => setColumnFilters((prev) => ({ ...prev, date: vals }))}
                  options={columnOptions.date}
                  isOpen={openPopover === "date"}
                  onToggleOpen={() => setOpenPopover((prev) => (prev === "date" ? null : "date"))}
                  onClose={() => setOpenPopover(null)}
                />
              </th>

              {/* 2. 대분류 헤더 필터 */}
              <th style={{ padding: "10px 14px", fontWeight: 600, width: "135px", minWidth: "125px" }}>
                <ColumnHeaderFilter
                  title="대분류"
                  columnKey="major"
                  currentSort={sortConfig}
                  onSort={(key, dir) => setSortConfig({ key: key as SortKey, direction: dir })}
                  selectedValues={columnFilters.major}
                  onFilterChange={(vals) => setColumnFilters((prev) => ({ ...prev, major: vals }))}
                  options={columnOptions.major}
                  isOpen={openPopover === "major"}
                  onToggleOpen={() => setOpenPopover((prev) => (prev === "major" ? null : "major"))}
                  onClose={() => setOpenPopover(null)}
                />
              </th>

              {/* 3. 소분류 헤더 필터 */}
              <th style={{ padding: "10px 14px", fontWeight: 600, width: "130px", minWidth: "120px" }}>
                <ColumnHeaderFilter
                  title="소분류"
                  columnKey="sub"
                  currentSort={sortConfig}
                  onSort={(key, dir) => setSortConfig({ key: key as SortKey, direction: dir })}
                  selectedValues={columnFilters.sub}
                  onFilterChange={(vals) => setColumnFilters((prev) => ({ ...prev, sub: vals }))}
                  options={columnOptions.sub}
                  isOpen={openPopover === "sub"}
                  onToggleOpen={() => setOpenPopover((prev) => (prev === "sub" ? null : "sub"))}
                  onClose={() => setOpenPopover(null)}
                />
              </th>

              {/* 4. 항목명 헤더 필터 */}
              <th style={{ padding: "10px 14px", fontWeight: 600, minWidth: "150px" }}>
                <ColumnHeaderFilter
                  title="항목명"
                  columnKey="item"
                  currentSort={sortConfig}
                  onSort={(key, dir) => setSortConfig({ key: key as SortKey, direction: dir })}
                  selectedValues={columnFilters.item}
                  onFilterChange={(vals) => setColumnFilters((prev) => ({ ...prev, item: vals }))}
                  options={columnOptions.item}
                  isOpen={openPopover === "item"}
                  onToggleOpen={() => setOpenPopover((prev) => (prev === "item" ? null : "item"))}
                  onClose={() => setOpenPopover(null)}
                />
              </th>

              {/* 5. 금액 헤더 필터 (금액 범위 및 정렬) */}
              <th style={{ padding: "10px 14px", fontWeight: 600, width: "160px", minWidth: "140px" }}>
                <ColumnHeaderFilter
                  title="금액"
                  columnKey="amount"
                  align="right"
                  isAmount={true}
                  amountRange={amountRange}
                  onAmountRangeChange={setAmountRange}
                  currentSort={sortConfig}
                  onSort={(key, dir) => setSortConfig({ key: key as SortKey, direction: dir })}
                  selectedValues={[]}
                  onFilterChange={() => {}}
                  options={[]}
                  isOpen={openPopover === "amount"}
                  onToggleOpen={() => setOpenPopover((prev) => (prev === "amount" ? null : "amount"))}
                  onClose={() => setOpenPopover(null)}
                />
              </th>

              {/* 6. 관리 */}
              <th style={{ padding: "10px 14px", textAlign: "center", width: "110px", minWidth: "100px", fontWeight: 600 }}>
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "36px 16px",
                    textAlign: "center",
                    color: vars.color.textMuted,
                  }}
                >
                  {hasActiveFilter ? (
                    <Box display="flex" flexDirection="column" alignItems="center" gap="2">
                      <Box>선택한 필터 조건에 일치하는 내역이 없습니다.</Box>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAll}
                        style={{ fontSize: "12px" }}
                      >
                        모든 필터 초기화
                      </Button>
                    </Box>
                  ) : (
                    "등록된 내역이 없습니다. 상단 양식에서 새로운 내역을 추가해 보세요."
                  )}
                </td>
              </tr>
            ) : (
              filteredAndSortedEntries.map((e) => {
                const isEditing = editingId === e.id;
                const cat = map[isEditing ? (editingState?.major ?? e.major) : e.major];
                const badgeVariant =
                  cat?.type === "income"
                    ? "income"
                    : cat?.type === "save"
                    ? "save"
                    : "expense";

                if (isEditing && editingState) {
                  // ── 편집 행 ──────────────────────────────────────────────
                  const editingCat = map[editingState.major];
                  return (
                    <tr
                      key={e.id}
                      style={{
                        borderBottom: `1px solid ${vars.color.border}`,
                        backgroundColor: vars.color.surfaceSubtle,
                      }}
                    >
                      {/* 날짜 */}
                      <td style={{ padding: "8px 10px", minWidth: "140px" }}>
                        <Input
                          type="date"
                          value={editingState.date}
                          onChange={(ev) => handleFieldChange("date", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px", minWidth: "130px" }}
                        />
                      </td>

                      {/* 대분류 */}
                      <td style={{ padding: "8px 10px" }}>
                        <select
                          value={editingState.major}
                          onChange={(ev) => handleFieldChange("major", ev.target.value)}
                          style={{
                            height: "34px",
                            fontSize: "13px",
                            width: "100%",
                            borderRadius: "6px",
                            border: `1px solid ${vars.color.border}`,
                            background: vars.color.surface,
                            color: vars.color.text,
                            padding: "0 6px",
                          }}
                        >
                          {(Object.keys(map) as MajorCategory[]).map((key) => (
                            <option key={key} value={key}>
                              {map[key].label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 소분류 */}
                      <td style={{ padding: "8px 10px" }}>
                        <select
                          value={editingState.sub}
                          onChange={(ev) => handleFieldChange("sub", ev.target.value)}
                          style={{
                            height: "34px",
                            fontSize: "13px",
                            width: "100%",
                            borderRadius: "6px",
                            border: `1px solid ${vars.color.border}`,
                            background: vars.color.surface,
                            color: vars.color.text,
                            padding: "0 6px",
                          }}
                        >
                          {Object.entries(editingCat?.subs || {}).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 항목명 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Input
                          type="text"
                          value={editingState.item}
                          onChange={(ev) => handleFieldChange("item", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px" }}
                          placeholder="항목명"
                        />
                      </td>

                      {/* 금액 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Input
                          type="text"
                          value={editingState.amount}
                          onChange={(ev) => {
                            const cleaned = ev.target.value.replace(/\D/g, "");
                            handleFieldChange("amount", cleaned);
                          }}
                          style={{ height: "34px", fontSize: "13px", textAlign: "right" }}
                          placeholder="0"
                        />
                      </td>

                      {/* 관리 버튼 */}
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <Box display="flex" gap="1" justifyContent="center">
                          <Button
                            variant="default"
                            size="sm"
                            style={{
                              height: "28px",
                              padding: "0 8px",
                              fontSize: "12px",
                            }}
                            onClick={handleEditSave}
                          >
                            저장
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              height: "28px",
                              padding: "0 8px",
                              fontSize: "12px",
                            }}
                            onClick={handleEditCancel}
                          >
                            취소
                          </Button>
                        </Box>
                      </td>
                    </tr>
                  );
                }

                // ── 일반 행 ──────────────────────────────────────────────────
                return (
                  <tr
                    key={e.id}
                    style={{
                      borderBottom: `1px solid ${vars.color.border}`,
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        color: vars.color.textMuted,
                        minWidth: "105px",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {e.date}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <Badge variant={badgeVariant}>{cat?.label || e.major}</Badge>
                    </td>
                    <td style={{ padding: "10px 14px", color: vars.color.text }}>
                      {cat?.subs[e.sub] || e.sub}
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 500, color: vars.color.text }}>
                      {e.item}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "right",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        color:
                          cat?.type === "income"
                            ? vars.color.success
                            : cat?.type === "save"
                            ? vars.color.save
                            : vars.color.text,
                      }}
                    >
                      {formatWon(e.amount)}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      <Box display="flex" gap="1" justifyContent="center">
                        <Button
                          variant="outline"
                          size="sm"
                          style={{
                            height: "28px",
                            padding: "0 8px",
                            fontSize: "12px",
                            borderColor: vars.color.primary,
                            color: vars.color.primary,
                          }}
                          onClick={() => handleEditStart(e)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          style={{
                            height: "28px",
                            padding: "0 8px",
                            fontSize: "12px",
                            borderColor: vars.color.border,
                          }}
                          onClick={() => onDeleteEntry(e.id)}
                        >
                          삭제
                        </Button>
                      </Box>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
