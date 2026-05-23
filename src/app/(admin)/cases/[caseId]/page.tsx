import { notFound } from "next/navigation";

import { CaseDetailPage } from "@/components/admin/case-detail-page";
import { getCaseById, getTasks, getTeamMembers } from "@/lib/server/data";

type CaseDetailRouteProps = {
  params: Promise<{ caseId: string }>;
};

export default async function CaseDetailRoutePage({ params }: CaseDetailRouteProps) {
  const { caseId } = await params;
  const [caseRecord, tasks, team] = await Promise.all([
    getCaseById(caseId),
    getTasks(),
    getTeamMembers(),
  ]);

  if (!caseRecord) {
    notFound();
  }

  return <CaseDetailPage caseRecord={caseRecord} tasks={tasks} team={team} />;
}
