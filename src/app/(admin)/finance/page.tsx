import { FinancePage } from "@/components/admin/finance-page";
import { getFinanceTransactions } from "@/lib/server/data";

export default async function FinanceRoutePage() {
  const finance = await getFinanceTransactions();
  return <FinancePage finance={finance} />;
}
