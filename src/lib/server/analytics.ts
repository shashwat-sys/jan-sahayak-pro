import type {
  ActivityRecord,
  CaseRecord,
  FinanceTransactionRecord,
  MonthlyReportKind,
  TaskRecord,
  TeamMemberRecord,
} from "@/lib/domain/types";
import { daysSince, daysUntil, monthKey } from "@/lib/utils/date";

export function buildDashboardSummary(input: {
  cases: CaseRecord[];
  activities: ActivityRecord[];
  finance: FinanceTransactionRecord[];
  tasks: TaskRecord[];
  team: TeamMemberRecord[];
}) {
  const { cases, activities, finance, tasks, team } = input;
  const overdueCases = cases.filter(
    (caseRecord) => caseRecord.status === "active" && daysSince(caseRecord.updatedAt) > 7,
  );
  const upcomingHearings = cases
    .flatMap((caseRecord) =>
      caseRecord.hearings
        .filter((hearing) => {
          const days = daysUntil(hearing.nextDate);
          return days >= 0 && days <= 7;
        })
        .map((hearing) => ({ caseRecord, hearing })),
    )
    .sort((a, b) => (a.hearing.nextDate ?? "").localeCompare(b.hearing.nextDate ?? ""));

  const pendingTasks = tasks.filter((task) => task.status !== "done");
  const overdueTasks = pendingTasks.filter((task) => daysUntil(task.deadline) < 0);
  const currentMonth = monthKey(new Date().toISOString());
  const monthGrants = finance
    .filter((entry) => entry.type === "grant" && monthKey(entry.date) === currentMonth)
    .reduce((sum, entry) => sum + entry.amount, 0);
  const monthExpenses = finance
    .filter((entry) => entry.type === "expense" && monthKey(entry.date) === currentMonth)
    .reduce((sum, entry) => sum + entry.amount, 0);
  const teamTaskBreakdown = team
    .filter((member) => member.status === "active")
    .map((member) => ({
      member,
      tasks: pendingTasks.filter((task) => task.assignedTo === member.name),
    }))
    .filter((entry) => entry.tasks.length > 0);

  return {
    overdueCases,
    upcomingHearings,
    pendingTasks,
    overdueTasks,
    monthGrants,
    monthExpenses,
    teamTaskBreakdown,
    stats: {
      activeCases: cases.filter((caseRecord) => caseRecord.status === "active").length,
      overdueCaseCount: overdueCases.length,
      monthlyActivities: activities.filter((activity) => monthKey(activity.date) === currentMonth)
        .length,
      pendingTaskCount: pendingTasks.length,
    },
  };
}

export function buildFinanceSummary(finance: FinanceTransactionRecord[]) {
  const totalGrants = finance
    .filter((entry) => entry.type === "grant")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = finance
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expenseByCategory = finance
    .filter((entry) => entry.type === "expense")
    .reduce<Record<string, number>>((summary, entry) => {
      summary[entry.category] = (summary[entry.category] ?? 0) + entry.amount;
      return summary;
    }, {});

  return {
    totalGrants,
    totalExpenses,
    balance: totalGrants - totalExpenses,
    expenseByCategory,
  };
}

export function inferMonthlyReportKind(teamMember?: TeamMemberRecord | null): MonthlyReportKind {
  return teamMember?.type === "worker" ? "social_worker" : "lawyer";
}
