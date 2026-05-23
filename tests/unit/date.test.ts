import { daysSince, daysUntil, formatDisplayDate, monthKey } from "@/lib/utils/date";

describe("date utilities", () => {
  it("formats dates for display", () => {
    expect(formatDisplayDate("2025-04-05")).toBe("05 Apr 2025");
  });

  it("returns zero for missing daysSince input", () => {
    expect(daysSince(undefined)).toBe(0);
  });

  it("returns infinity for missing daysUntil input", () => {
    expect(daysUntil(undefined)).toBe(Number.POSITIVE_INFINITY);
  });

  it("extracts a month key", () => {
    expect(monthKey("2025-04-05")).toBe("2025-04");
  });
});
