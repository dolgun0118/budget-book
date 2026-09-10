"use client";

import { useState } from "react";
import { Box, Badge } from "@/components/ui";
import { MajorCategory, CATEGORY_MAP, Entry } from "@/types/ledger";

interface LedgerPanelProps {
  major: MajorCategory;
  total: number;
  subGroups: Record<string, Entry[]>;
  defaultOpen?: boolean;
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerPanel({
  major,
  total,
  subGroups,
  defaultOpen = true,
}: LedgerPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const categoryInfo = CATEGORY_MAP[major];

  const badgeVariant =
    categoryInfo.type === "income"
      ? "income"
      : categoryInfo.type === "save"
      ? "save"
      : "expense";

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
        p="4"
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
        <Box display="flex" alignItems="center" gap="3">
          <Badge variant={badgeVariant}>{categoryInfo.label}</Badge>
          <Box fontSize="base" fontWeight="bold" color="text">
            {categoryInfo.label}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap="3">
          <Box
            fontSize="base"
            fontWeight="bold"
            color="text"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatWon(total)}
          </Box>
          <Box
            as="span"
            fontSize="sm"
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
        <Box p="5" display="flex" flexDirection="column" gap="4">
          {Object.entries(categoryInfo.subs).map(([subKey, subLabel]) => {
            const items = (subGroups[subKey] || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
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
                  style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
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
                  <Box fontSize="xs" color="textSubtle" py="2" style={{ fontStyle: "italic" }}>
                    등록된 내역이 없습니다
                  </Box>
                ) : (
                  <Box as="ul" display="flex" flexDirection="column" style={{ listStyle: "none", margin: 0, padding: 0 }}>
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
                        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                      >
                        <Box display="flex" alignItems="center" gap="3">
                          <Box fontSize="xs" color="textMuted" width="fit-content">
                            {item.date}
                          </Box>
                          <Box fontSize="sm" color="text" fontWeight="medium">
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
      )}
    </Box>
  );
}
