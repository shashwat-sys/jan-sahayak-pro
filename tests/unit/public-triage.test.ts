import { buildFallbackPublicTriage } from "@/lib/server/public-triage";

describe("buildFallbackPublicTriage", () => {
  it("marks domestic violence reports as urgent legal matters", () => {
    const result = buildFallbackPublicTriage({
      name: "Sunita Devi",
      phone: "9999999999",
      location: "Purnia",
      district: "Purnia",
      issue: "My husband beats me, threw me out of the house, and I need help urgently.",
      issueType: "both",
    });

    expect(result.type).toBe("legal");
    expect(result.urgency).toBe("high");
    expect(result.issues).toContain("Protection of Women from Domestic Violence Act, 2005");
  });

  it("routes ration card issues to welfare support", () => {
    const result = buildFallbackPublicTriage({
      name: "Ram Kumar",
      phone: "9999999999",
      location: "Katihar",
      district: "Katihar",
      issue: "Our ration card is not working and the dealer is refusing grain this month.",
      issueType: "both",
    });

    expect(result.type).toBe("welfare");
    expect(result.urgency).toBe("normal");
    expect(result.issues).toContain("National Food Security Act / PDS");
  });

  it("does not let an incorrect selected help type override urgent legal facts", () => {
    const result = buildFallbackPublicTriage({
      name: "Sita Kumari",
      phone: "9999999999",
      location: "Patna",
      district: "Patna",
      issue:
        "I selected the wrong option, but my husband is beating me and forced me out of the house.",
      issueType: "welfare",
    });

    expect(result.type).toBe("legal");
    expect(result.urgency).toBe("high");
  });
});
