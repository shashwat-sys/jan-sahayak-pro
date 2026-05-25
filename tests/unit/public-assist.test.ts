import {
  buildFallbackComplaintDraft,
  buildFallbackEligibility,
} from "@/lib/server/public-assist";

describe("public welfare assist fallback", () => {
  it("surfaces likely maternity and food support for a low-income pregnant profile", () => {
    const result = buildFallbackEligibility({
      name: "Soni Kumari",
      phone: "9999999999",
      district: "Purnia",
      residence: "rural",
      age: 23,
      gender: "female",
      annualIncome: 120000,
      socialCategory: "ebc",
      occupation: "homemaker",
      isStudent: false,
      isPregnant: true,
      isWidowed: false,
      hasDisability: false,
      disabilityPercent: 0,
      housingStatus: "kutcha",
      hasRationCard: false,
      hasBankAccount: true,
      hasAadhaar: true,
      isLandless: true,
      needsMedicalSupport: false,
    });

    expect(result.recommendations.some((item) => item.id === "pmmvy" && item.status === "likely")).toBe(true);
    expect(result.recommendations.some((item) => item.id === "nfsa-pds")).toBe(true);
  });

  it("prepares a ration grievance draft with the right filing office", () => {
    const draft = buildFallbackComplaintDraft({
      name: "Ram Kumar",
      phone: "9999999999",
      district: "Katihar",
      benefit: "Ration card / PDS grain",
      authority: "PDS dealer and supply office",
      grievanceType: "denial of grain",
      incidentDate: "2026-05-20",
      location: "Ward 5, Katihar",
      facts: "Dealer refused grain for two months and said the card is inactive.",
      documentsAvailable: "ration card copy, Aadhaar, dealer slip",
      reliefWanted: "Restore the card and provide pending grain.",
    });

    expect(draft.filing_office).toContain("Supply Office");
    expect(draft.documents_to_attach.some((item) => item.includes("ration"))).toBe(true);
    expect(draft.reliefs.some((item) => item.includes("Restore the card"))).toBe(true);
  });
});
