import {
  formatDate,
  formatDateDetail,
  formatDateToLocalISO,
  formatTime,
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
