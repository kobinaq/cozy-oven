import { describe, expect, it } from "vitest";
import {
  loanErrorMessage,
  normalizeLoanDetail,
  normalizeLoanList,
  normalizeSummary,
  toLoanBody,
  toRepaymentBody,
} from "./loanService";

const loan = {
  id: "6740c0a1b2c3d4e5f6789012",
  lender: "Ama Mensah",
  lenderPhone: "0244123456",
  principal: 1500.5,
  startDate: "2026-11-01T00:00:00.000Z",
  dueDate: "2026-12-01T00:00:00.000Z",
  notes: "Flour",
  totalRepaid: 200,
  balance: 1300.5,
  status: "active",
  createdAt: "2026-11-19T16:00:00.000Z",
  updatedAt: "2026-11-19T16:00:00.000Z",
};

const repayment = {
  id: "6741c0a1b2c3d4e5f6789013",
  amount: 200,
  date: "2026-11-18T00:00:00.000Z",
  method: "momo",
  reference: "MM-1",
  notes: "",
  createdAt: "2026-11-18T10:00:00.000Z",
};

describe("normalizeLoanList", () => {
  it("reads success, count, and loans without repayments", () => {
    const result = normalizeLoanList({
      success: true,
      count: 1,
      data: [{ ...loan, lenderPhone: null, dueDate: null, notes: "" }],
    });
    expect(result.count).toBe(1);
    expect(result.loans).toHaveLength(1);
    expect(result.loans[0]).toMatchObject({
      id: loan.id,
      lenderPhone: null,
      dueDate: null,
      notes: "",
      balance: 1300.5,
      repayments: [],
    });
    expect(result.loans[0]).not.toHaveProperty("_id");
  });

  it("ignores a row whose id is missing", () => {
    const result = normalizeLoanList({
      success: true,
      count: 1,
      data: [{ ...loan, id: "" }, loan],
    });
    expect(result.loans.map((row) => row.id)).toEqual([loan.id]);
  });
});

describe("normalizeLoanDetail", () => {
  it("keeps repayments in the returned order and null reference", () => {
    const detail = normalizeLoanDetail({
      success: true,
      data: {
        ...loan,
        repayments: [
          { ...repayment, reference: null },
          { ...repayment, id: "older", date: "2026-11-01T00:00:00.000Z", method: "cash" },
        ],
      },
    });
    expect(detail.repayments.map((row) => row.id)).toEqual([repayment.id, "older"]);
    expect(detail.repayments[0]).toMatchObject({
      reference: null,
      notes: "",
      createdAt: repayment.createdAt,
    });
  });
});

describe("normalizeSummary", () => {
  it("reads totals and a null next due", () => {
    expect(
      normalizeSummary({
        success: true,
        data: {
          totalOwed: 0,
          totalBorrowed: 0,
          totalRepaid: 0,
          activeCount: 0,
          overdueCount: 0,
          nextDue: null,
        },
      })
    ).toEqual({
      totalOwed: 0,
      totalBorrowed: 0,
      totalRepaid: 0,
      activeCount: 0,
      overdueCount: 0,
      nextDue: null,
    });
  });

  it("reads nextDue with an ISO due date", () => {
    expect(
      normalizeSummary({
        success: true,
        data: {
          totalOwed: 690,
          totalBorrowed: 1140,
          totalRepaid: 450,
          activeCount: 4,
          overdueCount: 1,
          nextDue: {
            loanId: loan.id,
            lender: "Abena",
            dueDate: "2026-11-19T00:00:00.000Z",
            balance: 80,
          },
        },
      }).nextDue
    ).toEqual({
      loanId: loan.id,
      lender: "Abena",
      dueDate: "2026-11-19T00:00:00.000Z",
      balance: 80,
    });
  });
});

describe("request bodies", () => {
  it("omits blank optional fields on create", () => {
    expect(
      toLoanBody(
        { lender: "  Kofi  ", principal: 200, startDate: "2026-04-01", lenderPhone: "  ", notes: "" },
        "create"
      )
    ).toEqual({ lender: "Kofi", principal: 200, startDate: "2026-04-01" });
  });

  it("clears phone and due date with null and notes with an empty string", () => {
    expect(
      toLoanBody(
        { lender: "Kofi", principal: 200, startDate: "2026-04-01", dueDate: "", notes: "  " },
        "update"
      )
    ).toEqual({
      lender: "Kofi",
      principal: 200,
      startDate: "2026-04-01",
      lenderPhone: null,
      dueDate: null,
      notes: "",
    });
  });

  it("clears a repayment reference with null", () => {
    expect(
      toRepaymentBody(
        { amount: 50, date: "2026-05-01", method: "cash", reference: "", notes: "  " },
        "update"
      )
    ).toEqual({
      amount: 50,
      date: "2026-05-01",
      method: "cash",
      reference: null,
      notes: "",
    });
  });
});

describe("loanErrorMessage", () => {
  it("returns the backend 400 message unchanged", () => {
    const message = "This repayment of GHS 10.01 would exceed the remaining balance of GHS 10.00.";
    expect(
      loanErrorMessage({ response: { data: { success: false, message } } }, "Could not record repayment.")
    ).toBe(message);
    expect(
      loanErrorMessage(
        { response: { data: { success: false, message: "Repayment date cannot be in the future." } } },
        "Could not record repayment."
      )
    ).toBe("Repayment date cannot be in the future.");
    expect(
      loanErrorMessage(
        {
          response: {
            data: { success: false, message: "Principal of GHS 10.00 is less than the GHS 25.00 already repaid." },
          },
        },
        "Could not update the loan."
      )
    ).toBe("Principal of GHS 10.00 is less than the GHS 25.00 already repaid.");
  });
});
