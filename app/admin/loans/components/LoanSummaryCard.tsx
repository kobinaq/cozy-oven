"use client";

import { ArrowRight01Icon, BankIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import loanService, {
  type LoanSummary,
  loanErrorMessage,
} from "../../../services/loanService";
import AdminIcon from "../../components/AdminIcon";
import { formatGhs, formatLoanDate } from "../format";

export default function LoanSummaryCard() {
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await loanService.summary();
        if (!cancelled) setSummary(data);
      } catch (requestError: unknown) {
        if (!cancelled) {
          setError(loanErrorMessage(requestError, "Loan totals are unavailable right now."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-[#b9aca2]/40 bg-[#faf9f5] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#5d6043]">Total owed on loans</p>
          {loading ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-[#5d6043]">
              <AdminIcon icon={Loading03Icon} size={16} className="animate-spin" />
              Loading loan totals...
            </p>
          ) : error ? (
            <p className="mt-2 text-sm text-[#5d6043]" role="status">
              {error}
            </p>
          ) : summary ? (
            <>
              <h3 className="mt-2 text-2xl font-bold text-[#222222]">
                {formatGhs(summary.totalOwed)}
              </h3>
              <p className="mt-1 text-xs text-[#5d6043]">
                {summary.activeCount} active
                {" · "}
                <span className={summary.overdueCount > 0 ? "font-medium text-red-700" : undefined}>
                  {summary.overdueCount} overdue
                </span>
              </p>
              <p className="mt-1 text-xs text-[#5d6043]">
                Borrowed {formatGhs(summary.totalBorrowed)} · Repaid {formatGhs(summary.totalRepaid)}
              </p>
            </>
          ) : null}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e7e2da]">
          <AdminIcon icon={BankIcon} size={24} className="text-[#5d6043]" />
        </div>
      </div>

      {!loading && summary ? (
        <div className="mt-4 border-t border-[#b9aca2]/40 pt-4 text-sm text-[#222222]">
          {summary.nextDue ? (
            <p>
              Next due:{" "}
              <Link
                href={`/admin/loans/${summary.nextDue.loanId}`}
                className="font-medium text-[#5d6043] hover:underline"
              >
                {summary.nextDue.lender}
              </Link>
              {" · "}
              {formatLoanDate(summary.nextDue.dueDate)}
              {" · "}
              {formatGhs(summary.nextDue.balance)}
            </p>
          ) : (
            <p className="text-[#5d6043]">No loan has a due date coming up.</p>
          )}
        </div>
      ) : null}

      <Link
        href="/admin/loans"
        className="mt-4 inline-flex items-center gap-2 font-medium text-[#5d6043] hover:underline"
      >
        View loans
        <AdminIcon icon={ArrowRight01Icon} size={16} />
      </Link>
    </section>
  );
}
