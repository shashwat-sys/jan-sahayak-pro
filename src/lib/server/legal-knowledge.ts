import type { LegalOutputMode, LegalSourceRecord } from "@/lib/domain/types";

type SelectLegalSourcesArgs = {
  audience: string;
  request: string;
  caseContext?: string | null;
  limit?: number;
};

type BuildFallbackGroundedOutputArgs = {
  mode: LegalOutputMode;
  audience: string;
  request: string;
  caseContext?: string | null;
  sources: LegalSourceRecord[];
};

const MODE_LABELS: Record<LegalOutputMode, string> = {
  statutory_explainer: "Statutory Explainer",
  case_digest: "Case Digest",
  training_module: "Training Module",
  flash_cards: "Flash Cards",
  campaign_brief: "Campaign Brief",
  legal_aid_checklist: "Legal-Aid Checklist",
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function tokenize(value: string) {
  return [...new Set(normalizeText(value).split(/\s+/).filter((token) => token.length > 2))];
}

function scoreSource(source: LegalSourceRecord, fullQuery: string, tokens: string[]) {
  const title = normalizeText(source.title);
  const summary = normalizeText(source.plainLanguageSummary);
  const content = normalizeText(source.content);
  const tags = source.tags.map(normalizeText);
  const audiences = source.audienceTags.map(normalizeText);
  const citation = normalizeText(source.citation);
  const exactQuery = normalizeText(fullQuery).trim();

  let score = 0;

  if (exactQuery && title.includes(exactQuery)) {
    score += 12;
  }

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 6;
    }
    if (citation.includes(token)) {
      score += 4;
    }
    if (tags.some((tag) => tag.includes(token))) {
      score += 5;
    }
    if (audiences.some((audience) => audience.includes(token))) {
      score += 4;
    }
    if (summary.includes(token)) {
      score += 3;
    }
    if (content.includes(token)) {
      score += 2;
    }
  }

  return score;
}

export function formatLegalSourceCitation(source: LegalSourceRecord) {
  const details = [
    source.citation || source.documentType.replaceAll("_", " "),
    source.jurisdiction,
    source.datePublished,
  ].filter(Boolean);

  return details.length > 0 ? `${source.title} · ${details.join(" · ")}` : source.title;
}

export function selectLegalSources(sources: LegalSourceRecord[], args: SelectLegalSourcesArgs) {
  const fullQuery = [args.request, args.audience, args.caseContext].filter(Boolean).join(" ");
  const tokens = tokenize(fullQuery);

  return sources
    .map((source) => ({
      source,
      score: scoreSource(source, fullQuery, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.source.title.localeCompare(right.source.title);
    })
    .slice(0, args.limit ?? 4)
    .map((entry) => entry.source);
}

function buildModeSections(mode: LegalOutputMode) {
  switch (mode) {
    case "statutory_explainer":
      return [
        "1. What this law or framework covers",
        "2. Who it affects",
        "3. Key rights, duties, or procedures",
        "4. Practical field implications",
        "5. Sources used",
      ];
    case "case_digest":
      return [
        "1. Core issue",
        "2. What the source material establishes",
        "3. Why it matters for field strategy",
        "4. Limits or unanswered questions",
        "5. Sources used",
      ];
    case "training_module":
      return [
        "1. Learning objectives",
        "2. Key concepts",
        "3. Trainer notes",
        "4. Practice scenario",
        "5. Sources used",
      ];
    case "flash_cards":
      return [
        "1. Card set title",
        "2. 5 to 7 question-answer cards",
        "3. One scenario card",
        "4. Sources used",
      ];
    case "campaign_brief":
      return [
        "1. Issue in plain language",
        "2. Legal basis",
        "3. Message for the campaign team",
        "4. Safe claims only",
        "5. Sources used",
      ];
    case "legal_aid_checklist":
      return [
        "1. Immediate intake questions",
        "2. Documents or proof to collect",
        "3. Risk flags",
        "4. Referral or filing path",
        "5. Sources used",
      ];
  }
}

export function buildFallbackGroundedOutput(args: BuildFallbackGroundedOutputArgs) {
  const sourceNotes = args.sources
    .map(
      (source, index) =>
        `${index + 1}. ${formatLegalSourceCitation(source)}\n   ${source.plainLanguageSummary}`,
    )
    .join("\n");

  const caseSection = args.caseContext
    ? `\nLinked case context:\n${args.caseContext}\n`
    : "";

  return `${MODE_LABELS[args.mode]}

Audience: ${args.audience}
Request: ${args.request}${caseSection}
Use this grounded outline:
${buildModeSections(args.mode).join("\n")}

Key grounded notes:
${args.sources
  .slice(0, 3)
  .map(
    (source, index) =>
      `- [Source ${index + 1}] ${source.title}: ${source.plainLanguageSummary}`,
  )
  .join("\n")}

Sources used:
${sourceNotes}`;
}
