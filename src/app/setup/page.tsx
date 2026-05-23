import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { getSeedAdminEmail, isClerkConfigured, isDatabaseConfigured } from "@/lib/server/env";

type SetupPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { reason } = await searchParams;

  return (
    <div className="app-frame page-stack">
      <div className="page-hero">
        <div>
          <span className="section-kicker">Workspace Setup</span>
          <h1 className="page-title">Jan Sahayak Pro needs environment setup before use.</h1>
          <p className="page-copy">
            This build is wired for Clerk auth, Neon Postgres, Drizzle, and server-side AI. Once
            those pieces are configured, the protected admin routes and seeded data will come alive.
          </p>
        </div>
      </div>

      {reason === "access" ? (
        <Notice title="No admin access yet" tone="red">
          Your Clerk account is signed in, but its email is not currently mapped to an admin record
          in the database. Seed or update <code>app_users</code> for your email to unlock the
          workspace.
        </Notice>
      ) : null}

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Checklist</span>
          <div className="stack">
            <Notice
              title={isClerkConfigured() ? "Clerk configured" : "Clerk missing"}
              tone={isClerkConfigured() ? "green" : "red"}
            >
              Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>.
            </Notice>
            <Notice
              title={isDatabaseConfigured() ? "Database configured" : "Database missing"}
              tone={isDatabaseConfigured() ? "green" : "red"}
            >
              Set <code>DATABASE_URL</code> to your Neon Postgres connection string.
            </Notice>
            <Notice title="Seed admin email" tone="accent">
              Current seed admin email is <code>{getSeedAdminEmail()}</code>.
            </Notice>
          </div>
        </Card>

        <Card>
          <span className="section-kicker">Next Steps</span>
          <div className="stack support-text">
            <p>1. Copy <code>.env.example</code> to <code>.env.local</code>.</p>
            <p>2. Add Clerk keys and a Neon Postgres <code>DATABASE_URL</code>.</p>
            <p>3. Run <code>npm run db:push</code> to create tables.</p>
            <p>4. Run <code>npm run db:seed</code> to load the Janman demo data.</p>
            <p>
              5. Sign in to Clerk with the same email as <code>SEED_ADMIN_EMAIL</code>, then visit
              <code> /dashboard</code>.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
