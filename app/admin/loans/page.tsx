"use client";

import { Add01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import loanService, {
  type Loan,
  type LoanInput,
  type LoanStatus,
  loanErrorMessage,
} from "../../services/loanService";
import AdminIcon from "../components/AdminIcon";
import AdminLayout from "../components/AdminLayout";
import AdminPageHeader from "../components/AdminPageHeader";
import { formatGhs, formatLoanDate, LOAN_STATUS_LABELS } from "./format";
import LoanForm from "./components/LoanForm";
import LoanProgress from "./components/LoanProgress";
import LoanStatusBadge from "./components/LoanStatusBadge";

type StatusFilter = "all" | LoanStatus;

const FILTERS: StatusFilter[] = ["all", "active", "paid", "overdue"];

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loanService.list(status === "all" ? undefined : status);
      setLoans(result.loans);
      setCount(result.count);
      setError("");
    } catch (requestError: unknown) {
      setError(loanErrorMessage(requestError, "Could not load loans."));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const createLoan = async (input: LoanInput) => {
    setSaving(true);
    setError("");
    try {
      await loanService.create(input);
      setShowForm(false);
      await load();
    } catch (requestError: unknown) {
      setError(loanErrorMessage(requestError, "Could not add the loan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Loans"
          description="Money the bakery has borrowed. Balance is the principal minus repayments, with no interest."
          actions={
            <button
              type="button"
              onClick={() => setShowForm((open) => !open)}
              className="inline-flex items-center gap-2 rounded-md bg-[#5d6043] px-4 py-2 text-white"
            >
              <AdminIcon icon={Add01Icon} size={17} />
              {showForm ? "Hide form" : "Add loan"}
            </button>
          }
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter loans by status">
          {FILTERS.map((value) => {
            const selected = status === value;
            const label = value === "all" ? "All" : LOAN_STATUS_LABELS[value];
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setStatus(value)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  selected
                    ? "bg-[#5d6043] text-white"
                    : "border border-[#b9aca2]/70 bg-white text-[#5d6043]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {showForm ? (
          <section className="rounded-2xl border border-[#b9aca2]/40 bg-white/70 p-4 md:p-5">
            <h2 className="mb-3 text-lg font-semibold text-[#222222]">Add loan</h2>
            <LoanForm
              key={showForm ? "open" : "closed"}
              submitLabel="Save loan"
              saving={saving}
              onSubmit={createLoan}
              onCancel={() => setShowForm(false)}
            />
          </section>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-[#5d6043]">
            <AdminIcon icon={Loading03Icon} size={17} className="animate-spin" />
            Loading loans...
          </p>
        ) : loans.length === 0 ? (
          <p className="text-sm text-[#5d6043]">
            {status === "all"
              ? "No loans yet. Add the first amount the bakery has borrowed."
              : `No ${LOAN_STATUS_LABELS[status].toLowerCase()} loans.`}
          </p>
        ) : (
          <>
            <p className="text-sm text-[#5d6043]">
              {count} {count === 1 ? "loan" : "loans"}
            </p>
            <ul className="grid gap-3 lg:hidden">
              {loans.map((loan) => (
                <li key={loan.id}>
                  <Link
                    href={`/admin/loans/${loan.id}`}
                    className="block rounded-2xl border border-[#b9aca2]/50 bg-[#faf9f5] p-4 shadow-sm"
                  >
                    <LoanCard loan={loan} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-[#b9aca2]/60 text-left text-[#5d6043]">
                    <th className="py-3 pr-3 font-medium">Lender</th>
                    <th className="py-3 pr-3 font-medium">Principal</th>
                    <th className="py-3 pr-3 font-medium">Repaid</th>
                    <th className="py-3 pr-3 font-medium">Balance</th>
                    <th className="py-3 pr-3 font-medium">Due</th>
                    <th className="py-3 pr-3 font-medium">Status</th>
                    <th className="py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b border-[#b9aca2]/40">
                      <td className="py-3 pr-3">
                        <Link href={`/admin/loans/${loan.id}`} className="font-medium text-[#222222] hover:underline">
                          {loan.lender}
                        </Link>
                        {loan.lenderPhone ? (
                          <span className="block text-xs text-[#5d6043]">{loan.lenderPhone}</span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3">{formatGhs(loan.principal)}</td>
                      <td className="py-3 pr-3">{formatGhs(loan.totalRepaid)}</td>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-[#222222]">{formatGhs(loan.balance)}</p>
                        <LoanProgress principal={loan.principal} totalRepaid={loan.totalRepaid} />
                      </td>
                      <td className={`py-3 pr-3 ${loan.status === "overdue" ? "text-red-700" : ""}`}>
                        {loan.dueDate ? formatLoanDate(loan.dueDate) : "No due date"}
                      </td>
                      <td className="py-3 pr-3">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/loans/${loan.id}`} className="font-medium text-[#5d6043] hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function LoanCard({ loan }: { loan: Loan }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#222222]">{loan.lender}</p>
          {loan.lenderPhone ? <p className="text-xs text-[#5d6043]">{loan.lenderPhone}</p> : null}
        </div>
        <LoanStatusBadge status={loan.status} />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-[#5d6043]">Principal</dt>
          <dd>{formatGhs(loan.principal)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#5d6043]">Repaid</dt>
          <dd>{formatGhs(loan.totalRepaid)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#5d6043]">Balance</dt>
          <dd className="font-semibold">{formatGhs(loan.balance)}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#5d6043]">Due</dt>
          <dd className={loan.status === "overdue" ? "text-red-700" : undefined}>
            {loan.dueDate ? formatLoanDate(loan.dueDate) : "No due date"}
          </dd>
        </div>
      </dl>
      <LoanProgress principal={loan.principal} totalRepaid={loan.totalRepaid} />
    </div>
  );
}
