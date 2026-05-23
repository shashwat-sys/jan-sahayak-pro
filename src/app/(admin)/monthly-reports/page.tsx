import { MonthlyReportsPage } from "@/components/admin/monthly-reports-page";
import { getMonthlyReports, getTeamMembers } from "@/lib/server/data";

export default async function MonthlyReportsRoutePage() {
  const [team, reports] = await Promise.all([getTeamMembers(), getMonthlyReports()]);
  return <MonthlyReportsPage team={team} reports={reports} />;
}
