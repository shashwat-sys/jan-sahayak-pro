import "dotenv/config";

import { sql } from "drizzle-orm";

import { getDb } from "../src/db";
import {
  activities,
  activityParticipants,
  appUsers,
  caseDiaryEntries,
  caseHearings,
  cases,
  financeTransactions,
  legalSources,
  tasks,
  teamMembers,
} from "../src/db/schema";
import {
  DEMO_ACTIVITIES,
  DEMO_CASES,
  DEMO_FINANCE_TRANSACTIONS,
  DEMO_LEGAL_SOURCES,
  DEMO_TASKS,
  DEMO_TEAM_MEMBERS,
  createDemoAdminUsers,
} from "../src/lib/domain/demo-data";
import { getSeedAdminEmail } from "../src/lib/server/env";

async function main() {
  const db = getDb();

  await db.execute(sql`
    truncate table
      activity_participants,
      activities,
      case_diary_entries,
      case_hearings,
      tasks,
      cases,
      finance_transactions,
      legal_sources,
      monthly_reports,
      team_members,
      app_users
    restart identity cascade
  `);

  await db.insert(appUsers).values(createDemoAdminUsers(getSeedAdminEmail()));
  await db.insert(teamMembers).values(
    DEMO_TEAM_MEMBERS.map((member) => ({
      ...member,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  );
  await db.insert(cases).values(
    DEMO_CASES.map((caseRecord) => ({
      id: caseRecord.id,
      title: caseRecord.title,
      client: caseRecord.client,
      respondent: caseRecord.respondent,
      court: caseRecord.court,
      caseNo: caseRecord.caseNo,
      firNo: caseRecord.firNo,
      section: caseRecord.section,
      ps: caseRecord.ps,
      type: caseRecord.type,
      district: caseRecord.district,
      advocate: caseRecord.advocate,
      worker: caseRecord.worker,
      status: caseRecord.status,
      priority: caseRecord.priority,
      facts: caseRecord.facts,
      grounds: caseRecord.grounds,
      relief: caseRecord.relief,
      documents: caseRecord.documents,
      createdAt: caseRecord.createdAt,
      updatedAt: caseRecord.updatedAt,
    })),
  );
  await db.insert(caseHearings).values(
    DEMO_CASES.flatMap((caseRecord) =>
      caseRecord.hearings.map((hearing) => ({
        ...hearing,
        caseId: caseRecord.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    ),
  );
  await db.insert(caseDiaryEntries).values(
    DEMO_CASES.flatMap((caseRecord) =>
      caseRecord.diary.map((entry) => ({
        ...entry,
        caseId: caseRecord.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    ),
  );
  await db.insert(tasks).values(
    DEMO_TASKS.map((task) => ({
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  );
  await db.insert(activities).values(
    DEMO_ACTIVITIES.map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      location: activity.location,
      district: activity.district,
      date: activity.date,
      coordinator: activity.coordinator,
      conductedBy: activity.conductedBy,
      beneficiaries: activity.beneficiaries,
      casesIdentified: activity.casesIdentified,
      casesReferred: activity.casesReferred,
      summary: activity.summary,
      status: activity.status,
      followUp: activity.followUp,
      linkedCases: activity.linkedCases,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  );
  await db.insert(activityParticipants).values(
    DEMO_ACTIVITIES.flatMap((activity) =>
      activity.participants.map((participant) => ({
        ...participant,
        activityId: activity.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    ),
  );
  await db.insert(financeTransactions).values(
    DEMO_FINANCE_TRANSACTIONS.map((entry) => ({
      ...entry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  );
  await db.insert(legalSources).values(
    DEMO_LEGAL_SOURCES.map((source) => ({
      ...source,
      createdAt: source.createdAt ?? new Date().toISOString(),
      updatedAt: source.updatedAt ?? new Date().toISOString(),
    })),
  );

  console.log("Demo data seeded successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
