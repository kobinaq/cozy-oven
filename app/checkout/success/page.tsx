import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { checkoutid?: string };
}) {
  return (
    <div className="premium-shell flex min-h-screen items-center justify-center px-4">
      <div className="premium-card max-w-md rounded-2xl p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[#231913]">Payment successful</h1>

        <p className="mb-4 text-[#6b5d50]">Thanks for your payment. We have received it successfully.</p>

        {searchParams.checkoutid && (
          <p className="mb-6 text-sm text-[#8a7b6b]">
            Reference: <span className="font-mono">{searchParams.checkoutid}</span>
          </p>
        )}

        <Link href="/" className="premium-button inline-block px-6 py-3">
          Go back home
        </Link>
      </div>
    </div>
  );
}
