import { CategoryMap } from "./ledger";

export interface DateFilterConfig {
  availableMonths: string[];
  defaultMonth: string;
  currentYearMonth: string;
}

export interface BrandingConfig {
  appName: string;
  appLogoText: string;
  subtitle: string;
}

export interface LimitsConfig {
  pageSize: number;
  maxEntryAmount: number;
  defaultAddRowCount: number;
  tableMinWidth: string;
}

export interface AppInitialConfig {
  dateFilter: DateFilterConfig;
  categoryMap: CategoryMap;
  branding: BrandingConfig;
  limits: LimitsConfig;
}
