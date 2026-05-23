"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField, TextAreaField } from "@/components/ui/field";
import {
  BIHAR_DISTRICTS,
  CASE_STATUSES,
  CASE_TYPES,
  COURTS,
  PRIORITIES,
} from "@/lib/domain/constants";
import type { CaseRecord, TaskRecord, TeamMemberRecord } from "@/lib/domain/types";
import { createCaseAction } from "@/lib/actions/cases";
import { daysSince, formatDisplayDate } from "@/lib/utils/date";

type CasesPageProps = {
  cases: CaseRecord[];
  tasks: TaskRecord[];
  team: TeamMemberRecord[];
};

type CaseFormState = {
  title: string;
  client: string;
  respondent: string;
  court: string;
  caseNo: string;
  firNo: string;
  section: string;
  ps: string;
  type: CaseRecord["type"];
  district: string;
  advocate: string;
  worker: string;
  status: CaseRecord["status"];
  priority: CaseRecord["priority"];
  facts: string;
  grounds: string;
  relief: string;
};

function createBlankCase(team: TeamMemberRecord[]): CaseFormState {
  const defaultAdvocate = team.find((member) =>
    ["mentor", "lawyer", "fellow", "consultant", "coordinator"].includes(member.type),
  )?.name;

  return {
    title: "",
    client: "",
    respondent: "",
    court: COURTS[0],
    caseNo: "",
    firNo: "",
    section: "",
    ps: "",
    type: CASE_TYPES[0],
    district: BIHAR_DISTRICTS[0],
    advocate: defaultAdvocate ?? "",
    worker: "",
    status: "active" as const,
    priority: "medium" as const,
    facts: "",
    grounds: "",
    relief: "",
  };
}

export function CasesPage({ cases, tasks, team }: CasesPageProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | CaseRecord["status"]>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CaseFormState>(createBlankCase(team));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const lawyers = team
    .filter((member) =>
      ["mentor", "lawyer", "fellow", "consultant", "coordinator"].includes(member.type),
    )
    .map((member) => member.name);
  const workers = team
    .filter((member) => ["worker", "fellow"].includes(member.type))
    .map((member) => member.name);

  const filteredCases = filter === "all" ? cases : cases.filter((entry) => entry.status === filter);
  const pendingTasks = tasks.filter((task) => task.status !== "done");

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Litigation"
        title="Case registry, hearings, and field coordination."
        copy="Track district and High Court matters, stale files, legal grounds, and linked task ownership across the Janman legal network."
        actions={<Button onClick={() => setIsCreating((value) => !value)}>{isCreating ? "Close Form" : "Register Case"}</Button>}
      />

      {isCreating ? (
        <Card>
          <span className="section-kicker">Register New Case</span>
          <div className="form-grid">
            <div className="grid cols-2">
              <InputField
                label="Case Title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
              <InputField
                label="Client / Petitioner"
                value={form.client}
                onChange={(event) => setForm((current) => ({ ...current, client: event.target.value }))}
              />
            </div>
            <InputField
              label="Respondent"
              value={form.respondent}
              onChange={(event) => setForm((current) => ({ ...current, respondent: event.target.value }))}
            />
            <div className="grid cols-3">
              <SelectField
                label="Court"
                value={form.court}
                onChange={(event) => setForm((current) => ({ ...current, court: event.target.value }))}
                options={[...COURTS]}
              />
              <SelectField
                label="Case Type"
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as typeof form.type }))}
                options={[...CASE_TYPES]}
              />
              <SelectField
                label="District"
                value={form.district}
                onChange={(event) => setForm((current) => ({ ...current, district: event.target.value as typeof form.district }))}
                options={[...BIHAR_DISTRICTS]}
              />
            </div>
            <div className="grid cols-3">
              <InputField
                label="Case Number"
                value={form.caseNo}
                onChange={(event) => setForm((current) => ({ ...current, caseNo: event.target.value }))}
              />
              <InputField
                label="FIR Number"
                value={form.firNo}
                onChange={(event) => setForm((current) => ({ ...current, firNo: event.target.value }))}
              />
              <InputField
                label="Sections / Articles"
                value={form.section}
                onChange={(event) => setForm((current) => ({ ...current, section: event.target.value }))}
              />
            </div>
            <div className="grid cols-3">
              <InputField
                label="Police Station"
                value={form.ps}
                onChange={(event) => setForm((current) => ({ ...current, ps: event.target.value }))}
              />
              <SelectField
                label="Priority"
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as typeof form.priority }))}
                options={[...PRIORITIES]}
              />
              <SelectField
                label="Status"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof form.status }))}
                options={[...CASE_STATUSES]}
              />
            </div>
            <div className="grid cols-2">
              <SelectField
                label="Advocate"
                value={form.advocate}
                onChange={(event) => setForm((current) => ({ ...current, advocate: event.target.value }))}
                options={lawyers}
              />
              <SelectField
                label="Field Worker / Fellow"
                value={form.worker}
                onChange={(event) => setForm((current) => ({ ...current, worker: event.target.value }))}
                options={["", ...workers].map((value) => ({ label: value || "—", value }))}
              />
            </div>
            <TextAreaField
              label="Statement of Facts"
              value={form.facts}
              onChange={(event) => setForm((current) => ({ ...current, facts: event.target.value }))}
            />
            <TextAreaField
              label="Legal Grounds"
              value={form.grounds}
              onChange={(event) => setForm((current) => ({ ...current, grounds: event.target.value }))}
            />
            <TextAreaField
              label="Relief Sought"
              value={form.relief}
              onChange={(event) => setForm((current) => ({ ...current, relief: event.target.value }))}
            />
            {error ? <div className="support-text" style={{ color: "var(--red)" }}>{error}</div> : null}
            <div className="button-row">
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await createCaseAction(form);
                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }

                    setError("");
                    setIsCreating(false);
                    setForm(createBlankCase(team));
                    router.push(`/cases/${result.id}`);
                    router.refresh();
                  })
                }
              >
                {isPending ? "Saving..." : "Save Case"}
              </Button>
              <Button tone="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="button-row">
        {["all", ...CASE_STATUSES].map((status) => (
          <Button
            key={status}
            size="small"
            tone={filter === status ? "primary" : "ghost"}
            onClick={() => setFilter(status as typeof filter)}
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid cols-2">
        <div className="stack">
          {filteredCases.map((caseRecord) => (
            <Link className="list-card" href={`/cases/${caseRecord.id}`} key={caseRecord.id}>
              <div className="list-row">
                <div>
                  <div>{caseRecord.title}</div>
                  <div className="list-meta">
                    {caseRecord.court} · {caseRecord.caseNo || "No. pending"}
                  </div>
                  <div className="list-meta">
                    {caseRecord.advocate} · {caseRecord.district}
                  </div>
                </div>
                <div className="chip-row">
                  <Badge>{caseRecord.priority}</Badge>
                  <Badge tone={caseRecord.status === "active" ? "green" : caseRecord.status === "overdue" ? "red" : "blue"}>
                    {caseRecord.status}
                  </Badge>
                </div>
              </div>
              <div className="button-row" style={{ marginTop: 10 }}>
                <Badge tone="blue">{caseRecord.type}</Badge>
                {daysSince(caseRecord.updatedAt) > 7 ? (
                  <Badge tone="red">{daysSince(caseRecord.updatedAt)}d stale</Badge>
                ) : null}
                {caseRecord.hearings.some((hearing) => hearing.nextDate) ? (
                  <Badge tone="purple">Hearing linked</Badge>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <Card>
          <span className="section-kicker">Team Watch</span>
          <div className="stack">
            {team
              .filter((member) => member.status === "active")
              .map((member) => {
                const memberTasks = pendingTasks.filter((task) => task.assignedTo === member.name);
                if (memberTasks.length === 0) {
                  return null;
                }

                return (
                  <div className="list-card" key={member.id}>
                    <div className="list-row">
                      <div>
                        <div>{member.name}</div>
                        <div className="list-meta">{member.role}</div>
                      </div>
                      <Badge>{memberTasks.length} tasks</Badge>
                    </div>
                    <div className="support-text" style={{ marginTop: 8 }}>
                      {memberTasks[0]?.title}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="support-text" style={{ marginTop: 14 }}>
            {cases.length} total matters · {pendingTasks.length} open tasks · last updated{" "}
            {formatDisplayDate(cases[0]?.updatedAt)}
          </div>
        </Card>
      </div>
    </div>
  );
}
