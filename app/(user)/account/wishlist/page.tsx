"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const hasItems = wishlist.length > 0;

  const handleAddToCart = (item: typeof wishlist[0]) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        rating: item.rating,
        reviews: item.reviews,
        description: item.description,
        sizes: item.sizes,
        details: item.details,
      },
      item.quantity || 1,
      item.selectedSize
    );
    // Remove from wishlist after adding to cart
    removeFromWishlist(item.id, item.selectedSize);
  };

  const handleRemove = (item: typeof wishlist[0]) => {
    removeFromWishlist(item.id, item.selectedSize);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">My Wishlist</h1>
        <p className="text-[#5d6043] mt-2">Save your favorite items for later</p>
      </div>

      {!hasItems ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-[#b9aca2] rounded-full p-6 mb-4">
            <Heart className="w-16 h-16 text-[#b9aca2]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#222222] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-[#5d6043] mb-6 text-center max-w-md">
            Start adding items to your wishlist and they&apos;ll appear here!
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-full hover:bg-[#222222] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // Wishlist grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize || 'default'}`}
              className="border border-[#b9aca2]/60 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="bg-[#b9aca2] rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Heart className="w-12 h-12 text-[#b9aca2]" />
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-semibold text-[#222222] mb-2">
                {item.name}
              </h3>
              <p className="text-xl font-bold text-[#5d6043] mb-2">
                {item.price}
              </p>

              {/* Selected Size */}
              {item.selectedSize && (
                <div className="mb-4">
                  <p className="text-sm text-[#5d6043]">
                    Size: <span className="font-semibold">{item.selectedSize}</span>
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <p className="text-sm text-[#5d6043]">
                  Quantity: <span className="font-semibold">{item.quantity}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#5d6043] text-[#faf9f5] font-semibold rounded-lg hover:bg-[#222222] transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="p-2 border border-[#b9aca2] rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
