import { LegalKnowledgePage } from "@/components/admin/legal-knowledge-page";
import { getCases, getLegalSources } from "@/lib/server/data";

export default async function KnowledgeRoutePage() {
  const [cases, legalSources] = await Promise.all([getCases(), getLegalSources()]);

  return <LegalKnowledgePage cases={cases} legalSources={legalSources} />;
}
