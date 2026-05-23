import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/server/auth";
import { getCases } from "@/lib/server/data";
import { isClerkConfigured } from "@/lib/server/env";
import { daysSince } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdmin();
  const cases = await getCases();
  const overdueCaseCount = cases.filter(
    (caseRecord) => caseRecord.status === "active" && daysSince(caseRecord.updatedAt) > 7,
  ).length;

  return (
    <AdminShell
      overdueCaseCount={overdueCaseCount}
      showUserButton={isClerkConfigured()}
      userName={session.name}
    >
      {children}
    </AdminShell>
  );
}
