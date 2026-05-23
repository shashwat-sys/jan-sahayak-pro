import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/admin/page-header";
import { buildDashboardSummary } from "@/lib/server/analytics";
import { getAppData } from "@/lib/server/data";
import { formatDisplayDate } from "@/lib/utils/date";

export default async function DashboardPage() {
  const data = await getAppData();
  const summary = buildDashboardSummary(data);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Operations"
        title="Daily command view for Jan Nyaya Abhiyan."
        copy="Track stale matters, hearings due this week, field momentum, and the current month’s grant utilisation from one protected workspace."
      />

      <Card>
        <span className="section-kicker">Today</span>
        <div className="stack">
          {summary.overdueCases.length > 0 ? (
            <Notice title="Overdue case updates" tone="red">
              {summary.overdueCases.length} active matter(s) have not been updated in the last 7
              days.
            </Notice>
          ) : null}
          {summary.overdueTasks.length > 0 ? (
            <Notice title="Tasks past deadline" tone="red">
              {summary.overdueTasks.length} task(s) are now overdue and need reassignment or
              completion.
            </Notice>
          ) : null}
          {summary.upcomingHearings.length > 0 ? (
            <Notice title="Hearings this week">
              {summary.upcomingHearings
                .map(
                  ({ caseRecord, hearing }) =>
                    `${caseRecord.client} - ${formatDisplayDate(hearing.nextDate)} (${hearing.by})`,
                )
                .join("; ")}
            </Notice>
          ) : null}
          {summary.overdueCases.length === 0 &&
          summary.overdueTasks.length === 0 &&
          summary.upcomingHearings.length === 0 ? (
            <Notice title="All clear" tone="green">
              No critical alerts are showing right now.
            </Notice>
          ) : null}
        </div>
      </Card>

      <div className="grid cols-4">
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">⚖</div>
            <div>
              <div className="stat-value">{summary.stats.activeCases}</div>
              <div className="stat-label">Active Cases</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div>
              <div className="stat-value">{summary.stats.overdueCaseCount}</div>
              <div className="stat-label">Stale Matters</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">🏕</div>
            <div>
              <div className="stat-value">{summary.stats.monthlyActivities}</div>
              <div className="stat-label">Activities This Month</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <div className="stat-value">
                ₹{Math.round(summary.monthGrants / 100_000)}
                L / ₹{Math.round(summary.monthExpenses / 1_000)}K
              </div>
              <div className="stat-label">Month Grants / Expenses</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Hearings This Week</span>
          <div className="stack">
            {summary.upcomingHearings.length === 0 ? (
              <div className="empty-state">No hearings are scheduled in the next 7 days.</div>
            ) : (
              summary.upcomingHearings.map(({ caseRecord, hearing }) => (
                <div className="list-card" key={hearing.id}>
                  <div className="list-row">
                    <div>
                      <div>{caseRecord.client}</div>
                      <div className="list-meta">
                        {hearing.court} · {formatDisplayDate(hearing.nextDate)}
                      </div>
                    </div>
                    <Badge>{hearing.by}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Task Ownership</span>
          <div className="stack">
            {summary.teamTaskBreakdown.length === 0 ? (
              <div className="empty-state">No pending tasks are assigned right now.</div>
            ) : (
              summary.teamTaskBreakdown.map(({ member, tasks }) => (
                <div className="list-card" key={member.id}>
                  <div className="list-row">
                    <div>
                      <div>{member.name}</div>
                      <div className="list-meta">{member.role}</div>
                    </div>
                    <div className="chip-row">
                      <Badge>{tasks.length} tasks</Badge>
                      {tasks.some((task) => new Date(task.deadline) < new Date()) ? (
                        <Badge tone="red">Overdue</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="support-text" style={{ marginTop: 8 }}>
                    {tasks[0]?.title}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
