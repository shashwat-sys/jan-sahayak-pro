"use client";

import { useDeferredValue, useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField, TextAreaField } from "@/components/ui/field";
import { LEGAL_OUTPUT_MODES } from "@/lib/domain/constants";
import type { CaseRecord, LegalOutputMode, LegalSourceRecord } from "@/lib/domain/types";
import { formatDisplayDate } from "@/lib/utils/date";

type LegalKnowledgePageProps = {
  cases: CaseRecord[];
  legalSources: LegalSourceRecord[];
};

type KnowledgeResponse = {
  text?: string;
  error?: string;
  sources?: LegalSourceRecord[];
};

const MODE_LABELS: Record<LegalOutputMode, string> = {
  statutory_explainer: "Statutory Explainer",
  case_digest: "Case Digest",
  training_module: "Training Module",
  flash_cards: "Flash Cards",
  campaign_brief: "Campaign Brief",
  legal_aid_checklist: "Legal-Aid Checklist",
};

function matchesSourceSearch(source: LegalSourceRecord, term: string) {
  if (!term) {
    return true;
  }

  const haystack = [
    source.title,
    source.citation,
    source.jurisdiction,
    source.issuingAuthority,
    source.plainLanguageSummary,
    source.tags.join(" "),
    source.audienceTags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

function SourceCard({ source }: { source: LegalSourceRecord }) {
  return (
    <div className="list-card">
      <div className="list-row">
        <div>
          <div>{source.title}</div>
          <div className="list-meta">
            {source.documentType.replaceAll("_", " ")} · {source.jurisdiction} ·{" "}
            {source.datePublished ? formatDisplayDate(source.datePublished) : "Undated"}
          </div>
        </div>
        <div className="chip-row">
          <Badge>{source.sourceKind}</Badge>
          <Badge tone="blue">{source.status}</Badge>
        </div>
      </div>
      <div className="support-text" style={{ marginTop: 10 }}>
        {source.plainLanguageSummary}
      </div>
      <div className="chip-row" style={{ marginTop: 12 }}>
        {source.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} tone="purple">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="support-text" style={{ marginTop: 10 }}>
        {source.issuingAuthority}
        {source.citation ? ` · ${source.citation}` : ""}
      </div>
    </div>
  );
}

export function LegalKnowledgePage({ cases, legalSources }: LegalKnowledgePageProps) {
  const [mode, setMode] = useState<LegalOutputMode>("statutory_explainer");
  const [audience, setAudience] = useState("District legal fellows and social workers");
  const [linkedCaseId, setLinkedCaseId] = useState("");
  const [request, setRequest] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [retrievedSources, setRetrievedSources] = useState<LegalSourceRecord[]>([]);
  const [isPending, startTransition] = useTransition();

  const linkedCase = cases.find((caseRecord) => caseRecord.id === linkedCaseId) ?? null;
  const deferredLibrarySearch = useDeferredValue(librarySearch.trim().toLowerCase());
  const visibleSources = legalSources.filter((source) =>
    matchesSourceSearch(source, deferredLibrarySearch),
  );

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Knowledge"
        title="Grounded legal knowledge studio."
        copy="Retrieve from curated laws, schemes, case-law notes, and field protocols before generating explainers, checklists, campaign briefs, or training content."
        meta={`${legalSources.length} legal sources are currently available in the studio.`}
      />

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Studio Controls</span>
          <div className="form-grid">
            <SelectField
              label="Output Mode"
              value={mode}
              onChange={(event) => setMode(event.target.value as LegalOutputMode)}
              options={LEGAL_OUTPUT_MODES.map((value) => ({
                label: MODE_LABELS[value],
                value,
              }))}
            />
            <InputField
              label="Audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            />
            <SelectField
              label="Link Case"
              value={linkedCaseId}
              onChange={(event) => setLinkedCaseId(event.target.value)}
              options={[
                { label: "— None —", value: "" },
                ...cases.map((caseRecord) => ({
                  label: `${caseRecord.client} · ${caseRecord.court}`,
                  value: caseRecord.id,
                })),
              ]}
            />
            <TextAreaField
              label="Request"
              placeholder="Example: Build a training module on domestic violence intake for district fellows, with immediate referral points and core legal safeguards."
              value={request}
              onChange={(event) => setRequest(event.target.value)}
            />
            {message ? (
              <div className="support-text" style={{ color: "var(--accent)" }}>
                {message}
              </div>
            ) : null}
            <Button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const response = await fetch("/api/ai/knowledge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      mode,
                      audience,
                      request,
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
                  const result = (await response.json()) as KnowledgeResponse;
                  if (!response.ok || !result.text) {
                    setMessage(result.error ?? "Grounded generation failed.");
                    return;
                  }

                  setOutput(result.text);
                  setRetrievedSources(result.sources ?? []);
                  setMessage(`Generated ${MODE_LABELS[mode].toLowerCase()} with grounded sources.`);
                })
              }
            >
              Generate Grounded Output
            </Button>
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Output</span>
          {output ? (
            <div className="legal-output">{output}</div>
          ) : (
            <div className="empty-state">
              Choose an output mode, describe the legal task, and generate a grounded response with visible supporting sources.
            </div>
          )}
        </Card>
      </div>

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Retrieved Sources</span>
          {retrievedSources.length === 0 ? (
            <div className="empty-state">
              The generator will show the top matched laws, cases, schemes, or field protocols here after a run.
            </div>
          ) : (
            <div className="stack">
              {retrievedSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <span className="section-kicker">Source Shelf</span>
          <div className="form-grid">
            <InputField
              label="Search Sources"
              placeholder="Search by issue, law, scheme, or audience"
              value={librarySearch}
              onChange={(event) => setLibrarySearch(event.target.value)}
            />
          </div>
          <div className="stack" style={{ marginTop: 14 }}>
            {visibleSources.length === 0 ? (
              <div className="empty-state">No sources match this search yet.</div>
            ) : (
              visibleSources.slice(0, 8).map((source) => <SourceCard key={source.id} source={source} />)
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
