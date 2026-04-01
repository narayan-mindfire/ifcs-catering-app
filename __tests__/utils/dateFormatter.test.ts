import {
  formatDate,
  formatDateDetail,
  formatDateToLocalISO,
  formatTime,
  formatTo24Hour,
  getShiftTimeRange,
} from "../../src/utils/dateFormatter";

describe("dateFormatter", () => {
  describe("formatDateDetail", () => {
    it("formats a valid date string correctly", () => {
      const date = "2024-03-16T10:30:00Z";
      // This will depend on the system locale/timezone in the test environment
      // but let's check for the basic structure.
      const formatted = formatDateDetail(date);
      expect(formatted).toMatch(/Mar 16, 2024/);
    });

    it("returns empty string for null or undefined", () => {
      expect(formatDateDetail(null)).toBe("");
      expect(formatDateDetail(undefined)).toBe("");
    });
  });

  describe("formatDate", () => {
    it("formats date to MMM DD YYYY", () => {
      const formatted = formatDate("2024-03-16");
      expect(formatted).toBe("MAR 16 2024");
    });

    it("returns empty string for null", () => {
      expect(formatDate(null)).toBe("");
    });
  });

  describe("formatTime", () => {
    it("formats time to HH:mm from ISO string", () => {
      const formatted = formatTime("2024-03-16T10:30:00Z");
      expect(formatted).toBe("10:30");
    });

    it("returns --:-- for null", () => {
      expect(formatTime(null)).toBe("--:--");
    });
  });

  describe("formatDateToLocalISO", () => {
    it("formats Date object to YYYY-MM-DD", () => {
      const date = new Date(2024, 2, 16); // March is 2
      expect(formatDateToLocalISO(date)).toBe("2024-03-16");
    });
  });
});

describe("formatTo24Hour", () => {
  it("formats a Date object to HH:mm", () => {
    const date = new Date(2024, 2, 16, 14, 30);
    expect(formatTo24Hour(date)).toBe("14:30");
  });

  it("formats an ISO string to HH:mm", () => {
    // Note: new Date("...") uses local time if no Z, but here we just want to test if it pulls HH:mm correctly from the Date object created
    const dateStr = "2024-03-16T15:45:00";
    const date = new Date(dateStr);
    const expected = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    expect(formatTo24Hour(dateStr)).toBe(expected);
  });

  it("returns --:-- for invalid input", () => {
    expect(formatTo24Hour(null)).toBe("--:--");
    expect(formatTo24Hour(undefined)).toBe("--:--");
    expect(formatTo24Hour("invalid")).toBe("--:--");
  });
});

describe("getShiftTimeRange", () => {
  it("returns correct range for MORNING", () => {
    expect(getShiftTimeRange("MORNING")).toBe("10:00 - 18:00");
  });

  it("returns correct range for EVENING", () => {
    expect(getShiftTimeRange("EVENING")).toBe("18:00 - 02:00");
  });

  it("is case-insensitive", () => {
    expect(getShiftTimeRange("morning")).toBe("10:00 - 18:00");
  });

  it("returns --:-- for unknown shift type", () => {
    expect(getShiftTimeRange("NIGHT")).toBe("--:--");
  });

  it("returns --:-- for null", () => {
    expect(getShiftTimeRange(null)).toBe("--:--");
  });
});
