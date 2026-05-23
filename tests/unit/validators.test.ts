import {
  caseInputSchema,
  financeInputSchema,
  publicIssueRequestSchema,
  summaryRequestSchema,
} from "@/lib/server/validators";

describe("validators", () => {
  it("accepts a valid case payload", () => {
    expect(
      caseInputSchema.parse({
        title: "Rukmani Devi v. State of Bihar",
        client: "Rukmani Devi",
        respondent: "State of Bihar",
        court: "Patna High Court",
        caseNo: "CWJC 123/2025",
        firNo: "45/2024",
        section: "Art. 226",
        ps: "Kotwali",
        type: "Criminal Writ Petition",
        district: "Purnia",
        advocate: "Shashwat",
        worker: "Nagmani",
        status: "active",
        priority: "high",
        facts: "Facts",
        grounds: "Grounds",
        relief: "Relief",
      }),
    ).toBeTruthy();
  });

  it("rejects negative finance amounts", () => {
    expect(() =>
      financeInputSchema.parse({
        date: "2025-04-01",
        type: "expense",
        amount: -100,
        category: "Other",
        project: "Jan Nyaya Abhiyan",
        description: "Bad entry",
        approvedBy: "Shashwat",
      }),
    ).toThrow();
  });

  it("requires valid monthly summary payloads", () => {
    expect(
      summaryRequestSchema.parse({
        member: "Shashwat",
        month: "2025-04",
        role: "Director",
        type: "lawyer",
        data: { hearingsAttended: "3" },
      }),
    ).toBeTruthy();
  });

  it("accepts a valid public intake payload", () => {
    expect(
      publicIssueRequestSchema.parse({
        name: "Sunita Devi",
        phone: "9999999999",
        location: "Araria",
        district: "Araria",
        issue: "I need help with ration denial.",
        issueType: "both",
      }),
    ).toBeTruthy();
  });
});
