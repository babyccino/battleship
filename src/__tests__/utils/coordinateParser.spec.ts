import { describe, it, expect } from "vitest";
import { parseCoordinate, formatCoordinate, isValidCoordinate } from "../../utils/coordinateParser";

describe("coordinateParser", () => {
  describe("parseCoordinate", () => {
    it("parses valid coordinates", () => {
      const result = parseCoordinate("A1");
      expect(result).toEqual({ row: 0, col: 0 });
    });

    it("parses bottom-right coordinate", () => {
      const result = parseCoordinate("J10");
      expect(result).toEqual({ row: 9, col: 9 });
    });

    it("parses coordinates case-insensitively", () => {
      const result = parseCoordinate("a5");
      expect(result).toEqual({ row: 4, col: 0 });
    });

    it("handles whitespace", () => {
      const result = parseCoordinate("  B3  ");
      expect(result).toEqual({ row: 2, col: 1 });
    });

    it("rejects invalid format", () => {
      expect(parseCoordinate("AA1")).toBeNull();
      expect(parseCoordinate("1A")).toBeNull();
      expect(parseCoordinate("K5")).toBeNull();
      expect(parseCoordinate("A0")).toBeNull();
      expect(parseCoordinate("A11")).toBeNull();
      expect(parseCoordinate("Z5")).toBeNull();
    });

    it("rejects empty input", () => {
      expect(parseCoordinate("")).toBeNull();
    });

    it("parses all valid columns A-J", () => {
      const columns = "ABCDEFGHIJ".split("");
      columns.forEach((col, idx) => {
        const result = parseCoordinate(`${col}5`);
        expect(result).toEqual({ row: 4, col: idx });
      });
    });

    it("parses all valid rows 1-10", () => {
      for (let row = 1; row <= 10; row++) {
        const result = parseCoordinate(`A${row}`);
        expect(result).toEqual({ row: row - 1, col: 0 });
      }
    });
  });

  describe("formatCoordinate", () => {
    it("formats top-left coordinate", () => {
      const result = formatCoordinate(0, 0);
      expect(result).toBe("A1");
    });

    it("formats bottom-right coordinate", () => {
      const result = formatCoordinate(9, 9);
      expect(result).toBe("J10");
    });

    it("formats middle coordinate", () => {
      const result = formatCoordinate(4, 2);
      expect(result).toBe("C5");
    });
  });

  describe("isValidCoordinate", () => {
    it("validates correct coordinates", () => {
      expect(isValidCoordinate("A1")).toBe(true);
      expect(isValidCoordinate("J10")).toBe(true);
      expect(isValidCoordinate("E5")).toBe(true);
    });

    it("rejects invalid coordinates", () => {
      expect(isValidCoordinate("K5")).toBe(false);
      expect(isValidCoordinate("A0")).toBe(false);
      expect(isValidCoordinate("A11")).toBe(false);
      expect(isValidCoordinate("1A")).toBe(false);
      expect(isValidCoordinate("")).toBe(false);
    });
  });

  describe("roundtrip", () => {
    it("can parse and format coordinates", () => {
      const original = "E5";
      const parsed = parseCoordinate(original);
      expect(parsed).not.toBeNull();

      if (parsed) {
        const formatted = formatCoordinate(parsed.row, parsed.col);
        expect(formatted).toBe(original);
      }
    });
  });
});
