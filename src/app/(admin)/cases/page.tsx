import { CasesPage } from "@/components/admin/cases-page";
import { getCases, getTasks, getTeamMembers } from "@/lib/server/data";

export default async function CasesRoutePage() {
  const [cases, tasks, team] = await Promise.all([getCases(), getTasks(), getTeamMembers()]);
  return <CasesPage cases={cases} tasks={tasks} team={team} />;
}
