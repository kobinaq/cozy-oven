import apiClient from "./apiClient";

export type LoanStatus = "active" | "paid" | "overdue";
export type RepaymentMethod = "cash" | "momo" | "bank" | "other";

/** Repayment on a loan detail or write response. Newest date, then newest createdAt, first. */
export interface LoanRepayment {
  id: string;
  amount: number;
  date: string;
  method: RepaymentMethod;
  reference: string | null;
  notes: string;
  createdAt: string;
}

/**
 * Loan from kobinaq/cozy-oven-bakery-backend PR 33.
 * List items omit repayments (the array is empty here). Detail and writes include them.
 * lenderPhone and dueDate are null when empty. notes is "" when empty.
 * Dates are ISO strings at UTC midnight, the Ghana calendar day.
 */
export interface Loan {
  id: string;
  lender: string;
  lenderPhone: string | null;
  principal: number;
  startDate: string;
  dueDate: string | null;
  notes: string;
  totalRepaid: number;
  balance: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
  repayments: LoanRepayment[];
}

export interface LoanList {
  count: number;
  loans: Loan[];
}

export interface LoanNextDue {
  loanId: string;
  lender: string;
  dueDate: string;
  balance: number;
}

export interface LoanSummary {
  totalOwed: number;
  totalBorrowed: number;
  totalRepaid: number;
  activeCount: number;
  overdueCount: number;
  nextDue: LoanNextDue | null;
}

export interface LoanInput {
  lender: string;
  lenderPhone?: string;
  principal: number;
  startDate: string;
  dueDate?: string;
  notes?: string;
}

export interface RepaymentInput {
  amount: number;
  date: string;
  method: RepaymentMethod;
  reference?: string;
  notes?: string;
}

const STATUSES = new Set<LoanStatus>(["active", "paid", "overdue"]);
const METHODS = new Set<RepaymentMethod>(["cash", "momo", "bank", "other"]);

export class LoanResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoanResponseError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readNotes(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Null and blank strings are empty optional fields. */
function readNullable(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readId(value: unknown): string {
  return typeof value === "string" && value.trim() ? value : "";
}

function successData(body: unknown): Record<string, unknown> {
  if (!isRecord(body) || body.success !== true) {
    const message =
      isRecord(body) && typeof body.message === "string" && body.message.trim()
        ? body.message
        : "The server did not return a loan.";
    throw new LoanResponseError(message);
  }
  if (!isRecord(body.data)) {
    throw new LoanResponseError("The server did not return a loan.");
  }
  return body.data;
}

export function normalizeRepayment(raw: unknown): LoanRepayment | null {
  if (!isRecord(raw)) return null;
  const id = readId(raw.id);
  if (!id) return null;
  const methodRaw = typeof raw.method === "string" ? raw.method : "";
  const method = METHODS.has(methodRaw as RepaymentMethod)
    ? (methodRaw as RepaymentMethod)
    : "other";
  return {
    id,
    amount: readNumber(raw.amount),
    date: typeof raw.date === "string" ? raw.date : "",
    method,
    reference: readNullable(raw.reference),
    notes: readNotes(raw.notes),
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
  };
}

export function normalizeLoan(raw: unknown): Loan | null {
  if (!isRecord(raw)) return null;
  const id = readId(raw.id);
  const lender = typeof raw.lender === "string" ? raw.lender.trim() : "";
  if (!id || !lender) return null;
  const statusRaw = typeof raw.status === "string" ? raw.status : "";
  const status = STATUSES.has(statusRaw as LoanStatus)
    ? (statusRaw as LoanStatus)
    : "active";
  const repayments = Array.isArray(raw.repayments)
    ? raw.repayments
        .map(normalizeRepayment)
        .filter((row): row is LoanRepayment => row !== null)
    : [];
  return {
    id,
    lender,
    lenderPhone: readNullable(raw.lenderPhone),
    principal: readNumber(raw.principal),
    startDate: typeof raw.startDate === "string" ? raw.startDate : "",
    dueDate: readNullable(raw.dueDate),
    notes: readNotes(raw.notes),
    totalRepaid: readNumber(raw.totalRepaid),
    balance: readNumber(raw.balance),
    status,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
    repayments,
  };
}

/** `{ success: true, count, data: Loan[] }`. List loans have no repayments. */
export function normalizeLoanList(body: unknown): LoanList {
  if (!isRecord(body) || body.success !== true || !Array.isArray(body.data)) {
    throw new LoanResponseError(
      isRecord(body) && typeof body.message === "string" && body.message.trim()
        ? body.message
        : "Could not read the loan list."
    );
  }
  const loans = body.data
    .map(normalizeLoan)
    .filter((loan): loan is Loan => loan !== null);
  return {
    count: typeof body.count === "number" ? body.count : loans.length,
    loans,
  };
}

/** Detail and write responses: `{ success: true, data: Loan }` with repayments. */
export function normalizeLoanDetail(body: unknown): Loan {
  const loan = normalizeLoan(successData(body));
  if (!loan) {
    throw new LoanResponseError("The server did not return a loan.");
  }
  return loan;
}

export function normalizeSummary(body: unknown): LoanSummary {
  if (!isRecord(body) || body.success !== true || !isRecord(body.data)) {
    throw new LoanResponseError(
      isRecord(body) && typeof body.message === "string" && body.message.trim()
        ? body.message
        : "Could not read loan totals."
    );
  }
  const source = body.data;
  const nextRaw = source.nextDue;
  let nextDue: LoanNextDue | null = null;
  if (isRecord(nextRaw)) {
    const loanId = readId(nextRaw.loanId);
    const lender = typeof nextRaw.lender === "string" ? nextRaw.lender.trim() : "";
    const dueDate = typeof nextRaw.dueDate === "string" ? nextRaw.dueDate : "";
    if (loanId && lender && dueDate) {
      nextDue = {
        loanId,
        lender,
        dueDate,
        balance: readNumber(nextRaw.balance),
      };
    }
  }
  return {
    totalOwed: readNumber(source.totalOwed),
    totalBorrowed: readNumber(source.totalBorrowed),
    totalRepaid: readNumber(source.totalRepaid),
    activeCount: readNumber(source.activeCount),
    overdueCount: readNumber(source.overdueCount),
    nextDue,
  };
}

/** Shows `{ success: false, message }` from a 400 exactly as the backend sent it. */
export function loanErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof LoanResponseError && error.message) return error.message;
  if (!isRecord(error) || !isRecord(error.response)) return fallback;
  const data = error.response.data;
  if (isRecord(data) && typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  return fallback;
}

function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() || "";
  return trimmed ? trimmed : null;
}

/**
 * Create omits blank optional fields.
 * Update sends lenderPhone: null and dueDate: null to clear them, and notes: "" when empty.
 */
export function toLoanBody(input: LoanInput, mode: "create" | "update") {
  const body: Record<string, unknown> = {
    lender: input.lender.trim(),
    principal: input.principal,
    startDate: input.startDate,
  };
  const lenderPhone = blankToNull(input.lenderPhone);
  const dueDate = blankToNull(input.dueDate);
  const notes = input.notes?.trim() || "";
  if (mode === "create") {
    if (lenderPhone) body.lenderPhone = lenderPhone;
    if (dueDate) body.dueDate = dueDate;
    if (notes) body.notes = notes;
  } else {
    body.lenderPhone = lenderPhone;
    body.dueDate = dueDate;
    body.notes = notes;
  }
  return body;
}

/** Update sends reference: null to clear it, and notes: "" when empty. */
export function toRepaymentBody(input: RepaymentInput, mode: "create" | "update") {
  const body: Record<string, unknown> = {
    amount: input.amount,
    date: input.date,
    method: input.method,
  };
  const reference = blankToNull(input.reference);
  const notes = input.notes?.trim() || "";
  if (mode === "create") {
    if (reference) body.reference = reference;
    if (notes) body.notes = notes;
  } else {
    body.reference = reference;
    body.notes = notes;
  }
  return body;
}

const loanService = {
  async list(status?: LoanStatus): Promise<LoanList> {
    const response = await apiClient.get("/api/v1/loans", {
      params: status ? { status } : undefined,
    });
    return normalizeLoanList(response.data);
  },

  async summary(): Promise<LoanSummary> {
    const response = await apiClient.get("/api/v1/loans/summary");
    return normalizeSummary(response.data);
  },

  async get(id: string): Promise<Loan> {
    const response = await apiClient.get(`/api/v1/loans/${encodeURIComponent(id)}`);
    return normalizeLoanDetail(response.data);
  },

  async create(input: LoanInput): Promise<Loan> {
    const response = await apiClient.post("/api/v1/loans", toLoanBody(input, "create"));
    return normalizeLoanDetail(response.data);
  },

  async update(id: string, input: LoanInput): Promise<Loan> {
    const response = await apiClient.patch(
      `/api/v1/loans/${encodeURIComponent(id)}`,
      toLoanBody(input, "update")
    );
    return normalizeLoanDetail(response.data);
  },

  async remove(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/v1/loans/${encodeURIComponent(id)}`);
    const body = response.data;
    if (!isRecord(body) || body.success !== true) {
      throw new LoanResponseError(
        isRecord(body) && typeof body.message === "string" && body.message.trim()
          ? body.message
          : "Could not delete the loan."
      );
    }
  },

  async addRepayment(loanId: string, input: RepaymentInput): Promise<Loan> {
    const response = await apiClient.post(
      `/api/v1/loans/${encodeURIComponent(loanId)}/repayments`,
      toRepaymentBody(input, "create")
    );
    return normalizeLoanDetail(response.data);
  },

  async updateRepayment(
    loanId: string,
    repaymentId: string,
    input: RepaymentInput
  ): Promise<Loan> {
    const response = await apiClient.patch(
      `/api/v1/loans/${encodeURIComponent(loanId)}/repayments/${encodeURIComponent(repaymentId)}`,
      toRepaymentBody(input, "update")
    );
    return normalizeLoanDetail(response.data);
  },

  async removeRepayment(loanId: string, repaymentId: string): Promise<Loan> {
    const response = await apiClient.delete(
      `/api/v1/loans/${encodeURIComponent(loanId)}/repayments/${encodeURIComponent(repaymentId)}`
    );
    return normalizeLoanDetail(response.data);
  },
};

export default loanService;
