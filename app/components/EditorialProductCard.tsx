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
    <article className="group overflow-hidden rounded-[36px] border border-[rgba(48,23,15,0.09)] bg-[#FFFDF7]/80 shadow-[0_12px_40px_rgba(48,23,15,0.10)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_80px_rgba(48,23,15,0.16)]">
      <Link href={`/product/${product.id}`} className="block">
        <div className={`relative bg-gradient-to-br from-[#F7D38E] to-[#C87832] ${compact ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.45),transparent_9rem)]" />
          <Image
            src={product.thumbnail || "/gift.png"}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {unavailable && (
            <span className="absolute left-4 top-4 rounded-full bg-[#30170F] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#FFF8EC]">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className={compact ? "p-4" : "p-5"}>
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#C97D35]">
          {product.productCategory}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-editorial text-xl leading-tight text-[#30170F] transition-colors group-hover:text-[#C97D35]">
            {product.productName}
          </h3>
        </Link>
        {product.productDetails && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#80634F]">
            {product.productDetails}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-black text-[#5B3322]">GHS {price.toFixed(2)}</p>
          {isPackage ? (
            <Link href={`/product/${product.id}`} className="editorial-button-outline px-4 py-2 text-sm">
              Build box
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={unavailable}
              className="editorial-button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-[#CAB9A5]"
            >
              {unavailable ? "Unavailable" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
