import type { LoanStatus, RepaymentMethod } from "../../services/loanService";

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  active: "Active",
  paid: "Paid",
  overdue: "Overdue",
};

export const REPAYMENT_METHOD_LABELS: Record<RepaymentMethod, string> = {
  cash: "Cash",
  momo: "Mobile Money",
  bank: "Bank",
  other: "Other",
};

export function formatGhs(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `GHS ${value.toFixed(2)}`;
}

/**
 * Calendar date as dd/mm/yyyy.
 * API dates are ISO strings at UTC midnight (the Ghana day). The date portion
 * is used so the displayed day does not shift with the browser timezone.
 */
export function formatLoanDate(value?: string | null): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

/** Value for `<input type="date">` from an API date or datetime. */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : "";
}

export function todayInputValue(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Share of principal already repaid, clamped to 0–100. */
export function repaymentPercent(principal: number, totalRepaid: number): number {
  if (!(principal > 0) || !Number.isFinite(totalRepaid)) return 0;
  const percent = (totalRepaid / principal) * 100;
  if (!Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(100, percent));
}
