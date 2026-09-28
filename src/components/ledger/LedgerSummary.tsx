"use client";

import { Box } from "@/components/ui";
import { LedgerTotals } from "@/types/ledger";

interface LedgerSummaryProps {
  totals: LedgerTotals;
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerSummary({ totals }: LedgerSummaryProps) {
  return (
    <Box
      display="grid"
      gap={{ mobile: "2.5", tablet: "4" }}
      width="100%"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
      }}
    >
      {/* 1. 총 수입 */}
      <Box
        bg="surface"
        p={{ mobile: "3", tablet: "5" }}
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid var(--color-success)" }}
        display="flex"
        flexDirection="column"
        gap="1.5"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          총 수입
        </Box>
        <Box
          fontSize={{ mobile: "lg", tablet: "2xl" }}
          fontWeight="bold"
          color="text"
          style={{ fontVariantNumeric: "tabular-nums", wordBreak: "break-all" }}
        >
          {formatWon(totals.income)}
        </Box>
      </Box>

      {/* 2. 총 지출 */}
      <Box
        bg="surface"
        p={{ mobile: "3", tablet: "5" }}
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid var(--color-danger)" }}
        display="flex"
        flexDirection="column"
        gap="1.5"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          총 지출 (공동+개인)
        </Box>
        <Box
          fontSize={{ mobile: "lg", tablet: "2xl" }}
          fontWeight="bold"
          color="text"
          style={{ fontVariantNumeric: "tabular-nums", wordBreak: "break-all" }}
        >
          {formatWon(totals.totalExpense)}
        </Box>
      </Box>

      {/* 3. 총 저축 */}
      <Box
        bg="surface"
        p={{ mobile: "3", tablet: "5" }}
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid var(--color-primary)" }}
        display="flex"
        flexDirection="column"
        gap="1.5"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          총 저축 · 투자
        </Box>
        <Box
          fontSize={{ mobile: "lg", tablet: "2xl" }}
          fontWeight="bold"
          color="text"
          style={{ fontVariantNumeric: "tabular-nums", wordBreak: "break-all" }}
        >
          {formatWon(totals.savings)}
        </Box>
      </Box>

      {/* 4. 순잔액 */}
      <Box
        bg="surface"
        p={{ mobile: "3", tablet: "5" }}
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid var(--color-warning)" }}
        display="flex"
        flexDirection="column"
        gap="1.5"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          순잔액
        </Box>
        <Box
          fontSize={{ mobile: "lg", tablet: "2xl" }}
          fontWeight="bold"
          style={{
            color: totals.balance >= 0 ? "var(--color-text)" : "var(--color-danger)",
            fontVariantNumeric: "tabular-nums",
            wordBreak: "break-all",
          }}
        >
          {formatWon(totals.balance)}
        </Box>
      </Box>
    </Box>
  );
}
