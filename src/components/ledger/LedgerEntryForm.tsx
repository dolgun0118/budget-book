"use client";

import { useState } from "react";
import { Box, Button, Input, Select } from "@/components/ui";
import { MajorCategory, CATEGORY_MAP, Entry } from "@/types/ledger";

interface LedgerEntryFormProps {
  onAddEntry: (entry: Omit<Entry, "id">) => void;
}

export function LedgerEntryForm({ onAddEntry }: LedgerEntryFormProps) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [major, setMajor] = useState<MajorCategory>("income");
  const [sub, setSub] = useState<string>("mine");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  const handleMajorChange = (newMajor: MajorCategory) => {
    setMajor(newMajor);
    const firstSub = Object.keys(CATEGORY_MAP[newMajor].subs)[0] || "";
    setSub(firstSub);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!date || !item.trim() || isNaN(numAmount) || numAmount < 0) {
      return;
    }

    onAddEntry({
      date,
      major,
      sub,
      item: item.trim(),
      amount: numAmount,
    });

    setItem("");
    setAmount("");
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="surface"
      p="5"
      rounded="2xl"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      style={{ borderLeft: "4px solid #3898EC" }}
      display="flex"
      flexDirection="column"
      gap="4"
      width="100%"
    >
      <Box fontSize="base" fontWeight="bold" color="text">
        내역 추가
      </Box>

      <Box
        display="grid"
        gap="3"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          alignItems: "end",
        }}
      >
        {/* 1. 날짜 */}
        <Box display="flex" flexDirection="column" gap="1">
          <Box as="label" fontSize="xs" fontWeight="semibold" color="textMuted">
            날짜
          </Box>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Box>

        {/* 2. 대분류 */}
        <Box display="flex" flexDirection="column" gap="1">
          <Box as="label" fontSize="xs" fontWeight="semibold" color="textMuted">
            대분류
          </Box>
          <Select
            value={major}
            onChange={(e) => handleMajorChange(e.target.value as MajorCategory)}
            required
          >
            {(Object.keys(CATEGORY_MAP) as MajorCategory[]).map((key) => (
              <option key={key} value={key}>
                {CATEGORY_MAP[key].label}
              </option>
            ))}
          </Select>
        </Box>

        {/* 3. 소분류 */}
        <Box display="flex" flexDirection="column" gap="1">
          <Box as="label" fontSize="xs" fontWeight="semibold" color="textMuted">
            소분류
          </Box>
          <Select
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            required
          >
            {Object.entries(CATEGORY_MAP[major].subs).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Box>

        {/* 4. 항목명 */}
        <Box display="flex" flexDirection="column" gap="1" style={{ gridColumn: "span 2" }}>
          <Box as="label" fontSize="xs" fontWeight="semibold" color="textMuted">
            항목명
          </Box>
          <Input
            type="text"
            placeholder="예: 관리비, 장보기, 커피"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </Box>

        {/* 5. 금액 */}
        <Box display="flex" flexDirection="column" gap="1">
          <Box as="label" fontSize="xs" fontWeight="semibold" color="textMuted">
            금액 (원)
          </Box>
          <Input
            type="number"
            placeholder="0"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Box>

        {/* 6. 제출 버튼 */}
        <Button type="submit" variant="default" style={{ height: "2.5rem" }}>
          + 추가
        </Button>
      </Box>
    </Box>
  );
}
