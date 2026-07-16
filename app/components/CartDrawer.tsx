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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#222222]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full animate-slide-in flex-col bg-[#faf9f5] shadow-[-20px_0_70px_rgba(0,0,0,0.24)] md:w-[460px] md:rounded-l-[34px]">
        <div className="flex items-center justify-between border-b border-[rgba(34,34,34,0.12)] p-6">
          <h2 className="font-editorial text-2xl tracking-[-0.03em] text-[#222222]">
            Your Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-[#faf9f5] p-2 text-[#222222] shadow-[inset_0_0_0_1px_rgba(34,34,34,0.1)] transition hover:bg-[#b9aca2]"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-[#5d6043]">
              <p className="font-editorial text-2xl text-[#222222]">Your basket&apos;s feeling lonely.</p>
              <p className="max-w-xs text-sm leading-6">
                Add a fresh loaf or gift box and we&apos;ll keep it warm for checkout.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="editorial-button mt-2 px-6 py-3"
              >
                Browse shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize || "default"}-${JSON.stringify(item.packageSelections || [])}`}
                  className="rounded-[24px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5] p-3 shadow-[0_12px_40px_rgba(34,34,34,0.08)]"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#b9aca2]">
                      <Image
                        src={item.image || ""}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-[#222222]">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-xs text-[#5d6043]">Size: {item.selectedSize}</p>
                      )}
                      {item.packageSelections && item.packageSelections.length > 0 && (
                        <div className="mt-1 text-xs text-[#5d6043]">
                          {item.packageSelections
                            .filter((selection) => selection.quantity > 0)
                            .map((selection) => `${selection.quantity}× ${selection.label}`)
                            .join(", ")}
                        </div>
                      )}
                      <p className="mt-1 font-semibold text-[#bd6325]">{item.price}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="origin-left scale-75">
                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(newQuantity) =>
                              updateQuantity(
                                item.id,
                                newQuantity,
                                item.selectedSize,
                                item.packageSelections
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id, item.selectedSize, item.packageSelections)
                          }
                          className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[rgba(34,34,34,0.12)] bg-[#b9aca2]/50 p-6">
            <div className="mb-2 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-[#bd6325]">GHS {cartTotal.toFixed(2)}</span>
            </div>
            <p className="mb-4 text-xs leading-5 text-[#5d6043]">
              Delivery from GHS 30, paid on delivery.
            </p>

            <Link href="/checkout" onClick={onClose} className="editorial-button mb-3 w-full py-3">
              Checkout
            </Link>
            <Link href="/cart" onClick={onClose} className="editorial-button-outline mb-3 w-full py-3">
              View cart
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm font-medium text-[#5d6043] transition hover:text-[#bd6325]"
            >
              Continue shopping
            </button>
          </div>
        )}
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
