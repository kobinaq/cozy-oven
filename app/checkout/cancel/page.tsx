import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="premium-shell flex min-h-screen items-center justify-center px-4">
      <div className="premium-card max-w-md rounded-2xl p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[#231913]">Payment Cancelled</h1>

        <p className="mb-6 text-[#6b5d50]">
          Your payment was cancelled. If this was a mistake, please try again.
        </p>

        <Link href="/" className="premium-button inline-block px-6 py-3">
          Go back home
        </Link>
      </div>
    </div>
  );
}
