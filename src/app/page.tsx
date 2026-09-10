"use client";

import { Box } from "@/components/ui";
import {
  LedgerHeader,
  LedgerSummary,
  LedgerPanel,
  LedgerEntryForm,
  LedgerTable,
} from "@/components/ledger";
import { useLedger } from "@/hooks/useLedger";

export default function Home() {
  const {
    filteredEntries,
    currentMonth,
    setCurrentMonth,
    availableMonths,
    totals,
    groupedBySub,
    addEntry,
    deleteEntry,
    isLoaded,
  } = useLedger();

  if (!isLoaded) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="background"
        color="textMuted"
        fontSize="sm"
      >
        가계부 데이터를 불러오는 중...
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      bg="background"
      color="text"
      p={{ mobile: "4", tablet: "8" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        width="100%"
        maxWidth="960px"
        display="flex"
        flexDirection="column"
        gap="6"
        my={{ mobile: "2", tablet: "6" }}
      >
        {/* 1. 상단 헤더 & 월별 필터 */}
        <LedgerHeader
          currentMonth={currentMonth}
          availableMonths={availableMonths}
          onMonthChange={setCurrentMonth}
        />

        {/* 2. 상단 요약 카드 4종 (수입, 지출, 저축, 순잔액) */}
        <LedgerSummary totals={totals} />

        {/* 3. 대분류별 상세 내역 아코디언 패널 */}
        <Box display="flex" flexDirection="column" gap="4" width="100%">
          <LedgerPanel
            major="income"
            total={totals.income}
            subGroups={groupedBySub.income}
            defaultOpen={true}
          />
          <LedgerPanel
            major="common"
            total={totals.common}
            subGroups={groupedBySub.common}
            defaultOpen={true}
          />
          <LedgerPanel
            major="personal"
            total={totals.personal}
            subGroups={groupedBySub.personal}
            defaultOpen={true}
          />
          <LedgerPanel
            major="savings"
            total={totals.savings}
            subGroups={groupedBySub.savings}
            defaultOpen={true}
          />
        </Box>

        {/* 4. 내역 추가 양식 */}
        <LedgerEntryForm onAddEntry={addEntry} />

        {/* 5. 원본 데이터 테이블 & 삭제 관리 */}
        <LedgerTable
          entries={filteredEntries}
          onDeleteEntry={deleteEntry}
        />
      </Box>
    </Box>
  );
}
