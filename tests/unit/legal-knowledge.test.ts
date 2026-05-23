import { DEMO_LEGAL_SOURCES } from "@/lib/domain/demo-data";
import {
  buildFallbackGroundedOutput,
  formatLegalSourceCitation,
  selectLegalSources,
} from "@/lib/server/legal-knowledge";

describe("legal knowledge helpers", () => {
  it("prioritizes domestic violence sources for domestic violence training requests", () => {
    const sources = selectLegalSources(DEMO_LEGAL_SOURCES, {
      audience: "District fellows",
      request:
        "Build a domestic violence training module with referral steps and protection order guidance.",
    });

    expect(sources[0]?.title).toContain("Domestic Violence");
    expect(sources.some((source) => source.citation.includes("181"))).toBe(true);
  });

  it("formats fallback grounded output with source notes", () => {
    const selectedSources = DEMO_LEGAL_SOURCES.slice(0, 2);
    const output = buildFallbackGroundedOutput({
      mode: "legal_aid_checklist",
      audience: "District fellows",
      request: "Create a checklist for caste atrocity intake.",
      caseContext: "Victim reports caste abuse and threat after filing a complaint.",
      sources: selectedSources,
    });

    expect(output).toContain("Legal-Aid Checklist");
    expect(output).toContain("Sources used:");
    expect(output).toContain(formatLegalSourceCitation(selectedSources[0]));
  });
});
