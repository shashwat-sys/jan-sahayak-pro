import JanSahayakProApp from "@/components/admin/jan-sahayak-pro-app";
import { requireAdmin } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function ProPage() {
  const session = await requireAdmin();

  return <JanSahayakProApp userName={session.name} />;
}
