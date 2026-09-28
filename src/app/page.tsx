import { getInitialLedgerData } from "@/services/ledgerServerService";
import { LedgerApp } from "@/components/ledger";

// SSR 비동기 Server Component
export default async function Home() {
  const { initialConfig, initialEntries } = await getInitialLedgerData();

  return (
    <LedgerApp
      initialConfig={initialConfig}
      initialEntries={initialEntries}
    />
  );
}
