"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

export default function AddressPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Delivery Address</h1>
        <p className="text-[#5d6043] mt-2">
          Delivery details are collected when you place an order
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#b9aca2] rounded-lg px-6 text-center">
          <div className="bg-[#b9aca2]/40 rounded-full p-6 mb-4">
            <MapPin className="w-16 h-16 text-[#5d6043]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#222222] mb-2">
            No saved addresses yet
          </h2>
          <p className="text-[#5d6043] mb-6 max-w-md">
            Cozy Oven currently collects your delivery address at checkout for
            each order. Saved address profiles are not available in your account
            yet.
          </p>
          <Link
            href="/checkout"
            className="px-6 py-3 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-full hover:bg-[#222222] transition-colors"
          >
            Go to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
