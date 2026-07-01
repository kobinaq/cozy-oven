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
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-[#222222]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full animate-slide-in flex-col bg-[#faf9f5] shadow-[-20px_0_70px_rgba(0,0,0,0.24)] md:w-[460px] md:rounded-l-[34px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(34,34,34,0.12)] p-6">
          <h2 className="font-editorial text-3xl tracking-[-0.05em] text-[#222222]">
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

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-[#5d6043]">
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize || "default"}-${JSON.stringify(item.packageSelections || [])}`}
                  className="rounded-[24px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5] p-3 shadow-[0_12px_40px_rgba(34,34,34,0.08)]"
                >
                  <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#b9aca2]">
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#222222]">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-xs text-[#5d6043]">Size: {item.selectedSize}</p>
                      )}
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
                      <p className="mt-1 font-black text-[#bd6325]">{item.price}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="scale-75 origin-left">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) =>
                            updateQuantity(item.id, newQuantity, item.selectedSize, item.packageSelections)
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.packageSelections)}
                        className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition hover:cursor-pointer hover:bg-red-100"
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

        {/* Footer - Fixed */}
        <div className="border-t border-[rgba(34,34,34,0.12)] bg-[#b9aca2]/50 p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#bd6325]">GHS {cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <Link href="/cart">
            <button
              onClick={onClose}
              className="editorial-button mb-3 w-full py-3 hover:cursor-pointer"
            >
              View Cart
            </button>
          </Link>
          <button
            onClick={onClose}
            className="editorial-button-outline w-full py-3 hover:cursor-pointer"
          >
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
