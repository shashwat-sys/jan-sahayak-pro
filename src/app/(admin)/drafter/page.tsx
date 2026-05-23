import { DrafterPage } from "@/components/admin/drafter-page";
import { getCases } from "@/lib/server/data";

export default async function DrafterRoutePage() {
  const cases = await getCases();
  return <DrafterPage cases={cases} />;
}
