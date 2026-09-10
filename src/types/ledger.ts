export type MajorCategory = "income" | "common" | "personal" | "savings";
export type CategoryType = "income" | "expense" | "save";

export interface CategoryInfo {
  label: string;
  type: CategoryType;
  subs: Record<string, string>;
}

export const CATEGORY_MAP: Record<MajorCategory, CategoryInfo> = {
  income: {
    label: "수입내역",
    type: "income",
    subs: {
      mine: "내 수입",
      spouse: "배우자 수입",
    },
  },
  common: {
    label: "공동생활비",
    type: "expense",
    subs: {
      fixed: "고정비",
      variable: "변동비",
    },
  },
  personal: {
    label: "개인생활비",
    type: "expense",
    subs: {
      mine: "나",
      spouse: "배우자",
    },
  },
  savings: {
    label: "저축·투자",
    type: "save",
    subs: {
      common: "공동 저축",
      mine: "개인 저축",
    },
  },
};

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  major: MajorCategory;
  sub: string;
  item: string;
  amount: number;
}

export interface LedgerTotals {
  income: number;
  common: number;
  personal: number;
  savings: number;
  totalExpense: number;
  balance: number;
}
