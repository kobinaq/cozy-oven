"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import type { Product as StoreProduct } from "../services/productService";

type EditorialProductCardProps = {
  product: StoreProduct;
  compact?: boolean;
};

const displayPrice = (product: StoreProduct) => {
  const option = product.selectOptions?.find((item) => item.isAvailable !== false);
  return option?.additionalPrice ?? product.price;
};

const soldOut = (product: StoreProduct) => {
  const hasVariants = (product.selectOptions?.length ?? 0) > 0;
  const available = product.selectOptions?.filter((item) => item.isAvailable !== false) ?? [];
  return product.isAvailable === false || (hasVariants && available.length === 0);
};

export default function EditorialProductCard({ product, compact = false }: EditorialProductCardProps) {
  const { addToCart } = useCart();
  const isPackage = product.productType === "package";
  const unavailable = soldOut(product);
  const price = displayPrice(product);
  const selectedSize = product.selectOptions?.find((item) => item.isAvailable !== false)?.label;

  const handleAddToCart = () => {
    if (isPackage || unavailable) return;

    addToCart(
      {
        id: product.id,
        name: product.productName,
        price: `GHS ${price.toFixed(2)}`,
        image: product.thumbnail,
        description: product.productDetails,
        category: product.productCategory,
        sizes: product.selectOptions?.filter((item) => item.isAvailable !== false).map((item) => item.label),
      },
      1,
      selectedSize
    );
  };

  return (
    <article className="prototype-card group overflow-hidden rounded-[36px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/80 shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
      <Link href={`/product/${product.id}`} className="block">
        <div className={`relative overflow-hidden bg-[#b9aca2] ${compact ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <div className="absolute bottom-5 left-1/2 h-14 w-4/5 -translate-x-1/2 rounded-full bg-[#222222]/20 blur-xl transition duration-500 group-hover:scale-110" />
          <Image
            src={product.thumbnail || "/gift.png"}
            alt={product.productName}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {unavailable && (
            <span className="absolute left-4 top-4 rounded-full bg-[#222222] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#faf9f5]">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className={compact ? "p-4" : "p-5"}>
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6325]">
          {product.productCategory}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-black leading-tight tracking-[-0.035em] text-[#222222] transition-colors group-hover:text-[#bd6325]">
            {product.productName}
          </h3>
        </Link>
        {product.productDetails && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5d6043]">
            {product.productDetails}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-black text-[#5d6043]">GHS {price.toFixed(2)}</p>
          {isPackage ? (
            <Link href={`/product/${product.id}`} className="editorial-button-outline px-4 py-2 text-sm">
              Build box
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={unavailable}
              className="editorial-button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-[#b9aca2]"
            >
              {unavailable ? "Unavailable" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
