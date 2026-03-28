"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QuantitySelector from "../../components/QuantitySelector";
import SizeSelector from "../../components/SizeSelector";
import ProductTabs from "../../components/ProductTabs";

import { useCart } from "../../context/CartContext";
import useCustomerProduct from "../../hooks/useProductDetails";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const { product, loading } = useCustomerProduct(id as string);

  // Check if this is a minis/mini/flightbox product
  const isMiniCategory = (category?: string) => {
    if (!category) return false;
    const lower = category.toLowerCase();
    return lower === "minis" || lower === "mini" || lower === "flightbox";
  };
  const isMinisProduct = isMiniCategory(product?.productCategory);
  const minQuantity = isMinisProduct ? 4 : 1;
  
  // Filter to only show available options
  const availableOptions = product?.selectOptions?.filter(opt => opt.isAvailable !== false) ?? [];
  const sizes = availableOptions.map(opt => opt.label) ?? ["Regular"];

  // A product is "sold out" if it has variants and ALL variants are unavailable
  const hasVariants = (product?.selectOptions?.length ?? 0) > 0;
  const isSoldOut = hasVariants && availableOptions.length === 0;
  
  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableOptions?.[0]?.label ?? null
  );

  const galleryImages = useMemo(() => {
    if (!product) return [] as string[];
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (url?: string | null) => {
      const u = typeof url === "string" ? url.trim() : "";
      if (!u) return;
      if (seen.has(u)) return;
      seen.add(u);
      out.push(u);
    };
    push(product.thumbnail);
    (product.images ?? []).forEach(push);
    return out;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  useEffect(() => {
    if (activeImageIndex >= galleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [galleryImages.length, activeImageIndex]);

  // Update selectedSize and quantity when product loads
  useEffect(() => {
    if (product && availableOptions.length > 0) {
      const firstAvailable = availableOptions[0]?.label;
      if (firstAvailable && (!selectedSize || !availableOptions.find(opt => opt.label === selectedSize))) {
        setSelectedSize(firstAvailable);
      }
    }
    // Set minimum quantity for minis
    if (product && isMiniCategory(product.productCategory)) {
      setQuantity(prev => Math.max(prev, 4));
    }
  }, [product, availableOptions]);

  // ✅ FINAL PRICE = size price (not base + size)
  const currentPrice = (() => {
    if (!product) return 0;

    const option = availableOptions.find(
      opt => opt.label === selectedSize
    );

    return option?.additionalPrice ?? product.price;
  })();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd6325]" />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <button
              onClick={() => router.push("/")}
              className="text-orange-500"
            >
              Return to home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }


  const mainImageSrc =
    galleryImages[activeImageIndex] ??
    product.thumbnail ??
    "/placeholder.svg";

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.productName,
        price: `GHS ${currentPrice.toFixed(2)}`,
        image: mainImageSrc,
        description: product.productDetails,
        rating: product.rating || 4.5,
        reviews: 0,
        sizes,
        details: product.productDetails
      },
      quantity,
      selectedSize ?? undefined
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-12">

            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={mainImageSrc}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((i) =>
                          i <= 0 ? galleryImages.length - 1 : i - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex((i) =>
                          i >= galleryImages.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-2 py-1 rounded-full bg-black/40">
                      {galleryImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIndex(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === activeImageIndex
                              ? "w-6 bg-white"
                              : "w-2 bg-white/50 hover:bg-white/70"
                          }`}
                          aria-label={`Image ${i + 1} of ${galleryImages.length}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {isSoldOut && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                    Sold Out
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin snap-x snap-mandatory">
                  {galleryImages.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 snap-start transition-all ${
                        i === activeImageIndex
                          ? "border-[#bd6325] ring-2 ring-[#bd6325]/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${product.productName} — image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">
                  {product.productName}
                </h1>
                {isSoldOut && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-3xl font-bold text-orange-500 mb-6">
                GHS {currentPrice.toFixed(2)}
              </p>

              <p className="text-gray-700 mb-6">
                {product.productDetails}
              </p>

              {!isSoldOut && (
                <>
                  <div className="mb-6">
                    <label className="block font-semibold mb-2">Size</label>
                    <SizeSelector
                      sizes={sizes}
                      selectedSize={selectedSize}
                      onSizeChange={setSelectedSize}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block font-semibold mb-2">Quantity</label>
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      min={minQuantity}
                    />
                    {isMinisProduct && (
                      <p className="text-sm text-orange-600 mt-2 font-medium">
                        Minimum order: 4 pieces
                      </p>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={`flex items-center justify-center gap-3 font-bold py-4 px-8 rounded-full w-full transition-all ${
                  isSoldOut
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#bd6325] text-white hover:bg-[#a8551f]"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {isSoldOut ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>

          <div className="mt-16">
            <ProductTabs details={product.productDetails} />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
