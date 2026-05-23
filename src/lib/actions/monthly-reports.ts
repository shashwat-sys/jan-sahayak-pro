"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { monthlyReports } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { monthlyReportInputSchema } from "@/lib/server/validators";

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function upsertMonthlyReportAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = monthlyReportInputSchema.parse(input);
    const db = getDb();
    const [existing] = await db
      .select()
      .from(monthlyReports)
      .where(and(eq(monthlyReports.member, payload.member), eq(monthlyReports.month, payload.month)))
      .limit(1);

    if (existing) {
      await db
        .update(monthlyReports)
        .set({
          type: payload.type,
          data: payload.data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(monthlyReports.id, existing.id));
    } else {
      await db.insert(monthlyReports).values({
        id: crypto.randomUUID(),
        ...payload,
        summary: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    revalidatePath("/monthly-reports");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function saveMonthlySummaryAction(
  member: string,
  month: string,
  summary: string,
  data: Record<string, string>,
  type: "lawyer" | "social_worker",
) {
  await requireAdmin();
  const db = getDb();
  const [existing] = await db
    .select()
    .from(monthlyReports)
    .where(and(eq(monthlyReports.member, member), eq(monthlyReports.month, month)))
    .limit(1);

  if (existing) {
    await db
      .update(monthlyReports)
      .set({
        summary,
        data,
        type,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(monthlyReports.id, existing.id));
  } else {
    await db.insert(monthlyReports).values({
      id: crypto.randomUUID(),
      member,
      month,
      type,
      data,
      summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  revalidatePath("/monthly-reports");
}
