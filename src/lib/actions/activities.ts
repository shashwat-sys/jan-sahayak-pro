"use server";

import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { activities, activityParticipants } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { activityInputSchema, participantBulkInputSchema } from "@/lib/server/validators";

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createActivityAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = activityInputSchema.parse(input);
    const id = crypto.randomUUID();
    await getDb().insert(activities).values({
      id,
      ...payload,
      conductedBy: [payload.coordinator],
      linkedCases: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/activities");
    revalidatePath("/dashboard");
    return { ok: true as const, id };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function addParticipantsBulkAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = participantBulkInputSchema.parse(input);
    await getDb().insert(activityParticipants).values(
      payload.lines.map((entry) => ({
        id: crypto.randomUUID(),
        activityId: payload.activityId,
        name: entry.name,
        phone: entry.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    );
    revalidatePath("/activities");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}
