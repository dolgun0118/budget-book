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
      gap="4"
      width="100%"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
    >
      {/* 1. 총 수입 */}
      <Box
        bg="surface"
        p="5"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid #248A54" }}
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          총 수입
        </Box>
        <Box fontSize="2xl" fontWeight="bold" color="text" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatWon(totals.income)}
        </Box>
      </Box>

      {/* 2. 총 지출 */}
      <Box
        bg="surface"
        p="5"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid #DC2626" }}
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          총 지출 (공동 + 개인)
        </Box>
        <Box fontSize="2xl" fontWeight="bold" color="text" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatWon(totals.totalExpense)}
        </Box>
      </Box>

      {/* 3. 총 저축 */}
      <Box
        bg="surface"
        p="5"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid #3898EC" }}
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          총 저축 · 투자
        </Box>
        <Box fontSize="2xl" fontWeight="bold" color="text" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatWon(totals.savings)}
        </Box>
      </Box>

      {/* 4. 순잔액 */}
      <Box
        bg="surface"
        p="5"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ borderTop: "4px solid #D97706" }}
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Box fontSize="xs" fontWeight="semibold" color="textMuted">
          순잔액 (수입 - 지출 - 저축)
        </Box>
        <Box
          fontSize="2xl"
          fontWeight="bold"
          style={{
            color: totals.balance >= 0 ? "#1E293B" : "#DC2626",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatWon(totals.balance)}
        </Box>
      </Box>
    </Box>
  );
}
