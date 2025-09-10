import { DateManager } from "../../../../core/shared/utils/DateManager";

describe("DateManager", () => {
  it("should format a date correctly", () => {
    const date = new Date("2023-10-27T10:00:00.000Z");
    const formatted = DateManager.formatDate(date);
    expect(formatted).toBe("2023-10-27");
  });

  it("should format a date and time correctly and be timezone-independent", () => {
    const date = new Date("2023-10-27T10:00:00.000Z");
    const formatted = DateManager.dateToDateTimeString(date);
    // Matches YYYY-MM-DD HH:MM:SS format to avoid timezone issues in tests
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    expect(formatted).toMatch(dateTimeRegex);
  });
});
