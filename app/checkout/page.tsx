"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import IncompleteOrderModal from "../components/IncompleteOrderModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService, type OrderItem } from "../services/orderService";
import { saveGuestOrderProfile } from "../utils/guestOrderProfile";
import { calculatePaystackPaymentBreakdown } from "../utils/paymentBreakdown";
import { isAllowedPaymentRedirectUrl } from "../utils/paymentRedirect";

type DeliveryMethod = "delivery" | "pickup";
type CheckoutStep = "info" | "delivery" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("info");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [incompleteOrderModalOpen, setIncompleteOrderModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    city: "",
    date: "",
    time: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const subtotal = getCartTotal();
  const total = subtotal; // Delivery fee not included in checkout
  const paymentBreakdown = calculatePaystackPaymentBreakdown(total);

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  // Track when user starts checkout
  useEffect(() => {
    if (cart.length > 0) {
      setHasStartedCheckout(true);
    }
  }, [cart.length]);

  // Show incomplete order modal when user tries to leave
  useEffect(() => {
    if (!hasStartedCheckout) return;

    // Handle browser back/forward buttons
    const handlePopState = (e: PopStateEvent) => {
      if (!isProcessing) {
        e.preventDefault();
        // Push state back to prevent navigation
        window.history.pushState({ page: "checkout" }, "", window.location.href);
        setIncompleteOrderModalOpen(true);
      }
    };

    // Push initial state
    window.history.pushState({ page: "checkout" }, "", window.location.href);
    
    window.addEventListener("popstate", handlePopState);

    // Soft leave confirmation: only intercept same-origin nav links, use confirm dialog
    const handleLinkClick = (e: MouseEvent) => {
      if (isProcessing) return;
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (!link?.href || link.href.includes("#") || link.target === "_blank") return;
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname.startsWith("/checkout")) return;
      } catch {
        return;
      }
      const leave = window.confirm(
        "You have an incomplete order. Leave checkout anyway?"
      );
      if (!leave) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [hasStartedCheckout, isProcessing]);

  if (cart.length === 0) return null;

  const steps = [
    { id: "info", label: "Customer Info" },
    { id: "delivery", label: "Delivery/Pickup" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === "info") {
      if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
        setError("Please fill in all required fields");
        return;
      }
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(customerInfo.email)) {
        setError("Please enter a valid email address");
        return;
      }
      setError(null);
    } else if (currentStep === "delivery") {
      if (deliveryMethod === "delivery" && (!deliveryDetails.address.trim() || !deliveryDetails.city.trim())) {
        setError("Please fill in delivery address and city");
        return;
      }
      // Only require date/time for pickup, not for delivery
      if (deliveryMethod === "pickup" && (!deliveryDetails.date || !deliveryDetails.time)) {
        setError("Please select pickup date and time");
        return;
      }
      setError(null);
    }

    const stepOrder: CheckoutStep[] = ["info", "delivery", "payment", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: CheckoutStep[] = ["info", "delivery", "payment", "review"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      // Show incomplete order modal if user has started checkout (from any step)
      if (hasStartedCheckout) {
        setIncompleteOrderModalOpen(true);
      } else {
        router.push("/cart");
      }
    }
  };



  const handlePlaceOrder = async () => {
    // Authentication requirement disabled to allow guest checkout during testing
    // if (!isAuthenticated) {
    //   setAuthModalOpen(true);
    //   return;
    // }

    // Validate customer information
    if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
      setError("Please fill in all customer information fields");
      return;
    }

    // Validate email format - comprehensive regex following RFC 5322 standards
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate delivery details if delivery method is selected
    if (deliveryMethod === "delivery") {
      if (!deliveryDetails.address.trim() || !deliveryDetails.city.trim()) {
        setError("Please fill in delivery address and city");
        return;
      }
    }

    // Only validate date and time for pickup, not for delivery
    if (deliveryMethod === "pickup" && (!deliveryDetails.date || !deliveryDetails.time)) {
      setError("Please select pickup date and time");
      return;
    }

    // Validate cart is not empty
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Validate minimum order amount (40 cedis)
    if (total < 40) {
      setError("Minimum order amount is GHS 40.00. Please add more items to your cart.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const items: OrderItem[] = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price.replace("GHS ", "")),
        // Include size information - backend will store this in order details
        ...(item.selectedSize ? { size: item.selectedSize } : {}),
        ...(item.packageSelections && item.packageSelections.length > 0
          ? { packageSelections: item.packageSelections }
          : {}),
      }));

      // Use admin checkout endpoint if user is admin, otherwise use customer endpoint
      const checkoutFunction = user?.role === "Admin" 
        ? orderService.adminCheckout 
        : orderService.checkout;
      
      const checkoutResponse = await checkoutFunction({
        items,
        deliveryFee: 0, // Delivery fee will be paid on delivery
        deliveryAddress:
          deliveryMethod === "delivery"
            ? deliveryDetails.address.trim()
            : "Pickup from store",
        city: deliveryMethod === "delivery" ? deliveryDetails.city.trim() : undefined,
        specialInstruction: deliveryMethod === "delivery" ? deliveryDetails.notes.trim() || undefined : undefined,
        contactNumber: customerInfo.phone.trim(),
        fullName: customerInfo.name.trim(),
        email: customerInfo.email.trim(),
        paymentMethod,
        ...(deliveryMethod === "pickup" && {
          orderDetails: {
            pickUpDetails: {
              pickupDate: `${deliveryDetails.date} at ${deliveryDetails.time}`,
              specialInstructions: deliveryDetails.notes.trim() || undefined,
            },
          },
        }),
      });

      if (!checkoutResponse.success || !checkoutResponse.order) {
        throw new Error(checkoutResponse.message || "Failed to create order");
      }

      // Use the orderId field (e.g., "CZ-850560") instead of _id for payment initiation
      const orderId = checkoutResponse.order.orderId || checkoutResponse.order._id;

      if (!orderId) {
        throw new Error("Order ID not found in response");
      }

      if (!isAuthenticated) {
        saveGuestOrderProfile({
          fullName: customerInfo.name.trim(),
          email: customerInfo.email.trim(),
          phoneNumber: customerInfo.phone.trim(),
          orderId,
        });
      }

      // Initiate payment
      const paymentResponse = await orderService.initiatePayment(orderId);

      // Extract checkout URL from response.
      const extractPaymentUrl = (response: typeof paymentResponse): string | null => {
        return (
          response.checkoutUrl || 
          response.data?.checkoutUrl ||
          response.authorizationUrl || 
          response.data?.authorizationUrl ||
          null
        );
      };

      const checkoutUrl = extractPaymentUrl(paymentResponse);
      
      if (paymentResponse.success && checkoutUrl) {
        if (!isAllowedPaymentRedirectUrl(checkoutUrl)) {
          throw new Error("Invalid payment redirect URL. Please contact support.");
        }
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to initiate payment. Please try again or contact support.");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to place order. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="editorial-shell min-h-screen pb-16 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-editorial mb-8 text-3xl tracking-[-0.03em] text-[#222222] sm:text-4xl">Checkout</h1>

          <div className="mb-6 rounded-[24px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/86 p-4 shadow-[0_12px_40px_rgba(34,34,34,0.08)]">
            <p className="text-sm leading-6 text-[#5d6043]">
              Delivery from GHS 30, paid on delivery. The final fee may vary by location.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      index <= currentStepIndex
                        ? "bg-[#222222] text-[#faf9f5]"
                        : "bg-[#b9aca2] text-[#5d6043]"
                    }`}
                  >
                    {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center block sm:hidden">{step.label.split(' ')[0]}</span>
                  <span className="text-xs mt-2 text-center hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStepIndex ? "bg-[#bd6325]" : "bg-[#b9aca2]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="mb-8 rounded-[34px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/86 p-6 shadow-[0_26px_80px_rgba(34,34,34,0.12)] md:p-8">
            {/* Error Message at top of form */}
            {error && (
              <div
                className="mb-6 rounded-[22px] border border-red-200 bg-red-50 p-4"
                role="alert"
                aria-live="polite"
              >
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Customer Information */}
            {currentStep === "info" && (
              <div>
                <h2 className="font-editorial mb-6 text-2xl tracking-[-0.03em] text-[#222222] sm:text-3xl">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-black text-[#5d6043]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className="editorial-input px-4 py-3"
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-black text-[#5d6043]">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      className="editorial-input px-4 py-3"
                      placeholder="john@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-black text-[#5d6043]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      className="editorial-input px-4 py-3"
                      placeholder="+233 123 456 789"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delivery/Pickup Details */}
            {currentStep === "delivery" && (
              <div>
                <h2 className="font-editorial mb-6 text-2xl tracking-[-0.03em] text-[#222222] sm:text-3xl">
                  Delivery Details
                </h2>
            

                {/* Delivery/Pickup Toggle */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-black text-[#5d6043]">
                    Delivery Method *
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex-1 py-3 px-4 rounded-full border-2 font-semibold transition-colors ${
                        deliveryMethod === "delivery"
                          ? "border-[#bd6325] bg-[#b9aca2] text-[#222222]"
                          : "border-[rgba(34,34,34,0.12)] bg-[#faf9f5] text-[#5d6043] hover:border-[#bd6325]"
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex-1 py-3 px-4 rounded-full border-2 font-semibold transition-colors ${
                        deliveryMethod === "pickup"
                          ? "border-[#bd6325] bg-[#b9aca2] text-[#222222]"
                          : "border-[rgba(34,34,34,0.12)] bg-[#faf9f5] text-[#5d6043] hover:border-[#bd6325]"
                      }`}
                    >
                      Pickup
                    </button>
                  </div>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="space-y-4">
                    {/* <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
              The minimum delivery charge is GHS 30, and the final fee may vary depending on your location and other delivery factors.
              </p>
                     </div> */}
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#5d6043]">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.address}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            address: e.target.value,
                          })
                        }
                        className="editorial-input px-4 py-3"
                        placeholder="123 Main Street"
                        autoComplete="street-address"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#5d6043]">
                        City *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.city}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            city: e.target.value,
                          })
                        }
                        className="editorial-input px-4 py-3"
                        placeholder="Accra"
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>
                )}

                {/* Only show date/time for pickup, not for delivery */}
                {deliveryMethod === "pickup" && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#5d6043]">
                        Pickup Date *
                      </label>
                      <input
                        type="date"
                        value={deliveryDetails.date}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            date: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split('T')[0]}
                        className="editorial-input px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-[#5d6043]">
                        Preferred Time *
                      </label>
                      <input
                        type="time"
                        value={deliveryDetails.time}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            time: e.target.value,
                          })
                        }
                        className="editorial-input px-4 py-3"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-black text-[#5d6043]">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryDetails.notes}
                    onChange={(e) =>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="editorial-input px-4 py-3"
                    placeholder="Please ring bell once, no nuts..."
                  />
                </div>
              </div>
            )}

            {/* Payment Details */}
            {currentStep === "payment" && (
              <div>
                <h2 className="font-editorial mb-6 text-2xl tracking-[-0.03em] text-[#222222] sm:text-3xl">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-3 block text-sm font-black text-[#5d6043]">
                      Select Payment Method *
                    </label>
                    <div className="space-y-3">
                      <button
                        onClick={() => setPaymentMethod("paystack")}
                        className="w-full rounded-[22px] border-2 border-[#bd6325] bg-[#b9aca2] px-4 py-3 text-left font-black text-[#222222] transition-colors"
                      >
                        Paystack Payment (Mobile Money, Cards, & More)
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 rounded-[22px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5] p-4">
                    <p className="text-sm leading-6 text-[#5d6043]">
                      <span className="font-semibold text-[#222222]">Secure payment via Paystack.</span>{" "}
                      Mobile Money, cards, and more — you&apos;ll complete payment on Paystack&apos;s checkout page.
                    </p>
                    <p className="text-sm leading-6 text-[#5d6043]">
                      Need a hand after paying? We&apos;ll confirm on WhatsApp if anything needs clarifying.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Review & Confirm */}
            {currentStep === "review" && (
              <div>
                <h2 className="font-editorial mb-6 text-2xl tracking-[-0.03em] text-[#222222] sm:text-3xl">
                  Review Your Order
                </h2>

                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="mb-3 text-lg font-black text-[#222222]">
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {cart.map((item) => {
                        const itemPrice = parseFloat(item.price.replace("GHS ", ""));
                        const itemTotal = itemPrice * item.quantity;
                        return (
                          <div
                            key={`${item.id}-${item.selectedSize}-${JSON.stringify(item.packageSelections || [])}`}
                            className="flex justify-between gap-4 text-[#5d6043]"
                          >
                            <div>
                              <span>
                                {item.name} {item.selectedSize && `(${item.selectedSize})`} x{" "}
                                {item.quantity}
                              </span>
                              {item.packageSelections && item.packageSelections.length > 0 && (
                                <div className="mt-1 text-xs text-[#5d6043]">
                                  {item.packageSelections.map((selection) => (
                                    <p key={`${selection.groupId || selection.groupLabel || "package"}-${selection.label}`}>
                                      {selection.groupLabel ? `${selection.groupLabel}: ` : ""}
                                      {selection.label} x {selection.quantity}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span>GHS {itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="mb-3 text-lg font-black text-[#222222]">
                      Customer Information
                    </h3>
                    <div className="space-y-1 text-[#5d6043]">
                      <p>{customerInfo.name}</p>
                      <p>{customerInfo.email}</p>
                      <p>{customerInfo.phone}</p>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div>
                    <h3 className="mb-3 text-lg font-black text-[#222222]">
                      {deliveryMethod === "delivery" ? "Delivery" : "Pickup"} Details
                    </h3>
                    <div className="space-y-1 text-[#5d6043]">
                      {deliveryMethod === "delivery" && (
                        <>
                          <p>{deliveryDetails.address}</p>
                          <p>{deliveryDetails.city}</p>
                          
                        </>
                      )}
                      {deliveryMethod === "pickup" && (
                        <p>
                          Date: {deliveryDetails.date} at {deliveryDetails.time}
                        </p>
                      )}
                      {deliveryDetails.notes && <p>Notes: {deliveryDetails.notes}</p>}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="mb-3 text-lg font-black text-[#222222]">
                      Payment Method
                    </h3>
                    <p className="capitalize text-[#5d6043]">
                      {paymentMethod.replace("-", " ")}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[rgba(34,34,34,0.12)] pt-4">
                    <h3 className="mb-3 text-lg font-black text-[#222222]">
                      Order Total
                    </h3>
                    <div className="space-y-2 text-[#5d6043]">
                      <div className="flex justify-between">
                        <span>Product total</span>
                        <span>GHS {total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction fee (2%)</span>
                        <span>GHS {paymentBreakdown.transactionFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-[rgba(34,34,34,0.12)] pt-2 text-xl font-black text-[#222222]">
                        <span>Total to pay</span>
                        <span className="text-[#bd6325]">
                          GHS {paymentBreakdown.chargedAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] bg-[#faf9f5] p-4 text-xs text-[#5d6043]">
                    By placing this order, you agree to our{" "}
                    <a href="#" className="text-[#bd6325] hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#bd6325] hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-[22px] border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="editorial-button-outline flex-1 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            {currentStep === "review" ? (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="editorial-button flex-1 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Place Order & Pay"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="editorial-button flex-1 px-6 py-3"
              >
                Continue
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-[22px] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <IncompleteOrderModal 
        isOpen={incompleteOrderModalOpen} 
        onClose={() => {
          setIncompleteOrderModalOpen(false);
        }}
        onConfirmLeave={() => {
          setIncompleteOrderModalOpen(false);
          router.push("/cart");
        }}
      />
    </>
  );
}
