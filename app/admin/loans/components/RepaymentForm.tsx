"use client";

import { FormEvent, useState } from "react";
import type { RepaymentInput, RepaymentMethod } from "../../../services/loanService";
import { REPAYMENT_METHOD_LABELS, formatGhs, todayInputValue } from "../format";

const field = "mt-1 w-full rounded-md border border-[#b9aca2]/70 bg-white px-3 py-2";
const METHODS = Object.keys(REPAYMENT_METHOD_LABELS) as RepaymentMethod[];

/** API fields are `null` when empty; omitted form fields are `undefined`. Both mean blank. */
export type RepaymentFormInitial = {
  amount?: number | null;
  date?: string | null;
  method?: RepaymentMethod | null;
  reference?: string | null;
  notes?: string | null;
};

function blank(value: string | null | undefined): string {
  return value ?? "";
}

export default function RepaymentForm({
  initial,
  available,
  submitLabel,
  saving,
  onSubmit,
  onCancel,
}: {
  initial?: RepaymentFormInitial;
  available: number;
  submitLabel: string;
  saving: boolean;
  onSubmit: (input: RepaymentInput) => void;
  onCancel?: () => void;
}) {
  const [amount, setAmount] = useState(
    initial?.amount != null && initial.amount > 0 ? String(initial.amount) : ""
  );
  const [date, setDate] = useState(blank(initial?.date) || todayInputValue());
  const [method, setMethod] = useState<RepaymentMethod>(initial?.method ?? "cash");
  const [reference, setReference] = useState(blank(initial?.reference));
  const [notes, setNotes] = useState(blank(initial?.notes));
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) {
      setFormError("Enter a repayment amount greater than zero.");
      return;
    }
    if (!date) {
      setFormError("Choose the repayment date.");
      return;
    }
    setFormError("");
    onSubmit({
      amount: value,
      date,
      method,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      <label className="text-sm font-medium text-[#222222]">
        Amount (GHS)
        <input
          type="number"
          min={0.01}
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={field}
          required
        />
        <span className="mt-1 block text-xs font-normal text-[#5d6043]">
          Up to {formatGhs(available)} can be recorded. A larger amount is rejected.
        </span>
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={field}
          required
        />
        <span className="mt-1 block text-xs font-normal text-[#5d6043]">
          A future date is rejected.
        </span>
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Method
        <select
          value={method}
          onChange={(event) => setMethod(event.target.value as RepaymentMethod)}
          className={field}
        >
          {METHODS.map((value) => (
            <option key={value} value={value}>
              {REPAYMENT_METHOD_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium text-[#222222]">
        Reference (optional)
        <input
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className={field}
          placeholder="MoMo or bank reference"
        />
      </label>
      <label className="text-sm font-medium text-[#222222] md:col-span-2">
        Notes (optional)
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
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
