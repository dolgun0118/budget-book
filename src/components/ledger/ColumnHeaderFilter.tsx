"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Button, Input } from "@/components/ui";

export interface ColumnOption {
  value: string;
  label: string;
  count: number;
}

export interface ColumnHeaderFilterProps {
  title: string;
  columnKey: string;
  align?: "left" | "right" | "center";
  currentSort: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string, direction: "asc" | "desc") => void;
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  options: ColumnOption[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
  isAmount?: boolean;
  amountRange?: { min: string; max: string };
  onAmountRangeChange?: (range: { min: string; max: string }) => void;
}

export function ColumnHeaderFilter({
  title,
  columnKey,
  align = "left",
  currentSort,
  onSort,
  selectedValues,
  onFilterChange,
  options,
  isOpen,
  onToggleOpen,
  onClose,
  isAmount = false,
  amountRange = { min: "", max: "" },
  onAmountRangeChange,
}: ColumnHeaderFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const isSortedAsc = currentSort?.key === columnKey && currentSort.direction === "asc";
  const isSortedDesc = currentSort?.key === columnKey && currentSort.direction === "desc";
  const hasFilter =
    selectedValues.length > 0 ||
    (isAmount && (amountRange.min !== "" || amountRange.max !== ""));

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // 검색어로 옵션 필터링
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase();
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q)
    );
  }, [options, searchTerm]);

  // 체크박스 토글
  const handleToggleValue = (val: string) => {
    if (selectedValues.includes(val)) {
      onFilterChange(selectedValues.filter((v) => v !== val));
    } else {
      onFilterChange([...selectedValues, val]);
    }
  };

  // 전체 선택/해제
  const isAllChecked =
    options.length > 0 && selectedValues.length === options.length;
  const isIndeterminate =
    selectedValues.length > 0 && selectedValues.length < options.length;

  const handleToggleAll = () => {
    if (isAllChecked || isIndeterminate) {
      onFilterChange([]);
    } else {
      onFilterChange(options.map((o) => o.value));
    }
  };

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent={align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"}
      gap="1"
      width="100%"
      style={{ userSelect: "none" }}
    >
      {/* 컬럼 제목 (클릭 시 정렬 토글) */}
      <Box
        as="span"
        onClick={() => onSort(columnKey, isSortedAsc ? "desc" : "asc")}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
        title="클릭하여 정렬"
      >
        <span>{title}</span>
        {isSortedAsc && (
          <span style={{ fontSize: "11px", color: "var(--color-primary)" }}>▲</span>
        )}
        {isSortedDesc && (
          <span style={{ fontSize: "11px", color: "var(--color-primary)" }}>▼</span>
        )}
      </Box>

      {/* 엑셀형 필터 드롭다운 토글 버튼 */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        style={{
          background: hasFilter ? "var(--color-primarySubtle)" : "transparent",
          border: hasFilter ? "1px solid var(--color-primary)" : "1px solid transparent",
          borderRadius: "4px",
          padding: "2px 4px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: hasFilter ? "var(--color-primary)" : "var(--color-textMuted)",
          fontSize: "11px",
          marginLeft: "2px",
        }}
        title={`${title} 필터 및 정렬`}
      >
        {/* 깔때기(필터) 아이콘 */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={hasFilter ? "2.5" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>

      {/* ── 엑셀형 필터 팝오버 카드 ────────────────────────────────────────── */}
      {isOpen && (
        <Box
          ref={popoverRef}
          position="absolute"
          bg="surface"
          p="3"
          rounded="xl"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="border"
          style={{
            top: "calc(100% + 6px)",
            [align === "right" ? "right" : "left"]: 0,
            zIndex: 999,
            minWidth: "220px",
            maxWidth: "280px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. 정렬 버튼 그룹 */}
          <Box display="flex" flexDirection="column" gap="1" pb="2" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <Box fontSize="xs" fontWeight="semibold" color="textMuted" style={{ marginBottom: "2px" }}>
              정렬
            </Box>
            <Box display="flex" gap="1">
              <Button
                type="button"
                size="sm"
                variant={isSortedAsc ? "default" : "outline"}
                onClick={() => onSort(columnKey, "asc")}
                style={{ flex: 1, fontSize: "11px", height: "26px", padding: "0 6px" }}
              >
                ▲ 오름차순
              </Button>
              <Button
                type="button"
                size="sm"
                variant={isSortedDesc ? "default" : "outline"}
                onClick={() => onSort(columnKey, "desc")}
                style={{ flex: 1, fontSize: "11px", height: "26px", padding: "0 6px" }}
              >
                ▼ 내림차순
              </Button>
            </Box>
          </Box>

          {/* 2. 필터 영역 */}
          <Box pt="2" display="flex" flexDirection="column" gap="2">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontSize="xs" fontWeight="semibold" color="textMuted">
                필터 ({selectedValues.length > 0 ? `${selectedValues.length}개 선택` : "전체"})
              </Box>
              {hasFilter && (
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange([]);
                    if (onAmountRangeChange) onAmountRangeChange({ min: "", max: "" });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "11px",
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  초기화
                </button>
              )}
            </Box>

            {/* 금액 컬럼인 경우: 범위 입력 */}
            {isAmount ? (
              <Box display="flex" flexDirection="column" gap="1.5">
                <Box display="flex" alignItems="center" gap="1">
                  <Input
                    type="text"
                    placeholder="최소 금액"
                    value={amountRange.min}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      if (onAmountRangeChange) {
                        onAmountRangeChange({ ...amountRange, min: cleaned });
                      }
                    }}
                    style={{ height: "30px", fontSize: "12px" }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--color-textMuted)" }}>~</span>
                  <Input
                    type="text"
                    placeholder="최대 금액"
                    value={amountRange.max}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      if (onAmountRangeChange) {
                        onAmountRangeChange({ ...amountRange, max: cleaned });
                      }
                    }}
                    style={{ height: "30px", fontSize: "12px" }}
                  />
                </Box>
              </Box>
            ) : (
              <>
                {/* 검색 인풋 (옵션이 5개 이상일 때) */}
                {options.length > 4 && (
                  <Input
                    type="text"
                    size="sm"
                    placeholder="값 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ height: "28px", fontSize: "11px" }}
                  />
                )}

                {/* 전체 선택 체크박스 */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "2px 0",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={handleToggleAll}
                    style={{ cursor: "pointer" }}
                  />
                  <span>(전체 선택)</span>
                </label>

                {/* 개별 값 체크박스 목록 */}
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="1"
                  style={{
                    maxHeight: "160px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {filteredOptions.length === 0 ? (
                    <Box fontSize="xs" color="textMuted" style={{ padding: "8px 0", textAlign: "center" }}>
                      일치하는 항목 없음
                    </Box>
                  ) : (
                    filteredOptions.map((opt) => {
                      const checked =
                        selectedValues.length === 0 || selectedValues.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            backgroundColor: checked && selectedValues.length > 0 ? "var(--color-primarySubtle)" : "transparent",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap="1.5" style={{ minWidth: 0, flex: 1 }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleValue(opt.value)}
                              style={{ cursor: "pointer" }}
                            />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={opt.label}
                            >
                              {opt.label}
                            </span>
                          </Box>
                          <span style={{ fontSize: "10px", color: "var(--color-textMuted)", marginLeft: "4px" }}>
                            {opt.count}
                          </span>
                        </label>
                      );
                    })
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* 3. 하단 닫기/확인 버튼 */}
          <Box pt="2" mt="2" style={{ borderTop: "1px solid var(--color-border)" }} display="flex" justifyContent="flex-end">
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={onClose}
              style={{ fontSize: "11px", height: "26px", padding: "0 10px" }}
            >
              확인
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
