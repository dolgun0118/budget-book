export type MajorCategory = "income" | "common" | "personal" | "savings";
export type CategoryType = "income" | "expense" | "save";

export interface SubCategoryItem {
  value: string;
  label: string;
}

export interface CategoryInfo {
  label: string;
  type: CategoryType;
  subs: Record<string, string>; // value -> label
}

export type CategoryMap = Record<string, CategoryInfo>;

export const DEFAULT_CATEGORY_MAP: Record<string, CategoryInfo> = {
  income: {
    label: "수입내역",
    type: "income",
    subs: {
      donggun: "다빈",
      dabin: "동건",
      mine: "다빈",
      spouse: "동건",
      refund: "환급/기타",
    },
  },
  common: {
    label: "공동생활비",
    type: "expense",
    subs: {
      fixed: "고정비",
      utility: "공과금/관리비",
      food: "식비",
      household: "생활용품",
      medical: "의료/건강",
      leisure: "문화/여가",
      loan: "대출/금융",
      appliance: "가전/가구",
      reserve: "예비비/기타",
      variable: "변동비",
    },
  },
  personal: {
    label: "개인생활비",
    type: "expense",
    subs: {
      donggun: "동건",
      dabin: "다빈",
      mine: "동건",
      spouse: "다빈",
    },
  },
  savings: {
    label: "저축·투자",
    type: "save",
    subs: {
      common: "공동 저축",
      donggun: "동건",
      dabin: "다빈",
      mine: "동건",
      spouse: "다빈",
    },
  },
};

export const CATEGORY_MAP = DEFAULT_CATEGORY_MAP;

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
