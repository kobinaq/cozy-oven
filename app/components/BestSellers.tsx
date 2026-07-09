"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCallback, useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import customerProductService from "../services/customerProductService";

export default function BestSellers() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBestSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerProductService.getBestSellers();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      setError("Best sellers are taking a moment to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  const CyclingImage = ({ images, defaultImage, alt }: { images?: string[], defaultImage: string, alt: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const allImages = useMemo(() => {
      // Logic: productImages || [productThumbnail]
      if (images && images.length > 0) return images;
      return [defaultImage || "/placeholder.svg"];
    }, [images, defaultImage]);

    useEffect(() => {
      if (allImages.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }, [allImages]);

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={allImages[currentIndex] || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#faf9f5]">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 flex flex-col justify-center">
            <p className="text-xs sm:text-sm font-medium text-[#5d6043] mb-2">
              What&apos;s Popular Now
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-4 md:mb-6 leading-tight">
              Best Sellers
            </h2>
            <p className="text-base sm:text-lg text-[#5d6043]">
              Shop our most loved products.
            </p>
          </div>

          <div className="lg:w-2/3 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd6325]"></div>
                <p className="mt-4 text-sm font-black text-[#222222]">Warming up best sellers...</p>
                <p className="mt-1 text-xs text-[#5d6043]">This can take up to a minute.</p>
              </div>
            ) : error && products.length === 0 ? (
              <div className="rounded-[22px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5] p-6 text-center">
                <p className="font-black text-[#222222]">Best sellers are still loading.</p>
                <p className="mt-2 text-sm text-[#5d6043]">{error}</p>
                <button
                  onClick={fetchBestSellers}
                  className="mt-4 rounded-full bg-[#bd6325] px-5 py-2 text-sm font-black text-[#faf9f5] transition-colors hover:bg-[#a9551f]"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="relative flex-shrink-0 w-72 h-80 rounded-3xl overflow-hidden cursor-pointer group snap-start block"
                    >
                      {/* Product Image */}
                      <div className="absolute inset-0 overflow-hidden transition-transform duration-500 group-hover:scale-110">
                        <CyclingImage images={product.images} defaultImage={product.thumbnail} alt={product.productName} />
                      </div>

                      {/* Sold Out Badge - shown when product has variants and all are unavailable */}
                      {(product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter((opt: any) => opt.isAvailable !== false)?.length ?? 0) === 0 && (
                        <div className="absolute top-4 right-4 z-20 bg-red-500 text-[#faf9f5] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Sold Out
                        </div>
                      )}

                      <div className={`absolute inset-0 bg-gradient-to-t ${((product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter((opt: any) => opt.isAvailable !== false)?.length ?? 0) === 0) ? "from-black/70" : "from-black/60"} via-transparent to-transparent flex flex-col justify-end p-6`}>
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="text-[#faf9f5] text-xl sm:text-2xl font-bold mb-2">
                              {product.productName}
                            </h3>
                            <p className="text-[#faf9f5]/80 text-xs sm:text-sm font-medium">
                              GHS {product?.price?.toFixed(2)}
                            </p>
                          </div>
                          {/* Arrow icon */}
                          <div className="bg-[#faf9f5]/20 backdrop-blur-sm rounded-full p-3 flex items-center justify-center group-hover:bg-[#faf9f5]/30 transition-colors">
                            <ArrowRight className="w-5 h-5 text-[#faf9f5] group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
