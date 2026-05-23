"use server";

import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { financeTransactions } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { financeInputSchema } from "@/lib/server/validators";

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createFinanceTransactionAction(input: unknown) {
  try {
    await requireAdmin();
    const payload = financeInputSchema.parse(input);
    await getDb().insert(financeTransactions).values({
      id: crypto.randomUUID(),
      date: payload.date,
      type: payload.type,
      amount: payload.amount,
      category: payload.category as typeof financeTransactions.$inferInsert.category,
      project: payload.project,
      description: payload.description,
      approvedBy: payload.approvedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/finance");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: buildErrorMessage(error) };
  }
}
