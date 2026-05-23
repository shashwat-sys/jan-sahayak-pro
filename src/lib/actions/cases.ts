"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { caseDiaryEntries, caseHearings, cases, tasks } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import {
  caseDiaryInputSchema,
  caseInputSchema,
  hearingInputSchema,
  taskInputSchema,
} from "@/lib/server/validators";
import { today } from "@/lib/utils/date";

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createCaseAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = caseInputSchema.parse(input);
    const id = crypto.randomUUID();
    await getDb().insert(cases).values({
      id,
      ...payload,
      documents: [],
      createdAt: today(),
      updatedAt: today(),
    });
    revalidatePath("/cases");
    revalidatePath("/dashboard");
    return { ok: true as const, id };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function setCaseStatusAction(caseId: string, status: unknown) {
  try {
    await requireAdmin();
    const nextStatus = caseInputSchema.shape.status.parse(status);
    await getDb()
      .update(cases)
      .set({ status: nextStatus, updatedAt: today() })
      .where(eq(cases.id, caseId));
    revalidatePath("/cases");
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function addCaseDiaryEntryAction(caseId: string, input: unknown) {
  try {
    await requireAdmin();
    const payload = caseDiaryInputSchema.parse(input);
    await getDb().insert(caseDiaryEntries).values({
      id: crypto.randomUUID(),
      caseId,
      date: today(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await getDb().update(cases).set({ updatedAt: today() }).where(eq(cases.id, caseId));
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/cases");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function addCaseHearingAction(caseId: string, input: unknown) {
  try {
    await requireAdmin();
    const payload = hearingInputSchema.parse(input);
    await getDb().insert(caseHearings).values({
      id: crypto.randomUUID(),
      caseId,
      date: payload.date,
      court: payload.court,
      purpose: payload.purpose,
      outcome: payload.outcome,
      nextDate: payload.nextDate || null,
      by: payload.by,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await getDb().update(cases).set({ updatedAt: today() }).where(eq(cases.id, caseId));
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/cases");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function addCaseDocumentAction(caseId: string, label: string) {
  try {
    await requireAdmin();
    const db = getDb();
    const [current] = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
    if (!current) {
      throw new Error("Case not found.");
    }

    const nextDocuments = [...current.documents, label.trim()].filter(Boolean);
    await db
      .update(cases)
      .set({ documents: nextDocuments, updatedAt: today() })
      .where(eq(cases.id, caseId));
    revalidatePath(`/cases/${caseId}`);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function createTaskAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = taskInputSchema.parse(input);
    const id = crypto.randomUUID();
    await getDb().insert(tasks).values({
      id,
      title: payload.title,
      assignedTo: payload.assignedTo,
      caseId: payload.caseId ?? null,
      deadline: payload.deadline,
      priority: payload.priority,
      notes: payload.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/cases");
    if (payload.caseId) {
      revalidatePath(`/cases/${payload.caseId}`);
    }
    revalidatePath("/dashboard");
    return { ok: true as const, id };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function toggleTaskStatusAction(taskId: string) {
  try {
    await requireAdmin();
    const db = getDb();
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    if (!task) {
      throw new Error("Task not found.");
    }

    await db
      .update(tasks)
      .set({
        status: task.status === "done" ? "pending" : "done",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tasks.id, taskId));
    revalidatePath("/cases");
    if (task.caseId) {
      revalidatePath(`/cases/${task.caseId}`);
    }
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}
