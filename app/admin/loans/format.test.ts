import { describe, expect, it } from "vitest";
import { formatGhs, formatLoanDate, repaymentPercent, toDateInputValue } from "./format";

describe("loan formatting", () => {
  it("formats cedis the same way as other admin amounts", () => {
    expect(formatGhs(1500)).toBe("GHS 1500.00");
    expect(formatGhs(80.5)).toBe("GHS 80.50");
    expect(formatGhs(Number.NaN)).toBe("GHS 0.00");
  });

  it("formats calendar dates as dd/mm/yyyy without shifting the day", () => {
    expect(formatLoanDate("2026-06-01")).toBe("01/06/2026");
    expect(formatLoanDate("2026-06-01T00:00:00.000Z")).toBe("01/06/2026");
    expect(formatLoanDate(undefined)).toBe("—");
  });

  it("keeps the date portion for form inputs", () => {
    expect(toDateInputValue("2026-06-01T00:00:00.000Z")).toBe("2026-06-01");
    expect(toDateInputValue("")).toBe("");
  });

  it("clamps repayment progress", () => {
    expect(repaymentPercent(1000, 250)).toBe(25);
    expect(repaymentPercent(1000, 1500)).toBe(100);
    expect(repaymentPercent(0, 10)).toBe(0);
  });
});
