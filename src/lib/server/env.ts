import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  DEMO_MODE: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

const environment = environmentSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  DEMO_MODE: process.env.DEMO_MODE,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
});

export function isDatabaseConfigured() {
  return Boolean(environment.DATABASE_URL);
}

export function isDemoMode() {
  return environment.DEMO_MODE === "true";
}

export function getDatabaseUrl() {
  if (!environment.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return environment.DATABASE_URL;
}

export function isClerkConfigured() {
  return Boolean(
    environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && environment.CLERK_SECRET_KEY,
  );
}

export function isAnthropicConfigured() {
  return Boolean(environment.ANTHROPIC_API_KEY);
}

export function getSeedAdminEmail() {
  return environment.SEED_ADMIN_EMAIL ?? "admin@example.com";
}

export function getAuthRoutes() {
  return {
    signIn: environment.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in",
    signUp: environment.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up",
  };
}
