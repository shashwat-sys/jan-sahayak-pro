"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, TextAreaField } from "@/components/ui/field";
import { upsertMonthlyReportAction } from "@/lib/actions/monthly-reports";
import type { MonthlyReportRecord, TeamMemberRecord } from "@/lib/domain/types";
import { inferMonthlyReportKind } from "@/lib/server/analytics";

type MonthlyReportsPageProps = {
  team: TeamMemberRecord[];
  reports: MonthlyReportRecord[];
};

const LAWYER_FIELDS = [
  ["Hearings Attended", "hearingsAttended"],
  ["New Cases Registered", "newCases"],
  ["Drafts / Filings / Applications", "draftsFilings"],
  ["Court Orders / Judgments Obtained", "courtOrders"],
  ["Witness Examination / Evidence Recording", "witnessExam"],
  ["Government / State Meetings", "govtMeetings"],
  ["Civil Society / NGO Meetings", "civilSocietyMeetings"],
  ["Other Networking Activities", "networkingMeetings"],
  ["Community Visits / Legal Aid Camps", "communityVisits"],
  ["PLV Training / Outreach Activities", "plvActivities"],
  ["Training / Learning Sessions Attended", "trainingAttended"],
  ["Mentor Sessions / Supervision", "mentorSessions"],
  ["Challenges Faced", "challenges"],
  ["Plan for Next Month", "planNextMonth"],
] as const;

const SOCIAL_WORKER_FIELDS = [
  ["New Cases Identified / Intake", "caseIntake"],
  ["Home Visits Conducted", "homeVisits"],
  ["Total Beneficiaries Reached", "beneficiaries"],
  ["Referrals Made", "referrals"],
  ["OSC Visits", "osc"],
  ["DLSA Coordination", "dlsa"],
  ["CWC Appearances", "cwc"],
  ["AHTU Coordination", "ahtu"],
  ["Police Station Visits", "police"],
  ["Community Meetings", "communityMeetings"],
  ["Legal Literacy Sessions", "legalLiteracy"],
  ["PLV Coordination", "plvCoordination"],
  ["Documentation Activities", "documentation"],
  ["Challenges Faced", "challenges"],
  ["Plan for Next Month", "planNextMonth"],
] as const;

export function MonthlyReportsPage({ reports, team }: MonthlyReportsPageProps) {
  const router = useRouter();
  const [member, setMember] = useState(team[0]?.name ?? "");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const initialReport = reports.find(
    (report) => report.member === (team[0]?.name ?? "") && report.month === new Date().toISOString().slice(0, 7),
  );
  const [summary, setSummary] = useState(initialReport?.summary ?? "");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>(initialReport?.data ?? {});
  const [isPending, startTransition] = useTransition();

  const selectedMember = team.find((item) => item.name === member);
  const reportKind = inferMonthlyReportKind(selectedMember);
  const fields = reportKind === "social_worker" ? SOCIAL_WORKER_FIELDS : LAWYER_FIELDS;
  function syncSelection(nextMember: string, nextMonth: string) {
    const nextReport =
      reports.find((report) => report.member === nextMember && report.month === nextMonth) ?? null;
    setMember(nextMember);
    setMonth(nextMonth);
    setFormData(nextReport?.data ?? {});
    setSummary(nextReport?.summary ?? "");
  }

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Reporting"
        title="Monthly member reporting with AI-assisted summaries."
        copy="Capture litigation and fieldwork outputs using role-aware forms, then generate a polished monthly narrative for leadership review."
      />

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Report Controls</span>
          <div className="form-grid">
            <InputField
              label="Team Member"
              value={member}
              onChange={(event) => syncSelection(event.target.value, month)}
              list="team-member-options"
            />
            <datalist id="team-member-options">
              {team.map((item) => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
            <InputField
              label="Month"
              type="month"
              value={month}
              onChange={(event) => syncSelection(member, event.target.value)}
            />
            <div className="button-row">
              <Badge>{selectedMember?.role ?? "Unknown role"}</Badge>
              <Badge tone="blue">{reportKind === "social_worker" ? "Social Worker" : "Lawyer / Fellow"}</Badge>
            </div>
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <div className="button-row">
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await upsertMonthlyReportAction({
                      member,
                      month,
                      type: reportKind,
                      data: formData,
                    });
                    setMessage(result.ok ? "Draft saved." : result.error);
                    if (result.ok) {
                      router.refresh();
                    }
                  })
                }
              >
                Save Draft
              </Button>
              <Button
                tone="secondary"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const response = await fetch("/api/ai/monthly-summary", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        member,
                        month,
                        role: selectedMember?.role ?? "",
                        type: reportKind,
                        data: formData,
                      }),
                    });
                    const result = (await response.json()) as { text?: string; error?: string };
                    if (!response.ok || !result.text) {
                      setMessage(result.error ?? "Summary generation failed.");
                      return;
                    }
                    setSummary(result.text);
                    setMessage("AI summary generated and saved.");
                    router.refresh();
                  })
                }
              >
                Generate AI Summary
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Past Reports</span>
          <div className="stack">
            {reports.length === 0 ? (
              <div className="empty-state">No monthly reports have been saved yet.</div>
            ) : (
              reports.map((report) => (
                <div className="list-card" key={report.id}>
                  <div className="list-row">
                    <div>
                      <div>{report.member}</div>
                      <div className="list-meta">
                        {report.month} · {report.type === "social_worker" ? "Social Worker" : "Lawyer"}
                      </div>
                    </div>
                    {report.summary ? <Badge tone="green">Summary ready</Badge> : <Badge>Draft</Badge>}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <span className="section-kicker">
          {reportKind === "social_worker" ? "Social Worker Form" : "Lawyer / Fellow Form"}
        </span>
        <div className="grid cols-2">
          {fields.map(([label, key]) =>
            key === "challenges" || key === "planNextMonth" ? (
              <TextAreaField
                key={key}
                label={label}
                value={formData[key] ?? ""}
                onChange={(event) => setFormData((current) => ({ ...current, [key]: event.target.value }))}
              />
            ) : (
              <InputField
                key={key}
                label={label}
                value={formData[key] ?? ""}
                onChange={(event) => setFormData((current) => ({ ...current, [key]: event.target.value }))}
              />
            ),
          )}
        </div>
      </Card>

      <Card>
        <span className="section-kicker">AI Summary</span>
        {summary ? (
          <div className="legal-output">{summary}</div>
        ) : (
          <div className="empty-state">Generate a summary once the monthly form has enough data.</div>
        )}
      </Card>
    </div>
  );
}
