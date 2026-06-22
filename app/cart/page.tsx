"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const total = subtotal;

  const handleQuantityChange = (productId: string, newQuantity: number, size?: string) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
    } else {
      updateQuantity(productId, newQuantity, size);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="premium-shell min-h-screen pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 rounded-full bg-[#f6ead8] p-6">
                <ShoppingBag className="w-16 h-16 text-[#b56b32]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#231913] mb-4">
                Your gift basket is waiting.
              </h2>
              <p className="text-sm sm:text-base text-[#6b5d50] mb-8 max-w-md">
                Choose a fresh loaf, minis, or a polished flight box for the next sweet occasion.
              </p>
              <button
                onClick={() => router.push("/")}
                className="premium-button py-3 px-8"
              >
                Shop Now
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="premium-shell min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="premium-kicker mb-3">Your selection</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#231913] mb-8">
            Gift basket
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const itemPrice = parseFloat(item.price.replace("GHS ", ""));
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="premium-card rounded-2xl p-4 md:p-6 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[#f6ead8]">
                        <Image
                          src={item.image || ""}
                          alt={item.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-[#231913] mb-1">
                              {item.name}
                            </h3>
                            {item.selectedSize && (
                              <p className="text-sm text-gray-600">
                                Box/size: {item.selectedSize}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 mr-2">Qty:</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1, item.selectedSize)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-[#eadfce] rounded-full hover:bg-[#fff8e8] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1, item.selectedSize)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-[#eadfce] rounded-full hover:bg-[#fff8e8] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              GHS {itemPrice.toFixed(2)} each
                            </p>
                            <p className="text-lg font-bold text-[#b56b32]">
                              GHS {itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary - Right Side (Sticky on desktop) */}
            <div className="lg:col-span-1">
              <div className="premium-card rounded-2xl p-6 sticky top-28">
                <h2 className="text-xl font-bold text-[#231913] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>GHS {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#eadfce] pt-3 flex justify-between text-lg font-bold text-[#231913]">
                    <span>Total</span>
                    <span className="text-[#b56b32]">GHS {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-5 rounded-xl bg-[#fff8e8] p-4 text-sm text-[#6b5d50]">
                  Delivery fees are confirmed separately based on location. Gift notes can be added in checkout.
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="premium-button w-full py-3 px-6 mb-3 hover:cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="premium-button-secondary w-full py-3 px-6 hover:cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
