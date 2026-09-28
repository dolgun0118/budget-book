import { getInitialLedgerData } from "@/services/ledgerServerService";
import { LedgerApp } from "@/components/ledger";

// 요청 시점에 서버에서 실행되는 동적 렌더링(SSR) 설정
export const dynamic = "force-dynamic";

export default async function Home() {
  const { initialConfig, initialEntries } = await getInitialLedgerData();

  return (
    <LedgerApp
      initialConfig={initialConfig}
      initialEntries={initialEntries}
    />
  );
}
