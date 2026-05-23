import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { getDatabaseUrl, isDatabaseConfigured } from "@/lib/server/env";

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!database) {
    const client = neon(getDatabaseUrl());
    database = drizzle(client, { schema });
  }

  return database;
}
