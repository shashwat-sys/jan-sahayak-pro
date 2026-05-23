"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField, TextAreaField } from "@/components/ui/field";
import { addCaseDiaryEntryAction, addCaseDocumentAction, addCaseHearingAction, createTaskAction, setCaseStatusAction, toggleTaskStatusAction } from "@/lib/actions/cases";
import { CASE_STATUSES, PRIORITIES } from "@/lib/domain/constants";
import type { CaseRecord, TaskRecord, TeamMemberRecord } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/utils/date";

type CaseDetailPageProps = {
  caseRecord: CaseRecord;
  tasks: TaskRecord[];
  team: TeamMemberRecord[];
};

type DiaryFormState = {
  action: string;
  by: string;
  notes: string;
};

type HearingFormState = {
  date: string;
  court: string;
  purpose: string;
  outcome: string;
  nextDate: string;
  by: string;
};

type TaskFormState = {
  title: string;
  assignedTo: string;
  caseId: string;
  deadline: string;
  priority: TaskRecord["priority"];
  notes: string;
};

export function CaseDetailPage({ caseRecord, tasks, team }: CaseDetailPageProps) {
  const router = useRouter();
  const [panel, setPanel] = useState<"diary" | "hearings" | "documents" | "tasks">("diary");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [diaryForm, setDiaryForm] = useState<DiaryFormState>({
    action: "",
    by: caseRecord.advocate,
    notes: "",
  });
  const [hearingForm, setHearingForm] = useState<HearingFormState>({
    date: "",
    court: caseRecord.court,
    purpose: "",
    outcome: "",
    nextDate: "",
    by: caseRecord.advocate,
  });
  const [documentLabel, setDocumentLabel] = useState("");
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: "",
    assignedTo: caseRecord.advocate,
    caseId: caseRecord.id,
    deadline: "",
    priority: "medium" as const,
    notes: "",
  });

  const assignees = team.filter((member) => member.status === "active").map((member) => member.name);
  const caseTasks = tasks.filter((task) => task.caseId === caseRecord.id);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Case File"
        title={caseRecord.title}
        copy={`${caseRecord.client} · ${caseRecord.court}`}
        actions={
          <div className="button-row">
            {CASE_STATUSES.map((status) => (
              <Button
                key={status}
                size="small"
                tone={caseRecord.status === status ? "primary" : "ghost"}
                onClick={() =>
                  startTransition(async () => {
                    await setCaseStatusAction(caseRecord.id, status);
                    router.refresh();
                  })
                }
              >
                {status}
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Case Particulars</span>
          <div className="grid cols-2">
            <div className="list-card">
              <div className="list-meta">Case Number</div>
              <div>{caseRecord.caseNo || "Pending"}</div>
            </div>
            <div className="list-card">
              <div className="list-meta">FIR Number</div>
              <div>{caseRecord.firNo || "—"}</div>
            </div>
            <div className="list-card">
              <div className="list-meta">Sections</div>
              <div>{caseRecord.section || "—"}</div>
            </div>
            <div className="list-card">
              <div className="list-meta">Police Station</div>
              <div>{caseRecord.ps || "—"}</div>
            </div>
            <div className="list-card">
              <div className="list-meta">Advocate</div>
              <div>{caseRecord.advocate}</div>
            </div>
            <div className="list-card">
              <div className="list-meta">Field Worker</div>
              <div>{caseRecord.worker || "—"}</div>
            </div>
          </div>
          <div className="button-row" style={{ marginTop: 12 }}>
            <Badge>{caseRecord.type}</Badge>
            <Badge tone={caseRecord.priority === "high" ? "red" : caseRecord.priority === "medium" ? "accent" : "green"}>
              {caseRecord.priority}
            </Badge>
            <Badge tone={caseRecord.status === "active" ? "green" : caseRecord.status === "overdue" ? "red" : "blue"}>
              {caseRecord.status}
            </Badge>
          </div>
        </Card>

        <div className="stack">
          <Card>
            <span className="section-kicker">Statement of Facts</span>
            <div className="legal-output">{caseRecord.facts || "No facts recorded."}</div>
          </Card>
          <Card>
            <span className="section-kicker">Relief Sought</span>
            <div className="legal-output">{caseRecord.relief || "—"}</div>
          </Card>
        </div>
      </div>

      <Card>
        <span className="section-kicker">Legal Grounds</span>
        <div className="legal-output">{caseRecord.grounds || "No legal grounds recorded yet."}</div>
      </Card>

      <Card>
        <div className="button-row" style={{ marginBottom: 14 }}>
          {[
            { key: "diary", label: "Case Diary" },
            { key: "hearings", label: "Hearings" },
            { key: "documents", label: "Documents" },
            { key: "tasks", label: `Tasks (${caseTasks.filter((task) => task.status !== "done").length})` },
          ].map((item) => (
            <Button
              key={item.key}
              size="small"
              tone={panel === item.key ? "primary" : "ghost"}
              onClick={() => setPanel(item.key as typeof panel)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}

        {panel === "diary" ? (
          <div className="stack">
            <div className="form-grid">
              <div className="grid cols-2">
                <InputField
                  label="Action"
                  value={diaryForm.action}
                  onChange={(event) => setDiaryForm((current) => ({ ...current, action: event.target.value }))}
                />
                <SelectField
                  label="By"
                  value={diaryForm.by}
                  onChange={(event) => setDiaryForm((current) => ({ ...current, by: event.target.value }))}
                  options={assignees}
                />
              </div>
              <TextAreaField
                label="Notes"
                value={diaryForm.notes}
                onChange={(event) => setDiaryForm((current) => ({ ...current, notes: event.target.value }))}
              />
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await addCaseDiaryEntryAction(caseRecord.id, diaryForm);
                    setMessage(result.ok ? "Diary entry added." : result.error);
                    if (result.ok) {
                      setDiaryForm({ action: "", by: caseRecord.advocate, notes: "" });
                      router.refresh();
                    }
                  })
                }
              >
                Add Entry
              </Button>
            </div>
            {caseRecord.diary.map((entry) => (
              <div className="table-row" key={entry.id}>
                <div>
                  <div>{entry.action}</div>
                  <div className="list-meta">
                    {formatDisplayDate(entry.date)} · {entry.by}
                  </div>
                  {entry.notes ? <div className="support-text">{entry.notes}</div> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {panel === "hearings" ? (
          <div className="stack">
            <div className="form-grid">
              <div className="grid cols-3">
                <InputField
                  label="Hearing Date"
                  type="date"
                  value={hearingForm.date}
                  onChange={(event) => setHearingForm((current) => ({ ...current, date: event.target.value }))}
                />
                <InputField
                  label="Next Date"
                  type="date"
                  value={hearingForm.nextDate}
                  onChange={(event) => setHearingForm((current) => ({ ...current, nextDate: event.target.value }))}
                />
                <SelectField
                  label="By"
                  value={hearingForm.by}
                  onChange={(event) => setHearingForm((current) => ({ ...current, by: event.target.value }))}
                  options={assignees}
                />
              </div>
              <div className="grid cols-2">
                <InputField
                  label="Purpose"
                  value={hearingForm.purpose}
                  onChange={(event) => setHearingForm((current) => ({ ...current, purpose: event.target.value }))}
                />
                <InputField
                  label="Outcome"
                  value={hearingForm.outcome}
                  onChange={(event) => setHearingForm((current) => ({ ...current, outcome: event.target.value }))}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await addCaseHearingAction(caseRecord.id, hearingForm);
                    setMessage(result.ok ? "Hearing saved." : result.error);
                    if (result.ok) {
                      setHearingForm({
                        date: "",
                        court: caseRecord.court,
                        purpose: "",
                        outcome: "",
                        nextDate: "",
                        by: caseRecord.advocate,
                      });
                      router.refresh();
                    }
                  })
                }
              >
                Add Hearing
              </Button>
            </div>
            {caseRecord.hearings.map((hearing) => (
              <div className="table-row" key={hearing.id}>
                <div>
                  <div>{hearing.purpose || "Hearing"}</div>
                  <div className="list-meta">
                    {formatDisplayDate(hearing.date)} · {hearing.court}
                  </div>
                  <div className="support-text">Outcome: {hearing.outcome || "Pending"}</div>
                </div>
                {hearing.nextDate ? <Badge>{formatDisplayDate(hearing.nextDate)}</Badge> : null}
              </div>
            ))}
          </div>
        ) : null}

        {panel === "documents" ? (
          <div className="stack">
            <div className="button-row">
              <input
                className="field"
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: "1px solid rgba(99, 123, 165, 0.24)",
                  background: "rgba(10, 16, 31, 0.7)",
                  color: "var(--text)",
                  padding: "11px 12px",
                }}
                placeholder="Document label"
                value={documentLabel}
                onChange={(event) => setDocumentLabel(event.target.value)}
              />
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await addCaseDocumentAction(caseRecord.id, documentLabel);
                    setMessage(result.ok ? "Document added." : result.error);
                    if (result.ok) {
                      setDocumentLabel("");
                      router.refresh();
                    }
                  })
                }
              >
                Add
              </Button>
            </div>
            <div className="grid cols-2">
              {caseRecord.documents.map((document) => (
                <div className="list-card" key={document}>
                  <div>📄 {document}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {panel === "tasks" ? (
          <div className="stack">
            <div className="form-grid">
              <div className="grid cols-3">
                <InputField
                  label="Task"
                  value={taskForm.title}
                  onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
                />
                <SelectField
                  label="Assign To"
                  value={taskForm.assignedTo}
                  onChange={(event) => setTaskForm((current) => ({ ...current, assignedTo: event.target.value }))}
                  options={assignees}
                />
                <InputField
                  label="Deadline"
                  type="date"
                  value={taskForm.deadline}
                  onChange={(event) => setTaskForm((current) => ({ ...current, deadline: event.target.value }))}
                />
              </div>
              <div className="grid cols-2">
                <SelectField
                  label="Priority"
                  value={taskForm.priority}
                  onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value as typeof taskForm.priority }))}
                  options={[...PRIORITIES]}
                />
                <InputField
                  label="Notes"
                  value={taskForm.notes}
                  onChange={(event) => setTaskForm((current) => ({ ...current, notes: event.target.value }))}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await createTaskAction(taskForm);
                    setMessage(result.ok ? "Task assigned." : result.error);
                    if (result.ok) {
                      setTaskForm({
                        title: "",
                        assignedTo: caseRecord.advocate,
                        caseId: caseRecord.id,
                        deadline: "",
                        priority: "medium",
                        notes: "",
                      });
                      router.refresh();
                    }
                  })
                }
              >
                Assign Task
              </Button>
            </div>

            {caseTasks.map((task) => (
              <div className="table-row" key={task.id}>
                <div>
                  <div>{task.title}</div>
                  <div className="list-meta">
                    {task.assignedTo} · {formatDisplayDate(task.deadline)}
                  </div>
                  {task.notes ? <div className="support-text">{task.notes}</div> : null}
                </div>
                <div className="chip-row">
                  <Badge tone={task.priority === "high" ? "red" : task.priority === "medium" ? "accent" : "green"}>
                    {task.priority}
                  </Badge>
                  <Button
                    size="small"
                    tone={task.status === "done" ? "secondary" : "ghost"}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleTaskStatusAction(task.id);
                        router.refresh();
                      })
                    }
                  >
                    {task.status === "done" ? "Done" : "Mark Done"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
