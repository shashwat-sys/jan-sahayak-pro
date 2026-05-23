"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField, TextAreaField } from "@/components/ui/field";
import { createTeamMemberAction, setTeamMemberStatusAction } from "@/lib/actions/team";
import { BIHAR_DISTRICTS, TEAM_TYPES } from "@/lib/domain/constants";
import type { TaskRecord, TeamMemberRecord } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/utils/date";

type TeamPageProps = {
  tasks: TaskRecord[];
  team: TeamMemberRecord[];
};

type TeamFormState = {
  name: string;
  role: string;
  type: TeamMemberRecord["type"];
  loc: string;
  dist: string;
  phone: string;
  email: string;
  qual: string;
  join: string;
  bio: string;
};

function blankTeamMember(): TeamFormState {
  return {
    name: "",
    role: "",
    type: "fellow" as const,
    loc: "",
    dist: BIHAR_DISTRICTS[0],
    phone: "",
    email: "",
    qual: "",
    join: new Date().toISOString().slice(0, 10),
    bio: "",
  };
}

export function TeamPage({ tasks, team }: TeamPageProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(team[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TeamFormState>(blankTeamMember());
  const [offerLetter, setOfferLetter] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedMember = team.find((member) => member.id === selectedId) ?? null;
  const selectedTasks = tasks.filter((task) => task.assignedTo === selectedMember?.name && task.status !== "done");

  return (
    <div className="page-stack">
      <PageHeader
        kicker="People"
        title="Team registry, assignments, and offer letters."
        copy="Manage active and terminated members, review pending work, and generate appointment text without exposing mail integrations in v1."
        actions={<Button onClick={() => setShowForm((current) => !current)}>{showForm ? "Close Form" : "Add Member"}</Button>}
      />

      {showForm ? (
        <Card>
          <span className="section-kicker">New Team Member</span>
          <div className="form-grid">
            <div className="grid cols-3">
              <InputField label="Full Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              <InputField label="Role / Designation" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} />
              <SelectField label="Type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as typeof form.type }))} options={[...TEAM_TYPES]} />
            </div>
            <div className="grid cols-3">
              <InputField label="Location" value={form.loc} onChange={(event) => setForm((current) => ({ ...current, loc: event.target.value }))} />
              <SelectField label="District" value={form.dist} onChange={(event) => setForm((current) => ({ ...current, dist: event.target.value as typeof form.dist }))} options={[...BIHAR_DISTRICTS]} />
              <InputField label="Join Date" type="date" value={form.join} onChange={(event) => setForm((current) => ({ ...current, join: event.target.value }))} />
            </div>
            <div className="grid cols-2">
              <InputField label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              <InputField label="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <InputField label="Qualification" value={form.qual} onChange={(event) => setForm((current) => ({ ...current, qual: event.target.value }))} />
            <TextAreaField label="Biography" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const result = await createTeamMemberAction(form);
                  setMessage(result.ok ? "Team member added." : result.error);
                  if (result.ok) {
                    setForm(blankTeamMember());
                    setShowForm(false);
                    router.refresh();
                  }
                })
              }
            >
              Add to Registry
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Registry</span>
          <div className="stack">
            {team.map((member) => (
              <button
                className="list-card"
                key={member.id}
                onClick={() => setSelectedId(member.id)}
                style={{ textAlign: "left", cursor: "pointer" }}
              >
                <div className="list-row">
                  <div>
                    <div>{member.name}</div>
                    <div className="list-meta">
                      {member.role} · {member.uid}
                    </div>
                    <div className="list-meta">
                      {member.loc}, {member.dist}
                    </div>
                  </div>
                  <div className="chip-row">
                    <Badge tone="blue">{member.type}</Badge>
                    <Badge tone={member.status === "active" ? "green" : "red"}>{member.status}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Profile</span>
          {selectedMember ? (
            <div className="stack">
              <div>
                <div className="page-title" style={{ fontSize: "1.5rem" }}>{selectedMember.name}</div>
                <p className="page-copy">{selectedMember.role}</p>
              </div>
              <div className="button-row">
                <Badge>{selectedMember.uid}</Badge>
                <Badge tone="blue">{selectedMember.type}</Badge>
                <Badge tone={selectedMember.status === "active" ? "green" : "red"}>
                  {selectedMember.status}
                </Badge>
              </div>
              <div className="support-text">
                {selectedMember.loc}, {selectedMember.dist} · Joined {formatDisplayDate(selectedMember.join)}
              </div>
              <div className="support-text">{selectedMember.qual}</div>
              <div className="support-text">{selectedMember.bio}</div>

              <div className="button-row">
                {selectedMember.status === "active" ? (
                  <Button
                    tone="danger"
                    size="small"
                    onClick={() =>
                      startTransition(async () => {
                        await setTeamMemberStatusAction(selectedMember.id, "terminated");
                        router.refresh();
                      })
                    }
                  >
                    Terminate
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() =>
                      startTransition(async () => {
                        await setTeamMemberStatusAction(selectedMember.id, "active");
                        router.refresh();
                      })
                    }
                  >
                    Reactivate
                  </Button>
                )}
                <Button
                  tone="secondary"
                  size="small"
                  onClick={() =>
                    startTransition(async () => {
                      const response = await fetch("/api/ai/offer-letter", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          teamMember: {
                            name: selectedMember.name,
                            role: selectedMember.role,
                            loc: selectedMember.loc,
                            dist: selectedMember.dist,
                            join: selectedMember.join,
                            qual: selectedMember.qual,
                          },
                        }),
                      });
                      const result = (await response.json()) as { text?: string; error?: string };
                      if (!response.ok || !result.text) {
                        setMessage(result.error ?? "Offer letter generation failed.");
                        return;
                      }
                      setOfferLetter(result.text);
                      setMessage("Offer letter generated.");
                    })
                  }
                >
                  Generate Offer Letter
                </Button>
              </div>

              <Card compact>
                <span className="section-kicker">Assigned Tasks</span>
                <div className="stack">
                  {selectedTasks.length === 0 ? (
                    <div className="support-text">No pending tasks assigned.</div>
                  ) : (
                    selectedTasks.map((task) => (
                      <div className="table-row" key={task.id}>
                        <div>
                          <div>{task.title}</div>
                          <div className="list-meta">{formatDisplayDate(task.deadline)}</div>
                        </div>
                        <Badge>{task.priority}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card compact>
                <span className="section-kicker">Offer Letter</span>
                {offerLetter ? (
                  <div className="legal-output">{offerLetter}</div>
                ) : (
                  <div className="support-text">
                    Generate a consultancy / appointment letter for this member.
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="empty-state">Select a team member to view profile details.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
