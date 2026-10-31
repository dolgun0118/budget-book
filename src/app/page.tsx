import { getInitialLedgerData } from "@/services/ledgerServerService";
import { LedgerApp } from "@/components/ledger";

// 요청 시점에 서버에서 실행되는 동적 렌더링(SSR) 설정
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ month?: string | string[] }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const rawMonth = Array.isArray(resolvedParams?.month) ? resolvedParams.month[0] : resolvedParams?.month;
  const requestedMonth = typeof rawMonth === "string" ? rawMonth : undefined;

  const { initialConfig, initialEntries } = await getInitialLedgerData(requestedMonth);

  return (
    <LedgerApp
      initialConfig={initialConfig}
      initialEntries={initialEntries}
    />
  );
}
