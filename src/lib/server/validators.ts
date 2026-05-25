import { z } from "zod";

import {
  ACTIVITY_STATUSES,
  ACTIVITY_TYPES,
  BIHAR_DISTRICTS,
  CASE_STATUSES,
  CASE_TYPES,
  COURTS,
  EXPENSE_CATEGORIES,
  GRANT_CATEGORIES,
  LEGAL_OUTPUT_MODES,
  MONTHLY_REPORT_KINDS,
  PRIORITIES,
  REPORT_TYPES,
  TEAM_TYPES,
} from "@/lib/domain/constants";

const nonEmptyString = z.string().trim().min(1);

export const caseInputSchema = z.object({
  title: nonEmptyString,
  client: nonEmptyString,
  respondent: nonEmptyString,
  court: z.enum(COURTS),
  caseNo: z.string().trim(),
  firNo: z.string().trim(),
  section: z.string().trim(),
  ps: z.string().trim(),
  type: z.enum(CASE_TYPES),
  district: z.enum(BIHAR_DISTRICTS),
  advocate: nonEmptyString,
  worker: z.string().trim(),
  status: z.enum(CASE_STATUSES),
  priority: z.enum(PRIORITIES),
  facts: z.string().trim(),
  grounds: z.string().trim(),
  relief: z.string().trim(),
});

export const caseDiaryInputSchema = z.object({
  action: nonEmptyString,
  by: nonEmptyString,
  notes: z.string().trim(),
});

export const hearingInputSchema = z.object({
  date: nonEmptyString,
  court: nonEmptyString,
  purpose: z.string().trim(),
  outcome: z.string().trim(),
  nextDate: z.string().trim().optional().or(z.literal("")),
  by: nonEmptyString,
});

export const taskInputSchema = z.object({
  title: nonEmptyString,
  assignedTo: nonEmptyString,
  caseId: z.string().trim().optional().nullable(),
  deadline: nonEmptyString,
  priority: z.enum(PRIORITIES),
  notes: z.string().trim(),
});

export const activityInputSchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  title: nonEmptyString,
  location: nonEmptyString,
  district: z.enum(BIHAR_DISTRICTS),
  date: nonEmptyString,
  coordinator: nonEmptyString,
  beneficiaries: z.coerce.number().int().min(0),
  casesIdentified: z.coerce.number().int().min(0),
  casesReferred: z.coerce.number().int().min(0),
  summary: z.string().trim(),
  status: z.enum(ACTIVITY_STATUSES),
  followUp: z.string().trim(),
});

export const participantBulkInputSchema = z.object({
  activityId: nonEmptyString,
  lines: z.array(
    z.object({
      name: nonEmptyString,
      phone: z.string().trim(),
    }),
  ),
});

export const financeInputSchema = z.object({
  date: nonEmptyString,
  type: z.enum(["grant", "expense"]),
  amount: z.coerce.number().int().positive(),
  category: z.enum([...GRANT_CATEGORIES, ...EXPENSE_CATEGORIES] as [string, ...string[]]),
  project: nonEmptyString,
  description: nonEmptyString,
  approvedBy: nonEmptyString,
});

export const monthlyReportInputSchema = z.object({
  member: nonEmptyString,
  month: z.string().regex(/^\d{4}-\d{2}$/),
  type: z.enum(MONTHLY_REPORT_KINDS),
  data: z.record(z.string(), z.string()),
});

export const teamMemberInputSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  type: z.enum(TEAM_TYPES),
  loc: nonEmptyString,
  dist: z.enum(BIHAR_DISTRICTS),
  phone: z.string().trim(),
  email: z.string().trim(),
  qual: z.string().trim(),
  join: nonEmptyString,
  bio: z.string().trim(),
});

export const drafterRequestSchema = z.object({
  docType: nonEmptyString,
  directions: nonEmptyString,
  caseRecord: z
    .object({
      title: nonEmptyString,
      client: nonEmptyString,
      respondent: nonEmptyString,
      court: nonEmptyString,
      caseNo: z.string().trim(),
      firNo: z.string().trim(),
      facts: z.string().trim(),
      grounds: z.string().trim(),
      relief: z.string().trim(),
    })
    .nullable(),
});

export const summaryRequestSchema = z.object({
  member: nonEmptyString,
  month: z.string().regex(/^\d{4}-\d{2}$/),
  role: nonEmptyString,
  type: z.enum(MONTHLY_REPORT_KINDS),
  data: z.record(z.string(), z.string()),
});

export const reportRequestSchema = z.object({
  type: z.enum(REPORT_TYPES),
  period: nonEmptyString,
  context: z.object({
    cases: z.array(z.string()),
    activities: z.array(z.string()),
    team: z.array(z.string()),
    finance: z.object({
      totalGrants: z.number(),
      totalExpenses: z.number(),
      balance: z.number(),
      beneficiaries: z.number(),
    }),
  }),
});

export const offerLetterRequestSchema = z.object({
  teamMember: z.object({
    name: nonEmptyString,
    role: nonEmptyString,
    loc: nonEmptyString,
    dist: nonEmptyString,
    join: nonEmptyString,
    qual: z.string().trim(),
  }),
});

export const knowledgeRequestSchema = z.object({
  mode: z.enum(LEGAL_OUTPUT_MODES),
  audience: nonEmptyString,
  request: nonEmptyString,
  caseRecord: z
    .object({
      title: nonEmptyString,
      client: nonEmptyString,
      respondent: nonEmptyString,
      court: nonEmptyString,
      caseNo: z.string().trim(),
      firNo: z.string().trim(),
      facts: z.string().trim(),
      grounds: z.string().trim(),
      relief: z.string().trim(),
    })
    .nullable(),
});

export const publicIssueRequestSchema = z.object({
  name: nonEmptyString,
  phone: nonEmptyString,
  location: z.string().trim(),
  district: z.enum(BIHAR_DISTRICTS),
  issue: nonEmptyString,
  issueType: z.enum(["legal", "welfare", "both"]),
});

export const publicIssueTriageSchema = z.object({
  type: z.enum(["legal", "welfare"]),
  urgency: z.enum(["high", "normal"]),
  summary: nonEmptyString,
  hi_summary: nonEmptyString,
  issues: z.array(nonEmptyString).min(1).max(5),
  next_steps: z.array(nonEmptyString).min(1).max(5),
  hi_next_steps: z.array(nonEmptyString).min(1).max(5),
});

export const publicEligibilityProfileSchema = z.object({
  name: z.string().trim(),
  phone: z.string().trim(),
  district: z.enum(BIHAR_DISTRICTS),
  residence: z.enum(["rural", "urban"]),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(["female", "male", "transgender", "other"]),
  annualIncome: z.coerce.number().min(0),
  socialCategory: z.enum(["general", "obc", "ebc", "sc", "st", "minority"]),
  occupation: z.string().trim(),
  isStudent: z.boolean(),
  isPregnant: z.boolean(),
  isWidowed: z.boolean(),
  hasDisability: z.boolean(),
  disabilityPercent: z.coerce.number().min(0).max(100),
  housingStatus: z.enum(["no_house", "kutcha", "semi_pucca", "pucca", "rented"]),
  hasRationCard: z.boolean(),
  hasBankAccount: z.boolean(),
  hasAadhaar: z.boolean(),
  isLandless: z.boolean(),
  needsMedicalSupport: z.boolean(),
});

export const publicEligibilityRecommendationSchema = z.object({
  id: nonEmptyString,
  category: nonEmptyString,
  name: nonEmptyString,
  hi_name: nonEmptyString,
  status: z.enum(["likely", "check", "not_now"]),
  reasons: z.array(nonEmptyString).min(1).max(4),
  hi_reasons: z.array(nonEmptyString).min(1).max(4),
  docs: z.array(nonEmptyString).min(1).max(6),
  hi_docs: z.array(nonEmptyString).min(1).max(6),
  apply: nonEmptyString,
  hi_apply: nonEmptyString,
  officialUrl: z.string().url(),
});

export const publicEligibilityResponseSchema = z.object({
  summary: nonEmptyString,
  hi_summary: nonEmptyString,
  recommendations: z.array(publicEligibilityRecommendationSchema).min(1).max(6),
  workflow: z.array(nonEmptyString).min(3).max(5),
  hi_workflow: z.array(nonEmptyString).min(3).max(5),
});

export const publicComplaintAssistRequestSchema = z.object({
  name: nonEmptyString,
  phone: nonEmptyString,
  district: z.enum(BIHAR_DISTRICTS),
  benefit: nonEmptyString,
  authority: nonEmptyString,
  grievanceType: nonEmptyString,
  incidentDate: nonEmptyString,
  location: z.string().trim(),
  facts: nonEmptyString,
  documentsAvailable: z.string().trim(),
  reliefWanted: z.string().trim(),
});

export const publicComplaintAssistResponseSchema = z.object({
  subject: nonEmptyString,
  hi_subject: nonEmptyString,
  summary: nonEmptyString,
  hi_summary: nonEmptyString,
  facts: z.array(nonEmptyString).min(2).max(5),
  hi_facts: z.array(nonEmptyString).min(2).max(5),
  reliefs: z.array(nonEmptyString).min(2).max(5),
  hi_reliefs: z.array(nonEmptyString).min(2).max(5),
  documents_to_attach: z.array(nonEmptyString).min(2).max(6),
  hi_documents_to_attach: z.array(nonEmptyString).min(2).max(6),
  filing_office: nonEmptyString,
  hi_filing_office: nonEmptyString,
  next_steps: z.array(nonEmptyString).min(2).max(5),
  hi_next_steps: z.array(nonEmptyString).min(2).max(5),
});

export type PublicIssueRequest = z.infer<typeof publicIssueRequestSchema>;
export type PublicIssueTriage = z.infer<typeof publicIssueTriageSchema>;
export type PublicEligibilityProfile = z.infer<typeof publicEligibilityProfileSchema>;
export type PublicEligibilityResponse = z.infer<typeof publicEligibilityResponseSchema>;
export type PublicComplaintAssistRequest = z.infer<typeof publicComplaintAssistRequestSchema>;
export type PublicComplaintAssistResponse = z.infer<typeof publicComplaintAssistResponseSchema>;
