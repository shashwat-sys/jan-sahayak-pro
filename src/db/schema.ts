import { sql } from "drizzle-orm";
import { date, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import {
  ACTIVITY_STATUSES,
  ACTIVITY_TYPES,
  CASE_STATUSES,
  EXPENSE_CATEGORIES,
  GRANT_CATEGORIES,
  LEGAL_SOURCE_KINDS,
  LEGAL_SOURCE_TYPES,
  MONTHLY_REPORT_KINDS,
  PRIORITIES,
  TASK_STATUSES,
  TEAM_STATUSES,
  TEAM_TYPES,
} from "@/lib/domain/constants";

const timestampColumns = {
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const appUsers = pgTable("app_users", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
  ...timestampColumns,
});

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  type: text("type", { enum: TEAM_TYPES }).notNull(),
  loc: text("loc").notNull(),
  dist: text("dist").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  status: text("status", { enum: TEAM_STATUSES }).notNull().default("active"),
  qual: text("qual").notNull().default(""),
  join: date("join", { mode: "string" }).notNull(),
  bio: text("bio").notNull().default(""),
  terminatedAt: date("terminated_at", { mode: "string" }),
  ...timestampColumns,
});

export const cases = pgTable("cases", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  respondent: text("respondent").notNull(),
  court: text("court").notNull(),
  caseNo: text("case_no").notNull().default(""),
  firNo: text("fir_no").notNull().default(""),
  section: text("section").notNull().default(""),
  ps: text("ps").notNull().default(""),
  type: text("type").notNull(),
  district: text("district").notNull(),
  advocate: text("advocate").notNull(),
  worker: text("worker").notNull().default(""),
  status: text("status", { enum: CASE_STATUSES }).notNull().default("active"),
  priority: text("priority", { enum: PRIORITIES }).notNull().default("medium"),
  facts: text("facts").notNull().default(""),
  grounds: text("grounds").notNull().default(""),
  relief: text("relief").notNull().default(""),
  documents: jsonb("documents").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: date("created_at", { mode: "string" }).notNull(),
  updatedAt: date("updated_at", { mode: "string" }).notNull(),
});

export const caseHearings = pgTable("case_hearings", {
  id: text("id").primaryKey(),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  date: date("date", { mode: "string" }).notNull(),
  court: text("court").notNull(),
  purpose: text("purpose").notNull().default(""),
  outcome: text("outcome").notNull().default(""),
  nextDate: date("next_date", { mode: "string" }),
  by: text("by").notNull(),
  ...timestampColumns,
});

export const caseDiaryEntries = pgTable("case_diary_entries", {
  id: text("id").primaryKey(),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "cascade" }),
  date: date("date", { mode: "string" }).notNull(),
  action: text("action").notNull(),
  by: text("by").notNull(),
  notes: text("notes").notNull().default(""),
  ...timestampColumns,
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  assignedTo: text("assigned_to").notNull(),
  caseId: text("case_id").references(() => cases.id, { onDelete: "set null" }),
  deadline: date("deadline", { mode: "string" }).notNull(),
  status: text("status", { enum: TASK_STATUSES }).notNull().default("pending"),
  priority: text("priority", { enum: PRIORITIES }).notNull().default("medium"),
  notes: text("notes").notNull().default(""),
  ...timestampColumns,
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ACTIVITY_TYPES }).notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  district: text("district").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  coordinator: text("coordinator").notNull(),
  conductedBy: jsonb("conducted_by").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  beneficiaries: integer("beneficiaries").notNull().default(0),
  casesIdentified: integer("cases_identified").notNull().default(0),
  casesReferred: integer("cases_referred").notNull().default(0),
  summary: text("summary").notNull().default(""),
  status: text("status", { enum: ACTIVITY_STATUSES }).notNull().default("planned"),
  followUp: text("follow_up").notNull().default(""),
  linkedCases: jsonb("linked_cases").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  ...timestampColumns,
});

export const activityParticipants = pgTable("activity_participants", {
  id: text("id").primaryKey(),
  activityId: text("activity_id")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  ...timestampColumns,
});

export const financeTransactions = pgTable("finance_transactions", {
  id: text("id").primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  type: text("type", { enum: ["grant", "expense"] }).notNull(),
  amount: integer("amount").notNull(),
  category: text("category", {
    enum: [...GRANT_CATEGORIES, ...EXPENSE_CATEGORIES],
  }).notNull(),
  project: text("project").notNull(),
  description: text("description").notNull(),
  approvedBy: text("approved_by").notNull(),
  ...timestampColumns,
});

export const monthlyReports = pgTable("monthly_reports", {
  id: text("id").primaryKey(),
  member: text("member").notNull(),
  month: text("month").notNull(),
  type: text("type", { enum: MONTHLY_REPORT_KINDS }).notNull(),
  data: jsonb("data").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
  summary: text("summary"),
  ...timestampColumns,
});

export const legalSources = pgTable("legal_sources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  documentType: text("document_type", { enum: LEGAL_SOURCE_TYPES }).notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  citation: text("citation").notNull().default(""),
  sourceKind: text("source_kind", { enum: LEGAL_SOURCE_KINDS }).notNull().default("primary"),
  sourceUrl: text("source_url").notNull().default(""),
  status: text("status").notNull().default("current"),
  datePublished: date("date_published", { mode: "string" }),
  dateEffective: date("date_effective", { mode: "string" }),
  plainLanguageSummary: text("plain_language_summary").notNull().default(""),
  content: text("content").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  audienceTags: jsonb("audience_tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  ...timestampColumns,
});
