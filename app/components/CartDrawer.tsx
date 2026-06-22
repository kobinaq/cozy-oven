"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import QuantitySelector from "./QuantitySelector";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } = useCart();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#231913]/50 transition-opacity" onClick={onClose} />

      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-[#fffdf8] shadow-2xl md:w-[420px] md:rounded-l-2xl animate-slide-in">
        <div className="flex items-center justify-between border-b border-[#eadfce] p-6">
          <div>
            <p className="premium-kicker mb-1">Gift basket</p>
            <h2 className="text-2xl font-bold text-[#231913]">Your Cart ({cartCount})</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-[#f6ead8]"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-[#6b5d50]">
              <p className="text-lg font-semibold text-[#231913]">Your cart is empty</p>
              <p className="mt-2 text-sm">Add a loaf or gift box to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize || "default"}`}
                  className="flex gap-4 border-b border-[#eadfce] pb-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#f6ead8]">
                    <Image src={item.image || ""} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#231913]">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-xs text-[#8a7b6b]">Box/size: {item.selectedSize}</p>
                      )}
                      <p className="mt-1 font-semibold text-[#b56b32]">{item.price}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="origin-left scale-75">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) =>
                            updateQuantity(item.id, newQuantity, item.selectedSize)
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="rounded-full bg-[#fff1ec] px-4 py-2 text-xs text-[#8b2f23] transition hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#eadfce] bg-[#fbf7ef] p-6">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-lg font-bold text-[#231913]">
              <span>Total</span>
              <span className="text-[#b56b32]">GHS {cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-[#8a7b6b]">Delivery is confirmed during fulfillment.</p>
          </div>

          <Link href="/cart">
            <button onClick={onClose} className="premium-button mb-3 w-full py-3 hover:cursor-pointer">
              View Cart
            </button>
          </Link>
          <button onClick={onClose} className="premium-button-secondary w-full py-3 hover:cursor-pointer">
            Continue Shopping
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
