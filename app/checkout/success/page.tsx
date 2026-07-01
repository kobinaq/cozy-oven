import Link from 'next/link';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { checkoutid?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f5]">
      <div className="p-8 bg-[#faf9f5] rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-2">Payment successful 🎉</h1>

        <p className="text-[#5d6043] mb-4">
          Thanks for your payment. We’ve received it successfully.
        </p>

        {searchParams.checkoutid && (
          <p className="text-sm text-[#5d6043] mb-6">
            Reference:{' '}
            <span className="font-mono">{searchParams.checkoutid}</span>
          </p>
        )}

        <Link
          href="/"
          className="inline-block rounded-md bg-[#5d6043] px-6 py-3 text-[#faf9f5] font-semibold hover:bg-[#222222] transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
