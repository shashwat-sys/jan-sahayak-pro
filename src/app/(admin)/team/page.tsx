import { TeamPage } from "@/components/admin/team-page";
import { getTasks, getTeamMembers } from "@/lib/server/data";

export default async function TeamRoutePage() {
  const [team, tasks] = await Promise.all([getTeamMembers(), getTasks()]);
  return <TeamPage team={team} tasks={tasks} />;
}
