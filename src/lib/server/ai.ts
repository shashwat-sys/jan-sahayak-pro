import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import type {
  CaseRecord,
  LegalOutputMode,
  LegalSourceRecord,
  ReportType,
  TeamMemberRecord,
} from "@/lib/domain/types";
import { buildFinanceSummary } from "@/lib/server/analytics";
import { isAnthropicConfigured } from "@/lib/server/env";
import {
  buildFallbackGroundedOutput,
  formatLegalSourceCitation,
} from "@/lib/server/legal-knowledge";

function getModel() {
  if (!isAnthropicConfigured()) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  return anthropic("claude-sonnet-4-5");
}

export async function generateLegalDraft(args: {
  docType: string;
  directions: string;
  caseRecord: Pick<
    CaseRecord,
    "title" | "client" | "respondent" | "court" | "caseNo" | "firNo" | "facts" | "grounds" | "relief"
  > | null;
}) {
  const prompt = args.caseRecord
    ? `Draft a ${args.docType} for ${args.caseRecord.client} v. ${args.caseRecord.respondent} before ${args.caseRecord.court}.

Case title: ${args.caseRecord.title}
Case number: ${args.caseRecord.caseNo || "Pending"}
FIR: ${args.caseRecord.firNo || "N/A"}

Facts:
${args.caseRecord.facts}

Grounds:
${args.caseRecord.grounds}

Relief:
${args.caseRecord.relief}

Advocate directions:
${args.directions}`
    : `Draft a ${args.docType}. Directions: ${args.directions}`;

  const { text } = await generateText({
    model: getModel(),
    system:
      "You are a senior advocate working with Janman Peoples Foundation - Jan Nyaya Abhiyan. Draft formal Indian legal documents with a court heading, party details, concise facts, legal grounds with citations, and a prayer clause. Do not invent facts beyond the provided record.",
    prompt,
  });

  return text;
}

export async function generateMonthlySummary(args: {
  member: string;
  month: string;
  role: string;
  type: "lawyer" | "social_worker";
  data: Record<string, string>;
}) {
  const { text } = await generateText({
    model: getModel(),
    system:
      "You write concise, professional programme reports for Janman Peoples Foundation. Keep the tone formal, specific, and suitable for leadership review.",
    prompt: `Generate a monthly activity summary for ${args.member} (${args.role}) for ${args.month}.

Report type: ${args.type}
Submitted data:
${JSON.stringify(args.data, null, 2)}

Structure the response with:
1. Activity Summary
2. Key Achievements
3. Challenges
4. Next Month Priorities`,
  });

  return text;
}

export async function generateProgrammeReport(args: {
  type: ReportType;
  period: string;
  cases: string[];
  activities: string[];
  team: string[];
  financeEntries: Array<{ type: "grant" | "expense"; amount: number; description: string }>;
  beneficiaries: number;
}) {
  const finance = buildFinanceSummary(
    args.financeEntries.map((entry, index) => ({
      id: `finance-${index}`,
      date: "2025-01-01",
      type: entry.type,
      amount: entry.amount,
      category: entry.type === "grant" ? "Core Grant" : "Other",
      project: "Jan Nyaya Abhiyan",
      description: entry.description,
      approvedBy: "System",
    })),
  );

  const promptMap: Record<ReportType, string> = {
    donor: `Write a formal donor progress report for ${args.period} for APPI.

Cases:
${args.cases.join("\n")}

Activities:
${args.activities.join("\n")}

Team:
${args.team.join("\n")}

Finance summary:
Total grants: Rs ${finance.totalGrants}
Total expenses: Rs ${finance.totalExpenses}
Balance: Rs ${finance.balance}
Beneficiaries: ${args.beneficiaries}

Use sections: Executive Summary, Programme Highlights, Case Docket Update, Field Activities, Fellowship Update, Financial Utilisation, Challenges, and Way Forward.`,
    appi: `Write the Annual Progress Report in APPI format for ${args.period}.

Cases:
${args.cases.join("\n")}

Activities:
${args.activities.join("\n")}

Team:
${args.team.join("\n")}

Finance summary:
Total grants: Rs ${finance.totalGrants}
Total expenses: Rs ${finance.totalExpenses}
Balance: Rs ${finance.balance}
Beneficiaries: ${args.beneficiaries}

Structure:
1. Progress against indicators
2. Annual narrative report
3. Fund utilisation report
4. Challenges and course corrections`,
    internal: `Write a concise internal operational status brief for ${args.period}.

Cases:
${args.cases.join("\n")}

Activities:
${args.activities.join("\n")}

Team:
${args.team.join("\n")}

Finance summary:
Total grants: Rs ${finance.totalGrants}
Total expenses: Rs ${finance.totalExpenses}
Balance: Rs ${finance.balance}
Beneficiaries: ${args.beneficiaries}

Focus on case status, overdue matters, team accountability, financial position, and next-month priorities.`,
  };

  const { text } = await generateText({
    model: getModel(),
    system:
      "You write programme reports for access-to-justice initiatives in India. Keep them structured, data-aware, and formal.",
    prompt: promptMap[args.type],
  });

  return text;
}

export async function generateOfferLetter(teamMember: Pick<TeamMemberRecord, "name" | "role" | "loc" | "dist" | "join" | "qual">) {
  const { text } = await generateText({
    model: getModel(),
    system:
      "You are drafting appointment and consultancy letters for Janman Peoples Foundation. Write formal organisational English suitable for an internal HR/legal record.",
    prompt: `Draft a consultancy engagement letter for:
Name: ${teamMember.name}
Role: ${teamMember.role}
Location: ${teamMember.loc}, ${teamMember.dist}
Join Date: ${teamMember.join}
Qualification: ${teamMember.qual}

Include:
- Appointment details
- Core responsibilities
- Reporting to Shashwat and Roshin Jacob
- Duration of 18 months
- District fellow remuneration of Rs 25,000 per month
- Confidentiality obligations
- Signature blocks`,
  });

  return text;
}

export async function generateGroundedLegalKnowledge(args: {
  mode: LegalOutputMode;
  audience: string;
  request: string;
  caseRecord: Pick<
    CaseRecord,
    "title" | "client" | "respondent" | "court" | "caseNo" | "firNo" | "facts" | "grounds" | "relief"
  > | null;
  sources: LegalSourceRecord[];
}) {
  const caseContext = args.caseRecord
    ? `Case title: ${args.caseRecord.title}
Client: ${args.caseRecord.client}
Respondent: ${args.caseRecord.respondent}
Court: ${args.caseRecord.court}
Case number: ${args.caseRecord.caseNo || "Pending"}
FIR: ${args.caseRecord.firNo || "N/A"}

Facts:
${args.caseRecord.facts}

Grounds:
${args.caseRecord.grounds}

Relief:
${args.caseRecord.relief}`
    : null;

  if (!isAnthropicConfigured()) {
    return buildFallbackGroundedOutput({
      mode: args.mode,
      audience: args.audience,
      request: args.request,
      caseContext,
      sources: args.sources,
    });
  }

  const sourceBlock = args.sources
    .map(
      (source, index) => `[Source ${index + 1}]
${formatLegalSourceCitation(source)}
Authority: ${source.issuingAuthority}
Summary: ${source.plainLanguageSummary}
Content:
${source.content}`,
    )
    .join("\n\n");

  const { text } = await generateText({
    model: getModel(),
    system:
      "You are a legal knowledge and training specialist for Janman Peoples Foundation and Jan Nyaya Abhiyan. Use only the provided sources. Do not invent legal propositions, dates, holdings, or procedural steps. Keep the output practical, plain-language, and safe. Cite substantial claims inline as [Source 1], [Source 2], etc. If the sources do not establish a point, say that the available sources are insufficient. Do not present the result as personal legal advice.",
    prompt: `Create a ${args.mode.replaceAll("_", " ")} for ${args.audience}.

User request:
${args.request}

${caseContext ? `Linked case context:\n${caseContext}\n` : ""}
Grounded sources:
${sourceBlock}

Requirements:
- Use the user's requested mode and audience.
- Keep exact dates only when a source provides them.
- End with a short "Sources used" section listing every source you relied on.
- Separate legal analysis from campaign language if both appear in the request.`,
  });

  return text;
}
