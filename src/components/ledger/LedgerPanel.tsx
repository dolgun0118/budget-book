"use client";

import { useState } from "react";
import { Box, Badge } from "@/components/ui";
import { CATEGORY_MAP, Entry, CategoryInfo } from "@/types/ledger";
import { SUBCATEGORY_COLOR_PALETTE, PANEL_EMPTY_SUB_PREVIEW_COUNT } from "@/config/ui.config";

interface LedgerPanelProps {
  major: string;
  total: number;
  subGroups: Record<string, Entry[]>;
  categoryInfo?: CategoryInfo;
  defaultOpen?: boolean;
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerPanel({
  major,
  total,
  subGroups,
  categoryInfo: customCategoryInfo,
  defaultOpen = true,
}: LedgerPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const categoryInfo =
    customCategoryInfo ||
    CATEGORY_MAP[major] || {
      label: major,
      type: "expense",
      subs: {},
    };

  const badgeVariant =
    categoryInfo.type === "income"
      ? "income"
      : categoryInfo.type === "save"
      ? "save"
      : "expense";

  const activeSubEntries = Object.entries(categoryInfo.subs).filter(([subKey]) => {
    const items = subGroups[subKey] || [];
    return items.length > 0;
  });

  const displayedSubs =
    activeSubEntries.length > 0
      ? activeSubEntries
      : Object.entries(categoryInfo.subs).slice(0, PANEL_EMPTY_SUB_PREVIEW_COUNT);

  return (
    <Box
      bg="surface"
      rounded="2xl"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      overflow="hidden"
      width="100%"
    >
      {/* Panel Header */}
      <Box
        p={{ mobile: "3", tablet: "4" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderBottom: isOpen ? "1px solid var(--color-border)" : "none",
          transition: "background-color 0.15s ease",
        }}
      >
        <Box display="flex" alignItems="center" gap={{ mobile: "2", tablet: "3" }} style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
          <Badge variant={badgeVariant}>{categoryInfo.label}</Badge>
          <Box
            fontSize={{ mobile: "sm", tablet: "base" }}
            fontWeight="bold"
            color="text"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {categoryInfo.label}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={{ mobile: "1.5", tablet: "3" }} style={{ flexShrink: 0 }}>
          <Box
            fontSize={{ mobile: "sm", tablet: "base" }}
            fontWeight="bold"
            color="text"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatWon(total)}
          </Box>
          <Box
            as="span"
            fontSize="xs"
            color="textMuted"
            style={{
              transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s ease",
              display: "inline-block",
            }}
          >
            ▼
          </Box>
        </Box>
      </Box>

      {/* Panel Body */}
      {isOpen && (
        <Box p={{ mobile: "3", tablet: "5" }} display="flex" flexDirection="column" gap="4">
          {/* 1. Category Subcategories Summary Part (소분류 요약 파트) */}
          <Box
            bg="surfaceSubtle"
            p={{ mobile: "3", tablet: "4" }}
            rounded="xl"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="border"
            display="flex"
            flexDirection="column"
            gap="3"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="1">
              <Box fontSize="xs" fontWeight="bold" color="textMuted">
                {categoryInfo.label} 요약
              </Box>
              <Box fontSize="xs" color="textSubtle">
                총 {formatWon(total)} ({Object.values(subGroups).flat().length}건)
              </Box>
            </Box>

            {/* Subcategory Summary Mini Cards */}
            <Box
              display="grid"
              gap="2"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              }}
            >
              {displayedSubs.map(([subKey, subLabel], idx) => {
                const items = subGroups[subKey] || [];
                const subTotal = items.reduce((acc, cur) => acc + cur.amount, 0);
                const percent =
                  total > 0 ? ((subTotal / total) * 100).toFixed(1) : "0.0";
                const accentColor = SUBCATEGORY_COLOR_PALETTE[idx % SUBCATEGORY_COLOR_PALETTE.length];

                return (
                  <Box
                    key={subKey}
                    bg="surface"
                    p="3"
                    rounded="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="border"
                    display="flex"
                    flexDirection="column"
                    gap="1"
                    style={{ borderLeft: `3px solid ${accentColor}` }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box fontSize="xs" fontWeight="semibold" color="textMuted">
                        {subLabel}
                      </Box>
                      <Box
                        fontSize="xs"
                        fontWeight="bold"
                        style={{ color: accentColor }}
                      >
                        {percent}%
                      </Box>
                    </Box>
                    <Box
                      fontSize="base"
                      fontWeight="bold"
                      color="text"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatWon(subTotal)}
                    </Box>
                    <Box fontSize="xs" color="textSubtle">
                      {items.length}건
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Distribution Progress Bar */}
            {total > 0 && (
              <Box
                display="flex"
                width="100%"
                rounded="full"
                overflow="hidden"
                bg="border"
                style={{ height: "6px", marginTop: "2px" }}
              >
                {displayedSubs.map(([subKey], idx) => {
                  const items = subGroups[subKey] || [];
                  const subTotal = items.reduce((acc, cur) => acc + cur.amount, 0);
                  const ratio = total > 0 ? (subTotal / total) * 100 : 0;
                  const accentColor = SUBCATEGORY_COLOR_PALETTE[idx % SUBCATEGORY_COLOR_PALETTE.length];

                  if (ratio <= 0) return null;
                  return (
                    <Box
                      key={subKey}
                      style={{
                        width: `${ratio}%`,
                        backgroundColor: accentColor,
                        transition: "width 0.3s ease",
                      }}
                    />
                  );
                })}
              </Box>
            )}
          </Box>

          {/* 2. Subcategories Detail List (상세 내역 리스트) */}
          <Box display="flex" flexDirection="column" gap="4">
            {displayedSubs.map(([subKey, subLabel]) => {
              const items = (subGroups[subKey] || [])
                .slice()
                .sort((a, b) => (a.date < b.date ? 1 : -1));
              const subTotal = items.reduce((acc, cur) => acc + cur.amount, 0);

              return (
                <Box key={subKey} display="flex" flexDirection="column" gap="2">
                  {/* Subcategory Header */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    pb="1.5"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="border"
                    style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <Box fontSize="sm" fontWeight="semibold" color="text">
                      {subLabel}
                    </Box>
                    <Box
                      fontSize="sm"
                      fontWeight="semibold"
                      color="textMuted"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatWon(subTotal)}
                    </Box>
                  </Box>

                  {/* Items List */}
                  {items.length === 0 ? (
                    <Box
                      fontSize="xs"
                      color="textSubtle"
                      py="2"
                      style={{ fontStyle: "italic" }}
                    >
                      등록된 내역이 없습니다
                    </Box>
                  ) : (
                    <Box
                      as="ul"
                      display="flex"
                      flexDirection="column"
                      style={{ listStyle: "none", margin: 0, padding: 0 }}
                    >
                      {items.map((item) => (
                        <Box
                          as="li"
                          key={item.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          py="2"
                          borderWidth="1px"
                          borderStyle="dashed"
                          borderColor="border"
                          style={{
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
                            <Box
                              fontSize="xs"
                              color="textMuted"
                              style={{
                                minWidth: "76px",
                                whiteSpace: "nowrap",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {item.date}
                            </Box>
                            <Box
                              fontSize="sm"
                              color="text"
                              fontWeight="medium"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.item}
                            </Box>
                          </Box>
                          <Box
                            fontSize="sm"
                            fontWeight="semibold"
                            color="text"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {formatWon(item.amount)}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
