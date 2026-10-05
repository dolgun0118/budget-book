"use client";

import { useState } from "react";
import { Box, Badge, Button, Input, Select } from "@/components/ui";
import { Entry, CATEGORY_MAP, CategoryMap, MajorCategory } from "@/types/ledger";
import { TABLE_MIN_WIDTH } from "@/config/ui.config";

interface LedgerTableProps {
  entries: Entry[];
  categoryMap?: CategoryMap;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (entry: Entry) => void;
}

interface EditingState {
  id: string;
  date: string;
  major: MajorCategory;
  sub: string;
  item: string;
  amount: string;
}

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

export function LedgerTable({
  entries,
  categoryMap,
  onDeleteEntry,
  onUpdateEntry,
}: LedgerTableProps) {
  const map = categoryMap || CATEGORY_MAP;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sortedEntries = entries
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  // 수정 시작
  const handleEditStart = (e: Entry) => {
    setEditingId(e.id);
    setEditingState({
      id: e.id,
      date: e.date,
      major: e.major,
      sub: e.sub,
      item: e.item,
      amount: String(e.amount),
    });
    setErrorMsg(null);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
    setEditingState(null);
    setErrorMsg(null);
  };

  // 편집 필드 변경
  const handleFieldChange = (field: keyof EditingState, value: string) => {
    if (!editingState) return;
    setErrorMsg(null);

    if (field === "major") {
      const newMajor = value as MajorCategory;
      const firstSub = Object.keys(map[newMajor]?.subs || {})[0] || "";
      setEditingState({ ...editingState, major: newMajor, sub: firstSub });
    } else {
      setEditingState({ ...editingState, [field]: value });
    }
  };

  // 수정 저장
  const handleEditSave = () => {
    if (!editingState) return;

    const amount = parseFloat(editingState.amount);
    if (!editingState.date) {
      setErrorMsg("날짜를 입력해주세요.");
      return;
    }
    if (!editingState.item.trim()) {
      setErrorMsg("항목명을 입력해주세요.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("금액은 0원 초과로 입력해주세요.");
      return;
    }

    onUpdateEntry({
      id: editingState.id,
      date: editingState.date,
      major: editingState.major,
      sub: editingState.sub,
      item: editingState.item.trim(),
      amount,
    });

    setEditingId(null);
    setEditingState(null);
    setErrorMsg(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap="3" width="100%">
      <Box fontSize="base" fontWeight="bold" color="text">
        전체 내역 목록 ({entries.length}건)
      </Box>

      {/* 수정 중 에러 메시지 */}
      {errorMsg && (
        <Box
          p="3"
          rounded="lg"
          bg="surfaceSubtle"
          fontSize="xs"
          color="destructive"
          style={{ border: "1px solid var(--color-destructive)" }}
        >
          ⚠️ {errorMsg}
        </Box>
      )}

      <Box
        bg="surface"
        rounded="2xl"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border"
        style={{ overflowX: "auto", maxHeight: "calc(100vh - 400px)" }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            minWidth: TABLE_MIN_WIDTH,
            textAlign: "left",
            overflowX: "auto",
            height: "100%",
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
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "145px", minWidth: "140px", whiteSpace: "nowrap" }}>날짜</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "130px", minWidth: "120px" }}>대분류</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, width: "120px", minWidth: "110px" }}>소분류</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>항목명</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right", width: "150px", minWidth: "130px" }}>
                금액
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", width: "120px", minWidth: "110px" }}>
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
                const isEditing = editingId === e.id;
                const cat = map[isEditing ? (editingState?.major ?? e.major) : e.major];
                const badgeVariant =
                  cat?.type === "income"
                    ? "income"
                    : cat?.type === "save"
                    ? "save"
                    : "expense";

                if (isEditing && editingState) {
                  // ── 편집 행 ──────────────────────────────────────────────
                  const editingCat = map[editingState.major];
                  return (
                    <tr
                      key={e.id}
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface-subtle, rgba(var(--color-primary-rgb, 59,130,246),0.04))",
                      }}
                    >
                      {/* 날짜 */}
                      <td style={{ padding: "8px 10px", minWidth: "140px" }}>
                        <Input
                          type="date"
                          value={editingState.date}
                          onChange={(ev) => handleFieldChange("date", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px", minWidth: "130px" }}
                        />
                      </td>

                      {/* 대분류 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Select
                          value={editingState.major}
                          onChange={(ev) => handleFieldChange("major", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px" }}
                        >
                          {(Object.keys(map) as MajorCategory[]).map((key) => (
                            <option key={key} value={key}>
                              {map[key].label}
                            </option>
                          ))}
                        </Select>
                      </td>

                      {/* 소분류 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Select
                          value={editingState.sub}
                          onChange={(ev) => handleFieldChange("sub", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px" }}
                        >
                          {Object.entries(editingCat?.subs || {}).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </td>

                      {/* 항목명 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Input
                          type="text"
                          value={editingState.item}
                          onChange={(ev) => handleFieldChange("item", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px" }}
                          placeholder="항목명"
                        />
                      </td>

                      {/* 금액 */}
                      <td style={{ padding: "8px 10px" }}>
                        <Input
                          type="number"
                          value={editingState.amount}
                          onChange={(ev) => handleFieldChange("amount", ev.target.value)}
                          style={{ height: "34px", fontSize: "13px", textAlign: "right" }}
                          min="0"
                          step="1"
                          placeholder="0"
                        />
                      </td>

                      {/* 관리 버튼 */}
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <Box display="flex" gap="1" justifyContent="center">
                          <Button
                            variant="default"
                            size="sm"
                            style={{
                              height: "28px",
                              padding: "0 8px",
                              fontSize: "12px",
                            }}
                            onClick={handleEditSave}
                          >
                            저장
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              height: "28px",
                              padding: "0 8px",
                              fontSize: "12px",
                            }}
                            onClick={handleEditCancel}
                          >
                            취소
                          </Button>
                        </Box>
                      </td>
                    </tr>
                  );
                }

                // ── 일반 행 ──────────────────────────────────────────────────
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
                      <Box display="flex" gap="1" justifyContent="center">
                        <Button
                          variant="outline"
                          size="sm"
                          style={{
                            height: "28px",
                            padding: "0 8px",
                            fontSize: "12px",
                            borderColor: "var(--color-primary)",
                            color: "var(--color-primary)",
                          }}
                          onClick={() => handleEditStart(e)}
                        >
                          수정
                        </Button>
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
                      </Box>
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
