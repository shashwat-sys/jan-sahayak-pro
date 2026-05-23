"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { teamMembers } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { teamMemberInputSchema } from "@/lib/server/validators";

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createTeamMemberAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = teamMemberInputSchema.parse(input);
    const db = getDb();
    const existing = await db.select().from(teamMembers);
    const nextUid = `JNY-${String(existing.length + 1).padStart(3, "0")}`;

    await db.insert(teamMembers).values({
      id: crypto.randomUUID(),
      uid: nextUid,
      ...payload,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/team");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}

export async function setTeamMemberStatusAction(id: string, status: "active" | "terminated") {
  try {
    await requireAdmin();
    await getDb()
      .update(teamMembers)
      .set({
        status,
        terminatedAt: status === "terminated" ? new Date().toISOString().slice(0, 10) : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(teamMembers.id, id));
    revalidatePath("/team");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}
