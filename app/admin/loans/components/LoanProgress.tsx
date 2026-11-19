import { repaymentPercent } from "../format";

export default function LoanProgress({
  principal,
  totalRepaid,
}: {
  principal: number;
  totalRepaid: number;
}) {
  const percent = Math.round(repaymentPercent(principal, totalRepaid));
  return (
    <div className="min-w-[7.5rem]">
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[#b9aca2]/50"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% of principal repaid`}
      >
        <div
          className="h-full rounded-full bg-[#5d6043]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-[#5d6043]">{percent}% repaid</p>
    </div>
  );
}
