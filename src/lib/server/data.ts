import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import {
  activities,
  activityParticipants,
  caseDiaryEntries,
  caseHearings,
  cases,
  financeTransactions,
  legalSources,
  monthlyReports,
  tasks,
  teamMembers,
} from "@/db/schema";
import {
  DEMO_ACTIVITIES,
  DEMO_CASES,
  DEMO_FINANCE_TRANSACTIONS,
  DEMO_LEGAL_SOURCES,
  DEMO_TASKS,
  DEMO_TEAM_MEMBERS,
} from "@/lib/domain/demo-data";
import type {
  ActivityRecord,
  CaseDiaryRecord,
  CaseRecord,
  FinanceTransactionRecord,
  HearingRecord,
  LegalSourceRecord,
  MonthlyReportRecord,
  TaskRecord,
  TeamMemberRecord,
} from "@/lib/domain/types";
import { isDatabaseConfigured, isDemoMode } from "@/lib/server/env";

function groupByKey<T extends Record<string, unknown>, K extends keyof T>(items: T[], key: K) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const value = item[key];
    if (typeof value === "string") {
      groups[value] ??= [];
      groups[value].push(item);
    }
    return groups;
  }, {});
}

export async function getTeamMembers(): Promise<TeamMemberRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_TEAM_MEMBERS;
  }

  const db = getDb();
  const rows = await db.select().from(teamMembers).orderBy(teamMembers.uid);
  return rows.map((member) => ({
    ...member,
    type: member.type as TeamMemberRecord["type"],
    status: member.status as TeamMemberRecord["status"],
  }));
}

export async function getTasks(): Promise<TaskRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_TASKS;
  }

  const db = getDb();
  const rows = await db.select().from(tasks).orderBy(desc(tasks.deadline));
  return rows.map((task) => ({
    ...task,
    status: task.status as TaskRecord["status"],
    priority: task.priority as TaskRecord["priority"],
  }));
}

export async function getActivities(): Promise<ActivityRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_ACTIVITIES;
  }

  const db = getDb();
  const [activityRows, participantRows] = await Promise.all([
    db.select().from(activities).orderBy(desc(activities.date)),
    db.select().from(activityParticipants).orderBy(activityParticipants.name),
  ]);

  const participantMap = groupByKey(participantRows, "activityId");

  return activityRows.map((activity) => ({
    ...activity,
    type: activity.type as ActivityRecord["type"],
    status: activity.status as ActivityRecord["status"],
    participants: participantMap[activity.id] ?? [],
  }));
}

export async function getFinanceTransactions(): Promise<FinanceTransactionRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_FINANCE_TRANSACTIONS;
  }

  const db = getDb();
  const rows = await db.select().from(financeTransactions).orderBy(desc(financeTransactions.date));
  return rows.map((entry) => ({
    ...entry,
    type: entry.type as FinanceTransactionRecord["type"],
    category: entry.category as FinanceTransactionRecord["category"],
  }));
}

export async function getMonthlyReports(): Promise<MonthlyReportRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows = await db.select().from(monthlyReports).orderBy(desc(monthlyReports.month));
  return rows.map((report) => ({
    ...report,
    type: report.type as MonthlyReportRecord["type"],
  }));
}

export async function getLegalSources(): Promise<LegalSourceRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_LEGAL_SOURCES;
  }

  try {
    const db = getDb();
    const rows = await db.select().from(legalSources).orderBy(desc(legalSources.updatedAt));

    if (rows.length === 0) {
      return DEMO_LEGAL_SOURCES;
    }

    return rows.map((source) => ({
      ...source,
      documentType: source.documentType as LegalSourceRecord["documentType"],
      sourceKind: source.sourceKind as LegalSourceRecord["sourceKind"],
    }));
  } catch {
    return DEMO_LEGAL_SOURCES;
  }
}

export async function getCases(): Promise<CaseRecord[]> {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_CASES;
  }

  const db = getDb();
  const [caseRows, hearingRows, diaryRows] = await Promise.all([
    db.select().from(cases).orderBy(desc(cases.updatedAt)),
    db.select().from(caseHearings).orderBy(desc(caseHearings.date)),
    db.select().from(caseDiaryEntries).orderBy(desc(caseDiaryEntries.date)),
  ]);

  const hearingsByCase = groupByKey(
    hearingRows.map((row) => ({ ...row, caseId: row.caseId })),
    "caseId",
  ) as Record<string, HearingRecord[]>;
  const diaryByCase = groupByKey(
    diaryRows.map((row) => ({ ...row, caseId: row.caseId })),
    "caseId",
  ) as Record<string, CaseDiaryRecord[]>;

  return caseRows.map((caseRecord) => ({
    ...caseRecord,
    type: caseRecord.type as CaseRecord["type"],
    status: caseRecord.status as CaseRecord["status"],
    priority: caseRecord.priority as CaseRecord["priority"],
    hearings: hearingsByCase[caseRecord.id] ?? [],
    diary: diaryByCase[caseRecord.id] ?? [],
  }));
}

export async function getCaseById(caseId: string) {
  const allCases = await getCases();
  return allCases.find((caseRecord) => caseRecord.id === caseId) ?? null;
}

export async function getAppData() {
  const [team, casesList, activityList, finance, taskList, reports] = await Promise.all([
    getTeamMembers(),
    getCases(),
    getActivities(),
    getFinanceTransactions(),
    getTasks(),
    getMonthlyReports(),
  ]);

  return {
    team,
    cases: casesList,
    activities: activityList,
    finance,
    tasks: taskList,
    monthlyReports: reports,
  };
}

export async function getTeamMemberById(id: string) {
  if (isDemoMode() || !isDatabaseConfigured()) {
    return DEMO_TEAM_MEMBERS.find((member) => member.id === id) ?? null;
  }

  const db = getDb();
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return member ?? null;
}
