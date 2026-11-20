"use client";

import {
  ArrowLeft01Icon,
  Delete02Icon,
  Loading03Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import loanService, {
  type Loan,
  type LoanInput,
  type LoanRepayment,
  type RepaymentInput,
  loanErrorMessage,
} from "../../../services/loanService";
import AdminIcon from "../../components/AdminIcon";
import AdminLayout from "../../components/AdminLayout";
import AdminPageHeader from "../../components/AdminPageHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import LoanForm from "../components/LoanForm";
import LoanProgress from "../components/LoanProgress";
import LoanStatusBadge from "../components/LoanStatusBadge";
import RepaymentForm from "../components/RepaymentForm";
import { REPAYMENT_METHOD_LABELS, formatGhs, formatLoanDate, toDateInputValue } from "../format";

type PendingDelete =
  | { kind: "loan" }
  | { kind: "repayment"; repayment: LoanRepayment };

export default function AdminLoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingLoan, setEditingLoan] = useState(false);
  const [editingRepayment, setEditingRepayment] = useState<LoanRepayment | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh" = "refresh") => {
    if (!id) return;
    if (mode === "initial") setLoading(true);
    try {
      setLoan(await loanService.get(id));
      setError("");
    } catch (requestError: unknown) {
      if (mode === "initial") setLoan(null);
      setError(loanErrorMessage(requestError, "Could not load this loan."));
    } finally {
      if (mode === "initial") setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load("initial");
  }, [load]);

  const repayments = loan?.repayments ?? [];

  const saveLoan = async (input: LoanInput) => {
    if (!loan) return;
    setSaving(true);
    setError("");
    try {
      setLoan(await loanService.update(loan.id, input));
      setEditingLoan(false);
    } catch (requestError: unknown) {
      setError(loanErrorMessage(requestError, "Could not update the loan."));
    } finally {
      setSaving(false);
    }
  };

  const saveRepayment = async (input: RepaymentInput) => {
    if (!loan) return;
    setSaving(true);
    setError("");
    try {
      const updated = editingRepayment
        ? await loanService.updateRepayment(loan.id, editingRepayment.id, input)
        : await loanService.addRepayment(loan.id, input);
      setLoan(updated);
      setEditingRepayment(null);
    } catch (requestError: unknown) {
      setError(loanErrorMessage(requestError, "Could not record the repayment."));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!loan || !pendingDelete) return;
    setSaving(true);
    setError("");
    try {
      if (pendingDelete.kind === "loan") {
        await loanService.remove(loan.id);
        router.push("/admin/loans");
        return;
      }
      setLoan(await loanService.removeRepayment(loan.id, pendingDelete.repayment.id));
      if (editingRepayment?.id === pendingDelete.repayment.id) {
        setEditingRepayment(null);
      }
      setPendingDelete(null);
    } catch (requestError: unknown) {
      setError(loanErrorMessage(requestError, "Could not delete that record."));
      setPendingDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const available = loan
    ? loan.balance + (editingRepayment ? editingRepayment.amount : 0)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          href="/admin/loans"
          className="inline-flex items-center gap-1 text-sm text-[#5d6043] hover:underline"
        >
          <AdminIcon icon={ArrowLeft01Icon} size={16} />
          All loans
        </Link>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-[#5d6043]">
            <AdminIcon icon={Loading03Icon} size={17} className="animate-spin" />
            Loading loan...
          </p>
        ) : !loan ? (
          <p className="text-sm text-red-700" role="alert">
            {error || "This loan was not found."}
          </p>
        ) : (
          <>
            <AdminPageHeader
              title={loan.lender}
              description={
                loan.lenderPhone
                  ? loan.lenderPhone
                  : "Business loan. Balance is principal minus repayments."
              }
              actions={
                <>
                  <LoanStatusBadge status={loan.status} />
                  <button
                    type="button"
                    onClick={() => setEditingLoan((open) => !open)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#b9aca2] px-3 py-2 text-sm"
                  >
                    <AdminIcon icon={PencilEdit02Icon} size={16} />
                    {editingLoan ? "Close edit" : "Edit loan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ kind: "loan" })}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
                  >
                    <AdminIcon icon={Delete02Icon} size={16} />
                    Delete
                  </button>
                </>
              }
            />

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Principal" value={formatGhs(loan.principal)} />
              <Stat label="Repaid" value={formatGhs(loan.totalRepaid)} />
              <Stat label="Balance" value={formatGhs(loan.balance)} />
              <Stat
                label="Due"
                value={loan.dueDate ? formatLoanDate(loan.dueDate) : "No due date"}
                tone={loan.status === "overdue" ? "danger" : "default"}
              />
            </section>

            <div className="max-w-md">
              <LoanProgress principal={loan.principal} totalRepaid={loan.totalRepaid} />
            </div>

            <p className="text-sm text-[#5d6043]">
              Started {formatLoanDate(loan.startDate)}
              {loan.dueDate
                ? ". SMS reminders go to the admin numbers 3 days before this date and on the due date."
                : ". Set a due date to text the admin numbers 3 days before and on the due date."}
            </p>
            {loan.notes ? (
              <p className="rounded-xl border border-[#b9aca2]/40 bg-white/60 px-4 py-3 text-sm text-[#222222]">
                {loan.notes}
              </p>
            ) : null}

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            {editingLoan ? (
              <section className="rounded-2xl border border-[#b9aca2]/40 bg-white/70 p-4 md:p-5">
                <h2 className="mb-3 text-lg font-semibold text-[#222222]">Edit loan</h2>
                <LoanForm
                  key={`${loan.id}-${loan.principal}-${loan.dueDate ?? ""}-${loan.notes ?? ""}`}
                  initial={{
                    lender: loan.lender,
                    lenderPhone: loan.lenderPhone,
                    principal: loan.principal,
                    startDate: toDateInputValue(loan.startDate),
                    dueDate: toDateInputValue(loan.dueDate),
                    notes: loan.notes,
                  }}
                  submitLabel="Update loan"
                  saving={saving}
                  onSubmit={saveLoan}
                  onCancel={() => setEditingLoan(false)}
                />
              </section>
            ) : null}

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#222222]">Repayments</h2>
              {loan.balance <= 0 && !editingRepayment ? (
                <p className="text-sm text-[#5d6043]">
                  This loan is paid off. Adjust or remove a repayment if a payment was recorded by mistake.
                </p>
              ) : (
                <div className="rounded-2xl border border-[#b9aca2]/40 bg-white/70 p-4 md:p-5">
                  <h3 className="mb-3 font-medium text-[#222222]">
                    {editingRepayment ? "Update repayment" : "Record repayment"}
                  </h3>
                  <RepaymentForm
                    key={editingRepayment?.id ?? "new"}
                    initial={
                      editingRepayment
                        ? {
                            amount: editingRepayment.amount,
                            date: toDateInputValue(editingRepayment.date),
                            method: editingRepayment.method,
                            reference: editingRepayment.reference,
                            notes: editingRepayment.notes,
                          }
                        : undefined
                    }
                    available={available}
                    submitLabel={editingRepayment ? "Update repayment" : "Record repayment"}
                    saving={saving}
                    onSubmit={saveRepayment}
                    onCancel={editingRepayment ? () => setEditingRepayment(null) : undefined}
                  />
                </div>
              )}

              {repayments.length === 0 ? (
                <p className="text-sm text-[#5d6043]">No repayments yet.</p>
              ) : (
                <>
                  <ul className="grid gap-3 lg:hidden">
                    {repayments.map((repayment) => (
                      <li
                        key={repayment.id}
                        className="rounded-2xl border border-[#b9aca2]/50 bg-[#faf9f5] p-4 text-sm"
                      >
                        <RepaymentSummary repayment={repayment} />
                        <RepaymentActions
                          onEdit={() => setEditingRepayment(repayment)}
                          onDelete={() => setPendingDelete({ kind: "repayment", repayment })}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[720px] text-sm">
                      <caption className="sr-only">Repayment history, newest first</caption>
                      <thead>
                        <tr className="border-b border-[#b9aca2]/60 text-left text-[#5d6043]">
                          <th className="py-3 pr-3 font-medium">Date</th>
                          <th className="py-3 pr-3 font-medium">Amount</th>
                          <th className="py-3 pr-3 font-medium">Method</th>
                          <th className="py-3 pr-3 font-medium">Reference</th>
                          <th className="py-3 font-medium" />
                        </tr>
                      </thead>
                      <tbody>
                        {repayments.map((repayment) => (
                          <tr key={repayment.id} className="border-b border-[#b9aca2]/40">
                            <td className="py-3 pr-3">{formatLoanDate(repayment.date)}</td>
                            <td className="py-3 pr-3 font-semibold">{formatGhs(repayment.amount)}</td>
                            <td className="py-3 pr-3">{REPAYMENT_METHOD_LABELS[repayment.method]}</td>
                            <td className="py-3 pr-3">
                              {repayment.reference || "—"}
                              {repayment.notes ? (
                                <span className="block text-xs font-normal text-[#5d6043]">{repayment.notes}</span>
                              ) : null}
                            </td>
                            <td className="py-3 text-right">
                              <RepaymentActions
                                onEdit={() => setEditingRepayment(repayment)}
                                onDelete={() => setPendingDelete({ kind: "repayment", repayment })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.kind === "loan" ? "Delete this loan?" : "Delete this repayment?"}
        message={
          pendingDelete?.kind === "loan"
            ? "The loan and its repayment history will be removed. This cannot be undone."
            : "The balance will go back up by this repayment amount."
        }
        confirmLabel="Delete"
        busy={saving}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!saving) setPendingDelete(null);
        }}
      />
    </AdminLayout>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-2xl border border-[#b9aca2]/40 bg-[#faf9f5] p-4 shadow-sm">
      <p className="text-xs text-[#5d6043]">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone === "danger" ? "text-red-700" : "text-[#222222]"}`}>
        {value}
      </p>
    </div>
  );
}

function RepaymentSummary({ repayment }: { repayment: LoanRepayment }) {
  return (
    <div>
      <p className="font-semibold text-[#222222]">{formatGhs(repayment.amount)}</p>
      <p className="text-[#5d6043]">
        {formatLoanDate(repayment.date)} · {REPAYMENT_METHOD_LABELS[repayment.method]}
      </p>
      {repayment.reference ? <p className="text-xs text-[#5d6043]">{repayment.reference}</p> : null}
      {repayment.notes ? <p className="text-xs text-[#5d6043]">{repayment.notes}</p> : null}
    </div>
  );
}

function RepaymentActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="mt-3 flex justify-end gap-1 lg:mt-0">
      <button type="button" onClick={onEdit} className="rounded-md p-2" aria-label="Edit repayment">
        <AdminIcon icon={PencilEdit02Icon} size={17} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md p-2 text-red-700"
        aria-label="Delete repayment"
      >
        <AdminIcon icon={Delete02Icon} size={17} />
      </button>
    </div>
  );
}
