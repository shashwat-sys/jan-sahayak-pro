import { DEMO_ACTIVITIES, DEMO_CASES, DEMO_FINANCE_TRANSACTIONS, DEMO_TASKS, DEMO_TEAM_MEMBERS } from "@/lib/domain/demo-data";
import { buildDashboardSummary, buildFinanceSummary, inferMonthlyReportKind } from "@/lib/server/analytics";

describe("analytics helpers", () => {
  it("builds dashboard summary stats", () => {
    const summary = buildDashboardSummary({
      cases: DEMO_CASES,
      activities: DEMO_ACTIVITIES,
      finance: DEMO_FINANCE_TRANSACTIONS,
      tasks: DEMO_TASKS,
      team: DEMO_TEAM_MEMBERS,
    });

    expect(summary.stats.activeCases).toBe(1);
    expect(summary.pendingTasks.length).toBe(2);
    expect(summary.teamTaskBreakdown.length).toBeGreaterThan(0);
  });

  it("rolls up finance totals", () => {
    const summary = buildFinanceSummary(DEMO_FINANCE_TRANSACTIONS);

    expect(summary.totalGrants).toBe(2_998_000);
    expect(summary.totalExpenses).toBe(164_300);
    expect(summary.balance).toBe(2_833_700);
  });

  it("infers monthly report kind from team type", () => {
    expect(inferMonthlyReportKind(DEMO_TEAM_MEMBERS.find((member) => member.type === "worker"))).toBe(
      "social_worker",
    );
    expect(inferMonthlyReportKind(DEMO_TEAM_MEMBERS.find((member) => member.type === "mentor"))).toBe(
      "lawyer",
    );
  });
});
