"use client";

import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectField, TextAreaField } from "@/components/ui/field";
import type { CaseRecord } from "@/lib/domain/types";

type DrafterPageProps = {
  cases: CaseRecord[];
};

export function DrafterPage({ cases }: DrafterPageProps) {
  const [docType, setDocType] = useState("Criminal Writ Petition");
  const [linkedCaseId, setLinkedCaseId] = useState("");
  const [directions, setDirections] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const linkedCase = cases.find((caseRecord) => caseRecord.id === linkedCaseId) ?? null;

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Drafting"
        title="Server-side legal drafting with case-linked context."
        copy="Generate court-facing drafts against stored facts, grounds, and relief without exposing provider keys in the browser."
      />

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Senior Advocate Mode</span>
          <div className="form-grid">
            <SelectField
              label="Document Type"
              value={docType}
              onChange={(event) => setDocType(event.target.value)}
              options={[
                "Criminal Writ Petition",
                "PIL",
                "Anticipatory Bail Application",
                "Regular Bail Application",
                "Application u/s 156(3) CrPC",
                "Application u/s 482 CrPC",
                "Representation to SP / DM",
                "Legal Notice",
                "Affidavit",
                "Revision Petition",
                "Criminal Appeal",
                "Contempt Petition",
                "Protection Order Application (PWDVA)",
                "Compensation Petition",
                "Habeas Corpus",
              ]}
            />
            <SelectField
              label="Link Case"
              value={linkedCaseId}
              onChange={(event) => setLinkedCaseId(event.target.value)}
              options={[{ label: "— None —", value: "" }, ...cases.map((caseRecord) => ({ label: caseRecord.client, value: caseRecord.id }))]}
            />
            <TextAreaField
              label="Advocate Directions"
              value={directions}
              onChange={(event) => setDirections(event.target.value)}
            />
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const response = await fetch("/api/ai/draft", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      docType,
                      directions,
                      caseRecord: linkedCase
                        ? {
                            title: linkedCase.title,
                            client: linkedCase.client,
                            respondent: linkedCase.respondent,
                            court: linkedCase.court,
                            caseNo: linkedCase.caseNo,
                            firNo: linkedCase.firNo,
                            facts: linkedCase.facts,
                            grounds: linkedCase.grounds,
                            relief: linkedCase.relief,
                          }
                        : null,
                    }),
                  });
                  const result = (await response.json()) as { text?: string; error?: string };
                  if (!response.ok || !result.text) {
                    setMessage(result.error ?? "Draft generation failed.");
                    return;
                  }
                  setOutput(result.text);
                  setMessage("Draft generated.");
                })
              }
            >
              Draft Document
            </Button>
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Draft Output</span>
          {output ? (
            <div className="legal-output">{output}</div>
          ) : (
            <div className="empty-state">
              Choose a document type, optionally link a case, and provide directions to generate a draft.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
