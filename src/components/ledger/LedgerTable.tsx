"use client";

import { Box, Badge, Button } from "@/components/ui";
import { Entry, CATEGORY_MAP, CategoryMap } from "@/types/ledger";
import { TABLE_MIN_WIDTH } from "@/config/ui.config";

interface LedgerTableProps {
  entries: Entry[];
  categoryMap?: CategoryMap;
  onDeleteEntry: (id: string) => void;
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerTable({
  entries,
  categoryMap,
  onDeleteEntry,
}: LedgerTableProps) {
  const map = categoryMap || CATEGORY_MAP;
  const sortedEntries = entries
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <Box display="flex" flexDirection="column" gap="3" width="100%">
      <Box fontSize="base" fontWeight="bold" color="text">
        전체 내역 목록 ({entries.length}건)
      </Box>

      <Box
        bg="surface"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        overflow="hidden"
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
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "115px", minWidth: "105px", whiteSpace: "nowrap" }}>날짜</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "110px", minWidth: "90px" }}>대분류</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "110px", minWidth: "90px" }}>소분류</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>항목명</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right", width: "120px", minWidth: "100px" }}>
                금액
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", width: "80px" }}>
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                  }}
                >
                  등록된 내역이 없습니다. 상단 양식에서 새로운 내역을 추가해 보세요.
                </td>
              </tr>
            ) : (
              sortedEntries.map((e) => {
                const cat = map[e.major];
                const badgeVariant =
                  cat?.type === "income"
                    ? "income"
                    : cat?.type === "save"
                    ? "save"
                    : "expense";

                return (
                  <tr
                    key={e.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--color-text-muted)",
                        minWidth: "105px",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {e.date}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge variant={badgeVariant}>{cat?.label || e.major}</Badge>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--color-text)" }}>
                      {cat?.subs[e.sub] || e.sub}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "var(--color-text)" }}>
                      {e.item}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        color:
                          cat?.type === "income"
                            ? "var(--color-success)"
                            : cat?.type === "save"
                            ? "var(--color-save)"
                            : "var(--color-text)",
                      }}
                    >
                      {formatWon(e.amount)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          height: "28px",
                          padding: "0 8px",
                          fontSize: "12px",
                          borderColor: "var(--color-border)",
                        }}
                        onClick={() => onDeleteEntry(e.id)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
