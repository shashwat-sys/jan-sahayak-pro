"use client";

import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";
import type { ActivityRecord, CaseRecord, FinanceTransactionRecord, TeamMemberRecord } from "@/lib/domain/types";

type ReportsPageProps = {
  activities: ActivityRecord[];
  cases: CaseRecord[];
  finance: FinanceTransactionRecord[];
  team: TeamMemberRecord[];
};

export function ReportsPage({ activities, cases, finance, team }: ReportsPageProps) {
  const [type, setType] = useState<"donor" | "appi" | "internal">("donor");
  const [period, setPeriod] = useState("Year 1 (July 2024 - June 2025)");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="page-stack">
      <PageHeader
        kicker="AI Reporting"
        title="Generate donor, APPI, and internal programme reports."
        copy="The report builder composes live case, activity, finance, and team context into reusable narratives for funders and leadership."
      />

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Controls</span>
          <div className="form-grid">
            <SelectField
              label="Report Type"
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              options={[
                { label: "Donor Progress Report", value: "donor" },
                { label: "APPI Annual Report", value: "appi" },
                { label: "Internal Status Brief", value: "internal" },
              ]}
            />
            <InputField label="Reporting Period" value={period} onChange={(event) => setPeriod(event.target.value)} />
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const response = await fetch("/api/ai/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type,
                      period,
                      context: {
                        cases: cases.map(
                          (caseRecord) =>
                            `${caseRecord.title} | ${caseRecord.court} | ${caseRecord.type} | ${caseRecord.status}`,
                        ),
                        activities: activities.map(
                          (activity) =>
                            `${activity.title} | ${activity.type} | ${activity.location} | Beneficiaries: ${activity.beneficiaries}`,
                        ),
                        team: team.map((member) => `${member.name} (${member.role})`),
                        finance: {
                          totalGrants: finance
                            .filter((entry) => entry.type === "grant")
                            .reduce((sum, entry) => sum + entry.amount, 0),
                          totalExpenses: finance
                            .filter((entry) => entry.type === "expense")
                            .reduce((sum, entry) => sum + entry.amount, 0),
                          balance:
                            finance
                              .filter((entry) => entry.type === "grant")
                              .reduce((sum, entry) => sum + entry.amount, 0) -
                            finance
                              .filter((entry) => entry.type === "expense")
                              .reduce((sum, entry) => sum + entry.amount, 0),
                          beneficiaries: activities.reduce(
                            (sum, activity) => sum + activity.beneficiaries,
                            0,
                          ),
                        },
                      },
                    }),
                  });
                  const result = (await response.json()) as { text?: string; error?: string };
                  if (!response.ok || !result.text) {
                    setMessage(result.error ?? "Report generation failed.");
                    return;
                  }
                  setOutput(result.text);
                  setMessage("Report generated.");
                })
              }
            >
              Generate Report
            </Button>
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Live Data</span>
          <div className="stack support-text">
            <p>{cases.length} cases currently in the docket.</p>
            <p>{activities.length} field and training activities recorded.</p>
            <p>
              ₹
              {finance
                .filter((entry) => entry.type === "grant")
                .reduce((sum, entry) => sum + entry.amount, 0)
                .toLocaleString("en-IN")}{" "}
              in grants logged.
            </p>
            <p>{team.filter((member) => member.status === "active").length} active team members.</p>
          </div>
        </Card>
      </div>

      <Card>
        <span className="section-kicker">Report Output</span>
        {output ? (
          <div className="legal-output">{output}</div>
        ) : (
          <div className="empty-state">Select a report type and generate from live programme data.</div>
        )}
      </Card>
    </div>
  );
}
