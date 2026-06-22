"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { orderService } from "../services/orderService";

function PaymentVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("Payment reference not found");
        return;
      }

      try {
        const response = await orderService.verifyPayment(reference);

        if (response.success) {
          setStatus("success");
          setMessage(response.message || "Payment verified successfully.");
          setOrderNumber(response.data.orderId);

          setTimeout(() => {
            router.push(`/order-success?orderNumber=${response.data.orderId}`);
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage("Failed to verify payment. Please contact support.");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <>
      <Navbar />
      <main className="premium-shell flex min-h-screen items-center justify-center px-4 pb-16 pt-28">
        <div className="w-full max-w-md">
          <div className="premium-card rounded-2xl p-8 text-center">
            {status === "verifying" && (
              <>
                <div className="mb-6 flex justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-[#b56b32]" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-[#231913]">Verifying Payment</h1>
                <p className="text-[#6b5d50]">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-6 flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-[#231913]">Payment Successful</h1>
                <p className="mb-4 text-[#6b5d50]">{message}</p>
                {orderNumber && (
                  <div className="rounded-2xl bg-[#fff8e8] p-4">
                    <p className="mb-1 text-sm text-[#6b5d50]">Order Number</p>
                    <p className="text-lg font-bold text-[#b56b32]">{orderNumber}</p>
                  </div>
                )}
                <p className="mt-4 text-sm text-[#8a7b6b]">Redirecting to order confirmation...</p>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="mb-6 flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-[#231913]">Payment Failed</h1>
                <p className="mb-6 text-[#6b5d50]">{message}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => router.push("/cart")} className="premium-button w-full px-6 py-3">
                    Return to Cart
                  </button>
                  <button onClick={() => router.push("/")} className="premium-button-secondary w-full px-6 py-3">
                    Go to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="premium-shell flex min-h-screen items-center justify-center pb-16 pt-28">
          <div className="text-[#6b5d50]">Loading...</div>
        </main>
      }
    >
      <PaymentVerificationContent />
    </Suspense>
  );
}
