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
    <article className="editorial-card group overflow-hidden">
      <Link href={`/product/${product.id}`} className="block">
        <div className={`relative bg-[#F3E9DD] ${compact ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <Image
            src={product.thumbnail || "/gift.png"}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {unavailable && (
            <span className="absolute left-4 top-4 rounded-full bg-[#1A1410] px-3 py-1 text-xs font-semibold text-white">
              Sold out
            </span>
          )}
        </div>
      </Link>
      <div className={compact ? "p-4" : "p-5"}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6E53]">
          {product.productCategory}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-editorial text-xl leading-tight text-[#1A1410] transition-colors group-hover:text-[#C8863A]">
            {product.productName}
          </h3>
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#C8863A]">GHS {price.toFixed(2)}</p>
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
