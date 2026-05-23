"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField, TextAreaField } from "@/components/ui/field";
import { addParticipantsBulkAction, createActivityAction } from "@/lib/actions/activities";
import { ACTIVITY_STATUSES, ACTIVITY_TYPES, BIHAR_DISTRICTS } from "@/lib/domain/constants";
import type { ActivityRecord, TeamMemberRecord } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/utils/date";

type ActivitiesPageProps = {
  activities: ActivityRecord[];
  team: TeamMemberRecord[];
};

type ActivityFormState = {
  type: ActivityRecord["type"];
  title: string;
  location: string;
  district: string;
  date: string;
  coordinator: string;
  beneficiaries: number;
  casesIdentified: number;
  casesReferred: number;
  summary: string;
  status: ActivityRecord["status"];
  followUp: string;
};

function blankActivity(team: TeamMemberRecord[]): ActivityFormState {
  return {
    type: ACTIVITY_TYPES[0],
    title: "",
    location: "",
    district: BIHAR_DISTRICTS[0],
    date: new Date().toISOString().slice(0, 10),
    coordinator: team[0]?.name ?? "",
    beneficiaries: 0,
    casesIdentified: 0,
    casesReferred: 0,
    summary: "",
    status: "planned" as const,
    followUp: "",
  };
}

export function ActivitiesPage({ activities, team }: ActivitiesPageProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"all" | ActivityRecord["type"]>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [bulkTarget, setBulkTarget] = useState<string | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ActivityFormState>(blankActivity(team));
  const [isPending, startTransition] = useTransition();

  const filtered = selectedType === "all" ? activities : activities.filter((item) => item.type === selectedType);
  const totals = {
    activities: activities.length,
    beneficiaries: activities.reduce((sum, activity) => sum + activity.beneficiaries, 0),
    casesIdentified: activities.reduce((sum, activity) => sum + activity.casesIdentified, 0),
    participants: activities.reduce((sum, activity) => sum + activity.participants.length, 0),
  };

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Fieldwork"
        title="Activities, registrations, and community outreach."
        copy="Capture camps, trainings, follow-up commitments, and participant registrations without leaving the protected operations workspace."
        actions={<Button onClick={() => setIsCreating((current) => !current)}>{isCreating ? "Close Form" : "Record Activity"}</Button>}
      />

      <div className="grid cols-4">
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <div className="stat-value">{totals.activities}</div>
              <div className="stat-label">Total Activities</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <div className="stat-value">{totals.beneficiaries}</div>
              <div className="stat-label">Beneficiaries Reached</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">⚖</div>
            <div>
              <div className="stat-value">{totals.casesIdentified}</div>
              <div className="stat-label">Cases Identified</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div>
              <div className="stat-value">{totals.participants}</div>
              <div className="stat-label">Participants Registered</div>
            </div>
          </div>
        </Card>
      </div>

      {isCreating ? (
        <Card>
          <span className="section-kicker">Record Activity</span>
          <div className="form-grid">
            <div className="grid cols-2">
              <SelectField
                label="Type"
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as typeof form.type }))}
                options={[...ACTIVITY_TYPES]}
              />
              <InputField
                label="Title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="grid cols-3">
              <InputField
                label="Location"
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              />
              <SelectField
                label="District"
                value={form.district}
                onChange={(event) => setForm((current) => ({ ...current, district: event.target.value as typeof form.district }))}
                options={[...BIHAR_DISTRICTS]}
              />
              <InputField
                label="Date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
            <div className="grid cols-3">
              <SelectField
                label="Coordinator"
                value={form.coordinator}
                onChange={(event) => setForm((current) => ({ ...current, coordinator: event.target.value }))}
                options={team.map((member) => member.name)}
              />
              <InputField
                label="Beneficiaries"
                type="number"
                value={form.beneficiaries}
                onChange={(event) => setForm((current) => ({ ...current, beneficiaries: Number(event.target.value) }))}
              />
              <SelectField
                label="Status"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof form.status }))}
                options={[...ACTIVITY_STATUSES]}
              />
            </div>
            <div className="grid cols-2">
              <InputField
                label="Cases Identified"
                type="number"
                value={form.casesIdentified}
                onChange={(event) => setForm((current) => ({ ...current, casesIdentified: Number(event.target.value) }))}
              />
              <InputField
                label="Cases Referred"
                type="number"
                value={form.casesReferred}
                onChange={(event) => setForm((current) => ({ ...current, casesReferred: Number(event.target.value) }))}
              />
            </div>
            <TextAreaField
              label="Summary"
              value={form.summary}
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            />
            <TextAreaField
              label="Follow-up Actions"
              value={form.followUp}
              onChange={(event) => setForm((current) => ({ ...current, followUp: event.target.value }))}
            />
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <div className="button-row">
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await createActivityAction(form);
                    setMessage(result.ok ? "Activity saved." : result.error);
                    if (result.ok) {
                      setForm(blankActivity(team));
                      setIsCreating(false);
                      router.refresh();
                    }
                  })
                }
              >
                Save Activity
              </Button>
              <Button tone="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="button-row">
        {["all", ...ACTIVITY_TYPES].map((type) => (
          <Button
            key={type}
            size="small"
            tone={selectedType === type ? "primary" : "ghost"}
            onClick={() => setSelectedType(type as typeof selectedType)}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid cols-2">
        {filtered.map((activity) => (
          <Card key={activity.id}>
            <div className="list-row">
              <div>
                <div>{activity.title}</div>
                <div className="list-meta">
                  {activity.location}, {activity.district} · {formatDisplayDate(activity.date)}
                </div>
              </div>
              <div className="chip-row">
                <Badge tone="blue">{activity.type}</Badge>
                <Badge tone={activity.status === "completed" ? "green" : activity.status === "planned" ? "blue" : "accent"}>
                  {activity.status}
                </Badge>
              </div>
            </div>

            <div className="button-row" style={{ marginTop: 12 }}>
              <Badge>{activity.beneficiaries} beneficiaries</Badge>
              <Badge tone="purple">{activity.participants.length} registered</Badge>
              <Badge tone="accent">{activity.casesIdentified} cases</Badge>
            </div>

            {activity.summary ? (
              <p className="support-text" style={{ marginTop: 12 }}>
                {activity.summary}
              </p>
            ) : null}
            {activity.followUp ? (
              <p className="support-text" style={{ marginTop: 8, color: "var(--accent)" }}>
                Follow-up: {activity.followUp}
              </p>
            ) : null}

            <div className="stack" style={{ marginTop: 14 }}>
              <div className="list-row">
                <div className="list-meta">Participants ({activity.participants.length})</div>
                <Button
                  size="small"
                  tone="ghost"
                  onClick={() => setBulkTarget((current) => (current === activity.id ? null : activity.id))}
                >
                  {bulkTarget === activity.id ? "Close" : "Bulk Add"}
                </Button>
              </div>

              {bulkTarget === activity.id ? (
                <div className="stack">
                  <TextAreaField
                    label="One per line: Name, Phone"
                    value={bulkText}
                    onChange={(event) => setBulkText(event.target.value)}
                  />
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        const lines = bulkText
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [name, phone = ""] = line.split(",");
                            return { name: name.trim(), phone: phone.trim() };
                          });

                        const result = await addParticipantsBulkAction({
                          activityId: activity.id,
                          lines,
                        });
                        setMessage(result.ok ? "Participants added." : result.error);
                        if (result.ok) {
                          setBulkText("");
                          setBulkTarget(null);
                          router.refresh();
                        }
                      })
                    }
                  >
                    Add Participants
                  </Button>
                </div>
              ) : null}

              {activity.participants.map((participant) => (
                <div className="table-row" key={participant.id}>
                  <div>{participant.name}</div>
                  <div className="list-meta">{participant.phone || "—"}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
