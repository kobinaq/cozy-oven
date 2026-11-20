"use client";

import { FormEvent, useState } from "react";
import type { LoanInput } from "../../../services/loanService";
import { todayInputValue } from "../format";

const field = "mt-1 w-full rounded-md border border-[#b9aca2]/70 bg-white px-3 py-2";

/** API fields are `null` when empty; omitted form fields are `undefined`. Both mean blank. */
export type LoanFormInitial = {
  lender?: string | null;
  lenderPhone?: string | null;
  principal?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  notes?: string | null;
};

function blank(value: string | null | undefined): string {
  return value ?? "";
}

export default function LoanForm({
  initial,
  submitLabel,
  saving,
  onSubmit,
  onCancel,
}: {
  initial?: LoanFormInitial;
  submitLabel: string;
  saving: boolean;
  onSubmit: (input: LoanInput) => void;
  onCancel?: () => void;
}) {
  const [lender, setLender] = useState(blank(initial?.lender));
  const [lenderPhone, setLenderPhone] = useState(blank(initial?.lenderPhone));
  const [principal, setPrincipal] = useState(
    initial?.principal != null && initial.principal > 0 ? String(initial.principal) : ""
  );
  const [startDate, setStartDate] = useState(blank(initial?.startDate) || todayInputValue());
  const [dueDate, setDueDate] = useState(blank(initial?.dueDate));
  const [notes, setNotes] = useState(blank(initial?.notes));
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(principal);
    if (!lender.trim()) {
      setFormError("Enter the lender name.");
      return;
    }
    if (!(amount > 0)) {
      setFormError("Principal must be greater than zero.");
      return;
    }
    if (!startDate) {
      setFormError("Choose the date the money was received.");
      return;
    }
    if (dueDate && dueDate < startDate) {
      setFormError("Due date cannot be before the start date.");
      return;
    }
    setFormError("");
    onSubmit({
      lender: lender.trim(),
      lenderPhone: lenderPhone.trim() || undefined,
      principal: amount,
      startDate,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      <label className="text-sm font-medium text-[#222222]">
        Lender
        <input
          value={lender}
          onChange={(event) => setLender(event.target.value)}
          className={field}
          placeholder="Who lent the bakery this money"
          required
        />
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Phone (optional)
        <input
          type="tel"
          value={lenderPhone}
          onChange={(event) => setLenderPhone(event.target.value)}
          className={field}
          placeholder="024 000 0000"
        />
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Principal (GHS)
        <input
          type="number"
          min={0.01}
          step="0.01"
          value={principal}
          onChange={(event) => setPrincipal(event.target.value)}
          className={field}
          required
        />
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Start date
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className={field}
          required
        />
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Due date (optional)
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className={field}
        />
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Notes (optional)
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          className={field}
        />
      </label>
      {formError ? (
        <p className="text-sm text-red-700 md:col-span-2" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#5d6043] px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md border border-[#b9aca2] px-4 py-2 disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
