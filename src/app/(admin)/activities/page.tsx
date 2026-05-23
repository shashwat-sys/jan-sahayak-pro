import { ActivitiesPage } from "@/components/admin/activities-page";
import { getActivities, getTeamMembers } from "@/lib/server/data";

export default async function ActivitiesRoutePage() {
  const [activities, team] = await Promise.all([getActivities(), getTeamMembers()]);
  return <ActivitiesPage activities={activities} team={team} />;
}
