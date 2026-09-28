"use client";

import { Box, Select } from "@/components/ui";
import { APP_LOGO_TEXT, APP_DISPLAY_NAME, APP_SUBTITLE } from "@/config/app.config";

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
      flexDirection={{ mobile: "column", tablet: "row" }}
      justifyContent="space-between"
      alignItems={{ mobile: "flex-start", tablet: "center" }}
      gap="3"
      width="100%"
      pb="4"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
    >
      <Box display="flex" alignItems="center" gap="3" width="100%">
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
          style={{ width: "42px", height: "42px", minWidth: "42px", letterSpacing: "-0.5px" }}
        >
          {APP_LOGO_TEXT}
        </Box>
        <Box display="flex" flexDirection="column" style={{ minWidth: 0, flex: 1 }}>
          <Box fontSize={{ mobile: "xl", tablet: "2xl" }} fontWeight="bold" color="text">
            {APP_DISPLAY_NAME}
          </Box>
          <Box fontSize="xs" color="textMuted" style={{ wordBreak: "keep-all" }}>
            {APP_SUBTITLE}
          </Box>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap="2" width={{ mobile: "100%", tablet: "fit-content" }} justifyContent={{ mobile: "flex-end", tablet: "flex-start" }}>
        <Box as="span" fontSize="sm" color="textMuted" fontWeight="medium" style={{ whiteSpace: "nowrap" }}>
          월별 보기:
        </Box>
        <Box width={{ mobile: "100%", tablet: "fit-content" }} style={{ maxWidth: "160px" }}>
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
