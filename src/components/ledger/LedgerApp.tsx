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
import { LAYOUT_MAX_WIDTH } from "@/config/ui.config";
import { AppInitialConfig } from "@/types/config";
import { Entry } from "@/types/ledger";

interface LedgerAppProps {
  initialConfig: AppInitialConfig;
  initialEntries: Entry[];
}

export function LedgerApp({ initialConfig, initialEntries }: LedgerAppProps) {
  const {
    filteredEntries,
    categoryMap,
    currentMonth,
    setCurrentMonth,
    availableMonths,
    totals,
    groupedBySub,
    addEntries,
    deleteEntry,
    updateEntry,
  } = useLedger({ initialConfig, initialEntries });

  return (
    <Box
      minHeight="100vh"
      bg="background"
      color="text"
      p={{ mobile: "3", tablet: "8" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        width="100%"
        maxWidth={LAYOUT_MAX_WIDTH}
        display="flex"
        flexDirection="column"
        gap={{ mobile: "4", tablet: "6" }}
        my={{ mobile: "1.5", tablet: "6" }}
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
          {Object.keys(categoryMap).map((majorKey) => (
            <LedgerPanel
              key={majorKey}
              major={majorKey}
              total={
                majorKey === "income"
                  ? totals.income
                  : majorKey === "common"
                  ? totals.common
                  : majorKey === "personal"
                  ? totals.personal
                  : majorKey === "savings"
                  ? totals.savings
                  : (groupedBySub[majorKey]
                      ? Object.values(groupedBySub[majorKey])
                          .flat()
                          .reduce((acc, cur) => acc + cur.amount, 0)
                      : 0)
              }
              subGroups={groupedBySub[majorKey] || {}}
              categoryInfo={categoryMap[majorKey]}
              defaultOpen={true}
            />
          ))}
        </Box>

        {/* 4. 내역 추가 양식 (다중 행 일괄 저장) */}
        <LedgerEntryForm
          categoryMap={categoryMap}
          onAddEntries={addEntries}
        />

        {/* 5. 원본 데이터 테이블 & 삭제/수정 관리 */}
        <LedgerTable
          entries={filteredEntries}
          categoryMap={categoryMap}
          onDeleteEntry={deleteEntry}
          onUpdateEntry={updateEntry}
        />
      </Box>
    </Box>
  );
}
