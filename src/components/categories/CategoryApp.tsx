"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button } from "@/components/ui";
import { useCategories } from "@/hooks/useCategories";
import { MajorRow, SubRow } from "@/services/categoryService";
import { CategoryType } from "@/types/ledger";
import { MajorRowItem, AddMajorForm, SubRowItem, AddSubForm } from "./CategoryItems";
import { APP_LOGO_TEXT, APP_DISPLAY_NAME } from "@/config/app.config";
import { LAYOUT_MAX_WIDTH } from "@/config/ui.config";

interface CategoryAppProps {
  initialMajors: MajorRow[];
  initialSubs: SubRow[];
}

export function CategoryApp({ initialMajors, initialSubs }: CategoryAppProps) {
  const {
    majors,
    isLoading,
    error,
    clearError,
    addMajor,
    editMajor,
    removeMajor,
    addSub,
    editSub,
    removeSub,
    getSubsForMajor,
  } = useCategories({ initialMajors, initialSubs });

  // 선택된 대분류 (소분류 패널 표시용)
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(
    initialMajors[0]?.id ?? null
  );

  const selectedMajor = majors.find((m) => m.id === selectedMajorId) ?? null;
  const selectedSubs = selectedMajorId ? getSubsForMajor(selectedMajorId) : [];

  // 대분류 핸들러
  const handleAddMajor = async (id: string, label: string, type: CategoryType) => {
    const ok = await addMajor({ id, label, type });
    if (ok && !selectedMajorId) setSelectedMajorId(id);
    return ok;
  };

  const handleEditMajor = async (id: string, label: string, type: CategoryType) =>
    editMajor(id, { label, type });

  const handleDeleteMajor = async (id: string) => {
    const ok = await removeMajor(id);
    if (ok && selectedMajorId === id) {
      setSelectedMajorId(majors.find((m) => m.id !== id)?.id ?? null);
    }
    return ok;
  };

  // 소분류 핸들러
  const handleAddSub = async (majorId: string, value: string, label: string) =>
    addSub({ major_id: majorId, value, label });

  const handleEditSub = async (id: string, value: string, label: string) =>
    editSub(id, { value, label });

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
        {/* ── 헤더 ────────────────────────────────────────────────────── */}
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
          <Box display="flex" alignItems="center" gap="3">
            <Box
              bg="primary"
              color="primaryForeground"
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
            <Box display="flex" flexDirection="column">
              <Box fontSize={{ mobile: "xl", tablet: "2xl" }} fontWeight="bold" color="text">
                {APP_DISPLAY_NAME}
              </Box>
              <Box fontSize="xs" color="textMuted">
                카테고리 관리
              </Box>
            </Box>
          </Box>
          <Link href="/">
            <Button type="button" variant="outline" size="sm">
              ← 가계부로 돌아가기
            </Button>
          </Link>
        </Box>

        {/* ── 에러 배너 ────────────────────────────────────────────────── */}
        {error && (
          <Box
            p="3"
            rounded="lg"
            bg="surfaceSubtle"
            fontSize="sm"
            color="destructive"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ border: "1px solid var(--color-destructive)" }}
          >
            <span>⚠️ {error}</span>
            <Button type="button" variant="ghost" size="sm" onClick={clearError}>
              ✕
            </Button>
          </Box>
        )}

        {/* ── 로딩 인디케이터 ─────────────────────────────────────────── */}
        {isLoading && (
          <Box fontSize="xs" color="textMuted" style={{ textAlign: "right" }}>
            저장 중…
          </Box>
        )}

        {/* ── 2단 레이아웃 ─────────────────────────────────────────────── */}
        <Box
          display="flex"
          gap="5"
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {/* ── 왼쪽: 대분류 목록 ─────────────────────────────────────── */}
          <Box
            bg="surface"
            p={{ mobile: "3", tablet: "5" }}
            rounded="2xl"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="border"
            style={{
              borderLeft: "4px solid var(--color-primary)",
              flex: "0 0 340px",
              minWidth: "260px",
            }}
            display="flex"
            flexDirection="column"
            gap="3"
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontSize="base" fontWeight="bold" color="text">
                대분류
              </Box>
              <Box fontSize="xs" color="textMuted">
                {majors.length}개
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="2">
              {majors.map((major) => (
                <MajorRowItem
                  key={major.id}
                  major={major}
                  subCount={getSubsForMajor(major.id).length}
                  isSelected={selectedMajorId === major.id}
                  onSelect={() => setSelectedMajorId(major.id)}
                  onEdit={handleEditMajor}
                  onDelete={handleDeleteMajor}
                />
              ))}
            </Box>

            <AddMajorForm onAdd={handleAddMajor} />
          </Box>

          {/* ── 오른쪽: 소분류 목록 ───────────────────────────────────── */}
          <Box
            bg="surface"
            p={{ mobile: "3", tablet: "5" }}
            rounded="2xl"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="border"
            style={{
              borderLeft: "4px solid var(--color-secondary)",
              flex: 1,
              minWidth: 0,
            }}
            display="flex"
            flexDirection="column"
            gap="3"
          >
            {selectedMajor ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="2">
                  <Box display="flex" alignItems="center" gap="2">
                    <Box fontSize="base" fontWeight="bold" color="text">
                      소분류
                    </Box>
                    <Box fontSize="sm" color="textMuted">
                      — {selectedMajor.label}
                    </Box>
                  </Box>
                  <Box fontSize="xs" color="textMuted">
                    {selectedSubs.length}개
                  </Box>
                </Box>

                {selectedSubs.length === 0 ? (
                  <Box
                    p="6"
                    style={{ textAlign: "center" }}
                    fontSize="sm"
                    color="textMuted"
                  >
                    소분류가 없습니다. 아래에서 추가해보세요.
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap="2">
                    {selectedSubs.map((sub) => (
                      <SubRowItem
                        key={sub.id}
                        sub={sub}
                        onEdit={handleEditSub}
                        onDelete={removeSub}
                      />
                    ))}
                  </Box>
                )}

                <AddSubForm majorId={selectedMajor.id} onAdd={handleAddSub} />
              </>
            ) : (
              <Box
                p="8"
                style={{ textAlign: "center" }}
                fontSize="sm"
                color="textMuted"
              >
                왼쪽에서 대분류를 선택하면 소분류를 관리할 수 있습니다.
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
