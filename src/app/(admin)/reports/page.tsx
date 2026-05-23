import { ReportsPage } from "@/components/admin/reports-page";
import { getActivities, getCases, getFinanceTransactions, getTeamMembers } from "@/lib/server/data";

export default async function ReportsRoutePage() {
  const [activities, cases, finance, team] = await Promise.all([
    getActivities(),
    getCases(),
    getFinanceTransactions(),
    getTeamMembers(),
  ]);
  return <ReportsPage activities={activities} cases={cases} finance={finance} team={team} />;
}
