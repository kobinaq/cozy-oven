import type { LoanStatus } from "../../../services/loanService";
import { LOAN_STATUS_LABELS } from "../format";

const STYLES: Record<LoanStatus, string> = {
  active: "bg-green-100 text-green-700",
  paid: "bg-[#e7e2da] text-[#5d6043]",
  overdue: "bg-red-100 text-red-700",
};

export default function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LOAN_STATUS_LABELS[status]}
    </span>
  );
}
