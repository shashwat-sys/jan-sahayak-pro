import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getDb } from "@/db";
import { appUsers } from "@/db/schema";
import {
  getAuthRoutes,
  isClerkConfigured,
  isDatabaseConfigured,
  isDemoMode,
} from "@/lib/server/env";

export type AdminSession = {
  clerkUserId: string;
  email: string;
  name: string;
  role: "admin";
};

export async function getAdminSession() {
  if (isDemoMode()) {
    return {
      type: "admin" as const,
      session: {
        clerkUserId: "demo-admin",
        email: "demo@janman.local",
        name: "Demo Admin",
        role: "admin" as const,
      },
    };
  }

  if (!isClerkConfigured() || !isDatabaseConfigured()) {
    return { type: "setup-required" as const };
  }

  const { userId } = await auth();
  if (!userId) {
    return { type: "anonymous" as const };
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    "";

  if (!email) {
    return { type: "forbidden" as const };
  }

  const db = getDb();
  const [appUser] = await db
    .select()
    .from(appUsers)
    .where(or(eq(appUsers.clerkUserId, userId), eq(appUsers.email, email)))
    .limit(1);

  if (!appUser || appUser.role !== "admin") {
    return { type: "forbidden" as const };
  }

  if (!appUser.clerkUserId) {
    await db
      .update(appUsers)
      .set({
        clerkUserId: userId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(appUsers.id, appUser.id));
  }

  return {
    type: "admin" as const,
    session: {
      clerkUserId: userId,
      email,
      name: clerkUser?.firstName ?? clerkUser?.fullName ?? "Admin",
      role: "admin" as const,
    },
  };
}

export async function requireAdmin() {
  const state = await getAdminSession();
  const authRoutes = getAuthRoutes();

  if (state.type === "setup-required") {
    redirect("/setup");
  }

  if (state.type === "anonymous") {
    redirect(authRoutes.signIn);
  }

  if (state.type === "forbidden") {
    redirect("/setup?reason=access");
  }

  return state.session;
}
