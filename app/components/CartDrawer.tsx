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
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col animate-slide-in rounded-l-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold">
            Your Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize || "default"}-${JSON.stringify(item.packageSelections || [])}`}
                  className="flex gap-4 border-b border-gray-300 pb-4"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      )}
                      {item.packageSelections && item.packageSelections.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {item.packageSelections.map((selection) => (
                            <p key={selection.label}>
                              {selection.label} x {selection.quantity}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-[#bd6325] font-semibold mt-1">{item.price}</p>
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
                        className="text-white bg-red-700 text-xs px-4 py-2 rounded-full transition hover:cursor-pointer"
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

        {/* Footer - Fixed */}
        <div className="border-t border-gray-300 p-6 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#bd6325]">GHS {cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <Link href="/cart">
            <button
              onClick={onClose}
              className="w-full bg-[#bd6325] hover:bg-[#a8551f] text-white font-semibold py-3 rounded-full transition-colors hover:cursor-pointer mb-3"
            >
              View Cart
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors hover:cursor-pointer"
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
