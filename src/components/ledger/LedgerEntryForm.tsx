"use client";

import { useState } from "react";
import { Box, Button, Input, Select, Badge } from "@/components/ui";
import { MajorCategory, CATEGORY_MAP, Entry, CategoryMap } from "@/types/ledger";
import { FORM_DEFAULT_ADD_ROW_COUNT, TABLE_MIN_WIDTH } from "@/config/ui.config";

interface FormRow {
  id: string;
  date: string;
  major: MajorCategory;
  sub: string;
  item: string;
  amount: string;
}

interface LedgerEntryFormProps {
  categoryMap?: CategoryMap;
  onAddEntries: (entries: Array<Omit<Entry, "id">>) => void;
}

function createDefaultRow(date?: string, map?: CategoryMap): FormRow {
  const currentMap = map || CATEGORY_MAP;
  const firstMajor = (Object.keys(currentMap)[0] as MajorCategory) || "income";
  const firstSub = Object.keys(currentMap[firstMajor]?.subs || {})[0] || "donggun";

  return {
    id:
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7) +
      Math.random().toString(36).slice(2, 6),
    date: date || new Date().toISOString().slice(0, 10),
    major: firstMajor,
    sub: firstSub,
    item: "",
    amount: "",
  };
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerEntryForm({
  categoryMap,
  onAddEntries,
}: LedgerEntryFormProps) {
  const map = categoryMap || CATEGORY_MAP;
  const [rows, setRows] = useState<FormRow[]>([createDefaultRow(undefined, map)]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 행 추가 (한 번에 N개 행 추가)
  const handleAddRows = (count: number = FORM_DEFAULT_ADD_ROW_COUNT) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const lastRowDate = rows.length > 0 ? rows[rows.length - 1].date : undefined;
    const newRows = Array.from({ length: count }, () =>
      createDefaultRow(lastRowDate, map)
    );
    setRows((prev) => [...prev, ...newRows]);
  };

  // 행 삭제
  const handleDeleteRow = (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setRows((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.length > 0 ? filtered : [createDefaultRow(undefined, map)];
    });
  };

  // 행 값 변경
  const handleRowChange = (
    id: string,
    field: keyof FormRow,
    value: string
  ) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        if (field === "major") {
          const newMajor = value as MajorCategory;
          const firstSub = Object.keys(map[newMajor]?.subs || {})[0] || "";
          return {
            ...row,
            major: newMajor,
            sub: firstSub,
          };
        }

        return {
          ...row,
          [field]: value,
        };
      })
    );
  };

  // 전체 초기화
  const handleReset = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setRows([createDefaultRow(undefined, map)]);
  };

  // 전체 저장
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 비어있지 않은 행 식별
    const nonEmptyRows = rows.filter(
      (r) => r.item.trim() !== "" || r.amount.trim() !== ""
    );

    if (nonEmptyRows.length === 0) {
      setErrorMessage("저장할 내역을 1건 이상 입력해주세요.");
      return;
    }

    // 각 행 유효성 검사
    const invalidRows: number[] = [];
    const validEntries: Array<Omit<Entry, "id">> = [];

    nonEmptyRows.forEach((r, idx) => {
      const numAmount = parseFloat(r.amount);
      if (
        !r.date ||
        !r.item.trim() ||
        isNaN(numAmount) ||
        numAmount <= 0
      ) {
        invalidRows.push(idx + 1);
      } else {
        validEntries.push({
          date: r.date,
          major: r.major,
          sub: r.sub,
          item: r.item.trim(),
          amount: numAmount,
        });
      }
    });

    if (invalidRows.length > 0) {
      setErrorMessage(
        `${invalidRows.join(", ")}번째 행의 항목명 또는 금액(0원 초과)을 정확히 입력해주세요.`
      );
      return;
    }

    // 일괄 저장 실행
    onAddEntries(validEntries);
    setSuccessMessage(`총 ${validEntries.length}건의 내역이 성공적으로 저장되었습니다.`);
    setRows([createDefaultRow()]);
  };

  // 현재 입력 중인 유효 항목 미리보기 계산
  const validCount = rows.filter(
    (r) => r.item.trim() !== "" && parseFloat(r.amount) > 0
  ).length;

  const validTotal = rows.reduce((acc, r) => {
    const num = parseFloat(r.amount);
    return acc + (!isNaN(num) && num > 0 ? num : 0);
  }, 0);

  return (
    <Box
      as="form"
      onSubmit={handleSaveAll}
      bg="surface"
      p={{ mobile: "3", tablet: "5" }}
      rounded="2xl"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      style={{ borderLeft: "4px solid var(--color-primary)" }}
      display="flex"
      flexDirection="column"
      gap="4"
      width="100%"
    >
      {/* 폼 상단 헤더 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="2"
      >
        <Box display="flex" alignItems="center" gap="2">
          <Box fontSize="base" fontWeight="bold" color="text">
            내역 추가 (다중 행 입력)
          </Box>
          <Badge variant="income">{rows.length}개 행</Badge>
        </Box>

        <Box display="flex" alignItems="center" gap="2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            초기화
          </Button>
        </Box>
      </Box>

      {/* 알림 메시지 */}
      {errorMessage && (
        <Box
          p="3"
          rounded="lg"
          bg="surfaceSubtle"
          fontSize="xs"
          color="destructive"
          style={{ border: "1px solid var(--color-destructive)" }}
        >
          ⚠️ {errorMessage}
        </Box>
      )}

      {successMessage && (
        <Box
          p="3"
          rounded="lg"
          bg="surfaceSubtle"
          fontSize="xs"
          style={{ color: "var(--color-success)", border: "1px solid var(--color-success)" }}
        >
          ✓ {successMessage}
        </Box>
      )}

      {/* 다중 행 입력 테이블/그리드 */}
      <Box
        overflow="hidden"
        rounded="xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ overflowX: "auto" }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            minWidth: TABLE_MIN_WIDTH,
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-text)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <th style={{ padding: "10px 12px", fontWeight: 600, width: "145px", minWidth: "140px", whiteSpace: "nowrap" }}>
                날짜
              </th>
              <th style={{ padding: "10px 12px", fontWeight: 600, width: "130px", minWidth: "120px" }}>
                대분류
              </th>
              <th style={{ padding: "10px 12px", fontWeight: 600, width: "120px", minWidth: "110px" }}>
                소분류
              </th>
              <th style={{ padding: "10px 12px", fontWeight: 600, minWidth: "150px" }}>
                항목명
              </th>
              <th style={{ padding: "10px 12px", fontWeight: 600, width: "150px", minWidth: "130px" }}>
                금액 (원)
              </th>
              <th style={{ padding: "10px 12px", textAlign: "center", width: "60px", minWidth: "50px" }}>
                삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  borderBottom:
                    index < rows.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                {/* 1. 날짜 */}
                <td style={{ padding: "8px 10px", width: "145px", minWidth: "140px", whiteSpace: "nowrap" }}>
                  <Input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      handleRowChange(row.id, "date", e.target.value)
                    }
                    style={{ height: "36px", fontSize: "13px", minWidth: "130px" }}
                  />
                </td>

                {/* 2. 대분류 */}
                <td style={{ padding: "8px 10px" }}>
                  <Select
                    value={row.major}
                    onChange={(e) =>
                      handleRowChange(row.id, "major", e.target.value)
                    }
                    style={{ height: "36px", fontSize: "13px" }}
                  >
                    {(Object.keys(map) as MajorCategory[]).map(
                      (key) => (
                        <option key={key} value={key}>
                          {map[key].label}
                        </option>
                      )
                    )}
                  </Select>
                </td>

                {/* 3. 소분류 */}
                <td style={{ padding: "8px 10px" }}>
                  <Select
                    value={row.sub}
                    onChange={(e) =>
                      handleRowChange(row.id, "sub", e.target.value)
                    }
                    style={{ height: "36px", fontSize: "13px" }}
                  >
                    {Object.entries(
                      map[row.major]?.subs || {}
                    ).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </td>

                {/* 4. 항목명 */}
                <td style={{ padding: "8px 10px" }}>
                  <Input
                    type="text"
                    placeholder="예: 관리비, 장보기"
                    value={row.item}
                    onChange={(e) =>
                      handleRowChange(row.id, "item", e.target.value)
                    }
                    style={{ height: "36px", fontSize: "13px" }}
                  />
                </td>

                {/* 5. 금액 */}
                <td style={{ padding: "8px 10px" }}>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="1"
                    value={row.amount}
                    onChange={(e) =>
                      handleRowChange(row.id, "amount", e.target.value)
                    }
                    style={{ height: "36px", fontSize: "13px" }}
                  />
                </td>

                {/* 6. 삭제 버튼 */}
                <td style={{ padding: "8px 10px", textAlign: "center" }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRow(row.id)}
                    style={{
                      padding: "0",
                      width: "28px",
                      height: "28px",
                      color: "var(--color-text-muted)",
                      borderRadius: "6px",
                    }}
                    title="행 삭제"
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* 폼 하단 액션 & 저장 바 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="3"
        pt="2"
      >
        <Box display="flex" alignItems="center" gap="3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddRows(FORM_DEFAULT_ADD_ROW_COUNT)}
          >
            + 행 추가
          </Button>
          <Box fontSize="xs" color="textMuted">
            입력 예정: <strong style={{ color: "var(--color-text)" }}>{validCount}건</strong>
            {validCount > 0 && ` (${formatWon(validTotal)})`}
          </Box>
        </Box>

        <Button
          type="submit"
          variant="default"
          size="default"
          style={{ minWidth: "120px" }}
        >
          저장하기
        </Button>
      </Box>
    </Box>
  );
}
