"use client";

import { useState } from "react";
import { MapPin, Save } from "lucide-react";

interface AddressData {
  shippingAddress: string;
  city: string;
  digitalAddress: string;
}

export default function AddressPage() {
  const [address, setAddress] = useState<AddressData>({
    shippingAddress: "",
    city: "",
    digitalAddress: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Call API to save address
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const hasAddress =
    address.shippingAddress || address.city || address.digitalAddress;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Delivery Address</h1>
        <p className="text-[#5d6043] mt-2">
          Manage your shipping and delivery information
        </p>
      </div>

      <div className="max-w-2xl">
        {!hasAddress && !isEditing ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#b9aca2] rounded-lg">
            <div className="bg-[#b9aca2] rounded-full p-6 mb-4">
              <MapPin className="w-16 h-16 text-[#b9aca2]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#222222] mb-2">
              No address saved
            </h2>
            <p className="text-[#5d6043] mb-6 text-center max-w-md">
              Add your delivery address to make checkout faster
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-full hover:bg-[#222222] transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          // Address form
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#5d6043] mb-2">
                Shipping Address *
              </label>
              <textarea
                name="shippingAddress"
                value={address.shippingAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-2 border border-[#b9aca2] rounded-lg focus:ring-2 focus:ring-[#5d6043] focus:border-transparent ${
                  !isEditing ? "bg-[#faf9f5] text-[#5d6043]" : ""
                }`}
                placeholder="Enter your full shipping address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5d6043] mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-[#b9aca2] rounded-lg focus:ring-2 focus:ring-[#5d6043] focus:border-transparent ${
                  !isEditing ? "bg-[#faf9f5] text-[#5d6043]" : ""
                }`}
                placeholder="e.g., Accra"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5d6043] mb-2">
                Digital Address
              </label>
              <input
                type="text"
                name="digitalAddress"
                value={address.digitalAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-[#b9aca2] rounded-lg focus:ring-2 focus:ring-[#5d6043] focus:border-transparent ${
                  !isEditing ? "bg-[#faf9f5] text-[#5d6043]" : ""
                }`}
                placeholder="e.g., GA-123-4567"
              />
              <p className="text-xs text-[#5d6043] mt-1">
                Optional: Ghana Post GPS digital address
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-lg hover:bg-[#222222] transition-colors disabled:bg-[#b9aca2]"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Address"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-6 py-3 border border-[#b9aca2] text-[#5d6043] font-semibold rounded-lg hover:bg-[#faf9f5] transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-lg hover:bg-[#222222] transition-colors"
                >
                  Edit Address
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
