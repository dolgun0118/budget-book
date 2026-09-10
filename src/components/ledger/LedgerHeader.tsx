"use client";

import { Box, Select } from "@/components/ui";

interface LedgerHeaderProps {
  currentMonth: string;
  availableMonths: string[];
  onMonthChange: (month: string) => void;
}

export function LedgerHeader({
  currentMonth,
  availableMonths,
  onMonthChange,
}: LedgerHeaderProps) {
  return (
    <Box
      as="header"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      pb="4"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
    >
      <Box display="flex" alignItems="center" gap="3">
        <Box
          bg="primary"
          color="primaryForeground"
          width="fit-content"
          p="2.5"
          rounded="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          fontSize="lg"
          style={{ width: "42px", height: "42px", letterSpacing: "-0.5px" }}
        >
          BB
        </Box>
        <Box display="flex" flexDirection="column">
          <Box fontSize="2xl" fontWeight="bold" color="text">
            우리집 가계부
          </Box>
          <Box fontSize="xs" color="textMuted">
            부부가 함께 투명하게 기록하고 관리하는 공동 자산 장부
          </Box>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap="2">
        <Box as="span" fontSize="sm" color="textMuted" fontWeight="medium">
          월별 보기:
        </Box>
        <Box width="fit-content">
          <Select
            size="sm"
            value={currentMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            <option value="all">전체 내역</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
