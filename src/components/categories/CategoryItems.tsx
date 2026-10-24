"use client";

import { useState } from "react";
import { Box, Button, Input, Select } from "@/components/ui";
import { vars } from "@/styles/theme.css";
import { CategoryType } from "@/types/ledger";
import { MajorRow, SubRow } from "@/services/categoryService";

// ─── 타입 레이블 뱃지 ─────────────────────────────────────────────────────────

const TYPE_LABELS: Record<CategoryType, { label: string; color: string; bg: string }> = {
  income: { label: "수입", color: vars.color.success, bg: vars.color.successSubtle },
  expense: { label: "지출", color: vars.color.destructive, bg: vars.color.destructiveSubtle },
  save: { label: "저축", color: vars.color.primary, bg: vars.color.primarySubtle },
};

function TypeBadge({ type }: { type: CategoryType }) {
  const t = TYPE_LABELS[type] ?? TYPE_LABELS.expense;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        color: t.color,
        backgroundColor: t.bg,
        whiteSpace: "nowrap",
      }}
    >
      {t.label}
    </span>
  );
}

// ─── 대분류 행 컴포넌트 ───────────────────────────────────────────────────────

interface MajorRowItemProps {
  major: MajorRow;
  subCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (id: string, label: string, type: CategoryType) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function MajorRowItem({ major, subCount, isSelected, onSelect, onEdit, onDelete }: MajorRowItemProps) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(major.label);
  const [editType, setEditType] = useState<CategoryType>(major.type);
  const [confirming, setConfirming] = useState(false);

  const handleSave = async () => {
    if (!editLabel.trim()) return;
    const ok = await onEdit(major.id, editLabel.trim(), editType);
    if (ok) setEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(major.label);
    setEditType(major.type);
    setEditing(false);
  };

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete(major.id);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  if (editing) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap="2"
        p="3"
        rounded="lg"
        bg="surfaceSubtle"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="primary"
        style={{ flexWrap: "wrap" }}
      >
        <Input
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          style={{ height: "34px", fontSize: "13px", flex: "1", minWidth: "120px" }}
          placeholder="대분류 이름"
          autoFocus
        />
        <Select
          value={editType}
          onChange={(e) => setEditType(e.target.value as CategoryType)}
          style={{ height: "34px", fontSize: "13px", width: "90px" }}
        >
          <option value="income">수입</option>
          <option value="expense">지출</option>
          <option value="save">저축</option>
        </Select>
        <Box display="flex" gap="1">
          <Button type="button" variant="default" size="sm" onClick={handleSave}>
            저장
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      p="3"
      rounded="lg"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isSelected ? "primary" : "border"}
      bg={isSelected ? "primarySubtle" : "surface"}
      cursor="pointer"
      style={{
        transition: "all 0.15s ease",
      }}
      onClick={onSelect}
    >
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Box display="flex" alignItems="center" gap="2" style={{ flexWrap: "wrap" }}>
          <Box fontSize="sm" fontWeight="bold" color="text">
            {major.label}
          </Box>
          <TypeBadge type={major.type} />
          <Box fontSize="xs" color="textMuted">
            ({major.id})
          </Box>
        </Box>
        <Box fontSize="xs" color="textMuted" style={{ marginTop: "2px" }}>
          소분류 {subCount}개
        </Box>
      </Box>
      <Box display="flex" gap="1" onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
          style={{ fontSize: "12px" }}
        >
          수정
        </Button>
        {confirming ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            style={{ fontSize: "12px" }}
            onClick={handleDeleteClick}
          >
            확인삭제
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            style={{ fontSize: "12px", color: vars.color.destructive }}
          >
            삭제
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ─── 대분류 추가 폼 ───────────────────────────────────────────────────────────

interface AddMajorFormProps {
  onAdd: (id: string, label: string, type: CategoryType) => Promise<boolean>;
}

function AddMajorForm({ onAdd }: AddMajorFormProps) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<CategoryType>("expense");

  const handleSubmit = async () => {
    if (!id.trim() || !label.trim()) return;
    const ok = await onAdd(id.trim(), label.trim(), type);
    if (ok) {
      setId("");
      setLabel("");
      setType("expense");
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        + 대분류 추가
      </Button>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="2"
      p="3"
      rounded="lg"
      bg="surfaceSubtle"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="primary"
      style={{ flexWrap: "wrap" }}
    >
      <Input
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ height: "34px", fontSize: "13px", width: "110px" }}
        placeholder="ID (영문)"
        autoFocus
      />
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ height: "34px", fontSize: "13px", flex: "1", minWidth: "100px" }}
        placeholder="표시 이름"
      />
      <Select
        value={type}
        onChange={(e) => setType(e.target.value as CategoryType)}
        style={{ height: "34px", fontSize: "13px", width: "90px" }}
      >
        <option value="income">수입</option>
        <option value="expense">지출</option>
        <option value="save">저축</option>
      </Select>
      <Box display="flex" gap="1">
        <Button type="button" variant="default" size="sm" onClick={handleSubmit}>
          추가
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          취소
        </Button>
      </Box>
    </Box>
  );
}

// ─── 소분류 행 컴포넌트 ───────────────────────────────────────────────────────

interface SubRowItemProps {
  sub: SubRow;
  onEdit: (id: string, value: string, label: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function SubRowItem({ sub, onEdit, onDelete }: SubRowItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(sub.value);
  const [editLabel, setEditLabel] = useState(sub.label);
  const [confirming, setConfirming] = useState(false);

  const handleSave = async () => {
    if (!editValue.trim() || !editLabel.trim()) return;
    const ok = await onEdit(sub.id, editValue.trim(), editLabel.trim());
    if (ok) setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(sub.value);
    setEditLabel(sub.label);
    setEditing(false);
  };

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete(sub.id);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  if (editing) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap="2"
        p="2.5"
        rounded="lg"
        bg="surfaceSubtle"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="primary"
        style={{ flexWrap: "wrap" }}
      >
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={{ height: "32px", fontSize: "12px", width: "110px" }}
          placeholder="value (영문)"
          autoFocus
        />
        <Input
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          style={{ height: "32px", fontSize: "12px", flex: "1", minWidth: "80px" }}
          placeholder="표시 이름"
        />
        <Box display="flex" gap="1">
          <Button type="button" variant="default" size="sm" onClick={handleSave}>
            저장
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      p="2.5"
      rounded="lg"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="border"
      bg="surface"
    >
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Box display="flex" alignItems="center" gap="2">
          <Box fontSize="sm" color="text">
            {sub.label}
          </Box>
          <Box
            fontSize="xs"
            color="textMuted"
            bg="surfaceSubtle"
            rounded="sm"
            px="1"
            py="0.5"
            style={{
              fontFamily: "monospace",
            }}
          >
            {sub.value}
          </Box>
        </Box>
      </Box>
      <Box display="flex" gap="1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
          style={{ fontSize: "12px" }}
        >
          수정
        </Button>
        {confirming ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            style={{ fontSize: "12px" }}
            onClick={handleDeleteClick}
          >
            확인삭제
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            style={{ fontSize: "12px", color: vars.color.destructive }}
          >
            삭제
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ─── 소분류 추가 폼 ───────────────────────────────────────────────────────────

interface AddSubFormProps {
  majorId: string;
  onAdd: (majorId: string, value: string, label: string) => Promise<boolean>;
}

function AddSubForm({ majorId, onAdd }: AddSubFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  const handleSubmit = async () => {
    if (!value.trim() || !label.trim()) return;
    const ok = await onAdd(majorId, value.trim(), label.trim());
    if (ok) {
      setValue("");
      setLabel("");
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        + 소분류 추가
      </Button>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="2"
      p="2.5"
      rounded="lg"
      bg="surfaceSubtle"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="border"
      style={{ flexWrap: "wrap" }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ height: "32px", fontSize: "12px", width: "110px" }}
        placeholder="value (영문)"
        autoFocus
      />
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ height: "32px", fontSize: "12px", flex: "1", minWidth: "80px" }}
        placeholder="표시 이름"
      />
      <Box display="flex" gap="1">
        <Button type="button" variant="default" size="sm" onClick={handleSubmit}>
          추가
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          취소
        </Button>
      </Box>
    </Box>
  );
}

// ─── 메인 내보내기 ─────────────────────────────────────────────────────────────

export { MajorRowItem, AddMajorForm, SubRowItem, AddSubForm, TypeBadge };
