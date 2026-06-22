"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import customerProductService from "../services/customerProductService";

export default function BestSellers() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await customerProductService.getBestSellers();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

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
    <section ref={sectionRef} className="py-20 bg-[#fffdf8]">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 flex flex-col justify-center">
            <p className="premium-kicker mb-3">
              What&apos;s Popular Now
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#231913] mb-4 md:mb-6 leading-tight">
              Best Sellers
            </h2>
            <p className="text-base sm:text-lg text-[#6b5d50]">
              The boxes customers keep sending as gifts, office treats, and weekend favorites.
            </p>
          </div>

          <div className="lg:w-2/3 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd6325]"></div>
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
                      className="premium-card relative flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden cursor-pointer group snap-start block"
                    >
                      {/* Product Image */}
                      <div className="absolute inset-x-3 top-3 h-56 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-[1.03]">
                        <CyclingImage images={product.images} defaultImage={product.thumbnail} alt={product.productName} />
                      </div>

                      {/* Sold Out Badge - shown when product has variants and all are unavailable */}
                      {(product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter((opt: any) => opt.isAvailable !== false)?.length ?? 0) === 0 && (
                        <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Sold Out
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#fffdf8] via-[#fffdf8] to-transparent flex flex-col justify-end p-5">
                        <div className="flex items-end justify-between">
                          <div>
                            <h3 className="text-[#231913] text-xl font-bold mb-2">
                              {product.productName}
                            </h3>
                            <p className="text-[#b56b32] text-sm font-bold">
                              GHS {product?.price?.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-[#231913] rounded-full p-3 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
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
