"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useEffect, Suspense } from "react";

function OrderSuccessContent() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "CO12345678";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <main className="premium-shell min-h-screen pb-20 pt-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="premium-card rounded-2xl p-8 text-center md:p-12">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-[#231913] md:text-4xl">
              Thanks, your treats are in the oven.
            </h1>

            <p className="mb-8 text-lg text-[#6b5d50]">
              Your order has been received and we are preparing something delicious just for you.
            </p>

            <div className="mb-8 rounded-2xl bg-[#fff8e8] p-6">
              <p className="mb-2 text-sm text-[#6b5d50]">Order Number</p>
              <p className="text-2xl font-bold text-[#b56b32]">{orderNumber}</p>
            </div>

            <div className="mb-8 rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-6 text-left">
              <h2 className="mb-4 text-lg font-semibold text-[#231913]">What&apos;s Next?</h2>
              <ul className="space-y-3 text-[#6b5d50]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#b56b32]">1.</span>
                  <span>You will receive a confirmation message with your order details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#b56b32]">2.</span>
                  <span>We will start preparing your fresh-baked goodies right away.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#b56b32]">3.</span>
                  <span>Your order will be arranged for pickup or delivery based on your details.</span>
                </li>
              </ul>
            </div>

            <div className="mb-8 rounded-2xl border border-[#eadfce] bg-[#fff8e8] p-4">
              <p className="text-sm text-[#6b5d50]">
                Keep your order number handy in case you need to contact us.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button onClick={() => router.push("/")} className="premium-button px-8 py-3">
                Continue Shopping
              </button>
              <button onClick={() => router.push("/account/orders")} className="premium-button-secondary px-8 py-3">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="premium-shell flex min-h-screen items-center justify-center pb-16 pt-28">
            <div className="text-[#6b5d50]">Loading...</div>
          </main>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </>
  );
}
