"use client";

import { useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductQuickView from "./ProductQuickView";
import type { Product } from "../context/CartContext";
import useCustomerProducts from "../hooks/useCustomerProducts";
import 'react-loading-skeleton/dist/skeleton.css'


export default function Categories() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const router = useRouter();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Fetch products from backend
  const { products: allProducts, loading } = useCustomerProducts({ limit: 100 });

  // Get unique categories dynamically from products
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    allProducts.forEach(product => {
      if (product.productCategory) {
        categoriesSet.add(product.productCategory);
      }
    });
    return Array.from(categoriesSet).sort();
  }, [allProducts]);

  const [activeCategory, setActiveCategory] = useState<string>("");

  // Use first available category if active category is empty
  const effectiveActiveCategory = activeCategory || (availableCategories.length > 0 ? availableCategories[0] : "");

  // Filter products by category
  const getProductsByCategory = (category: string) => {
    return allProducts.filter(product => product.productCategory === category);
  };

  const currentProducts = effectiveActiveCategory ? getProductsByCategory(effectiveActiveCategory) : [];

  const handleQuickView = (product: typeof allProducts[0]) => {
    // A product is sold out if it has variants and all are unavailable
    const hasVariants = (product.selectOptions?.length ?? 0) > 0;
    const availableVariants = product.selectOptions?.filter(opt => opt.isAvailable !== false) ?? [];
    const soldOut = hasVariants && availableVariants.length === 0;

    const productData: Product = {
      id: product.id,
      name: product.productName,
      price: `GHS ${product.price}`,
      image: product.thumbnail,
      description: product.productDetails,
      sizes: availableVariants.map(opt => opt.label),
      isAvailable: !soldOut,
      category: product.productCategory,
    };
    setQuickViewProduct(productData);
    setIsQuickViewOpen(true);
  };

  const handleCardClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const CyclingImage = ({ images, defaultImage }: { images?: string[], defaultImage: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const allImages = useMemo(() => {
      if (!images || images.length === 0) return [defaultImage];
      // Filter out duplicate of defaultImage if it's already in the list
      const filtered = images.filter(img => img !== defaultImage);
      return [defaultImage, ...filtered];
    }, [images, defaultImage]);

    useEffect(() => {
      if (allImages.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 4000); // Change every 4 seconds
      
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
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${allImages[currentIndex]})` }}
        />
      </AnimatePresence>
    );
  };

  return (
    <>
      <div
        ref={sectionRef}
        id="flavour-collections"
        className="premium-shell flex flex-col items-center justify-center font-[Euclid-Circular-B] py-20"
        style={{ display: availableCategories.length === 0 ? "none" : "block" }}
      >
        <motion.div 
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Only show category tabs if there are categories with products */}
          <div className="mb-8 max-w-3xl">
            <p className="premium-kicker mb-3">Flavor collections</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#231913] sm:text-5xl">
              Choose the box that matches the moment.
            </h2>
            <p className="mt-4 text-[#6b5d50]">
              From classic loaves to minis and flight boxes, every product is arranged for gifting,
              sharing, and easy checkout.
            </p>
          </div>

          {availableCategories.length > 0 && (
            <div className="flex md:gap-6 gap-3 mb-8 overflow-x-auto pb-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-5 py-3 text-sm font-bold transition-colors relative whitespace-nowrap ${
                    effectiveActiveCategory === category
                      ? "border-[#c79a4b] bg-[#231913] text-white"
                      : "border-[#eadfce] bg-white/70 text-[#6b5d50] hover:text-[#231913]"
                  }`}
                >
                  {category}
                </button> 
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#b56b32] border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Cards Horizontal Scroll */}
          {!loading && (
            <div className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <motion.div
                key={activeCategory}
                className="flex gap-5 min-w-max"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    className="premium-card relative h-[430px] w-[300px] shrink-0 overflow-hidden rounded-2xl text-[#231913] transition-transform duration-300 hover:-translate-y-1 group snap-start"
                    onClick={() => handleCardClick(product.id)}
                  >
                  <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-110 z-0">
                    <div className="absolute inset-x-3 top-3 h-64 overflow-hidden rounded-xl">
                      <CyclingImage images={product.images} defaultImage={product.thumbnail} />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-[#fffdf8] via-[#fffdf8] to-transparent" />
                  
                  {/* Sold Out Badge - shown when product has variants and all are unavailable */}
                  {(product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter(opt => opt.isAvailable !== false)?.length ?? 0) === 0 && (
                    <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Sold Out
                    </div>
                  )}

                  <div className="relative z-20 p-5 h-full flex flex-col justify-end">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b56b32]">
                        {product.productCategory}
                      </p>
                      <h2 className="text-xl font-bold mb-2 text-[#231913]">
                        {product.productName}
                      </h2>
                      <p className="text-[#6b5d50] text-sm line-clamp-2">
                        {product.productDetails}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex-1">
                        <button 
                          className="premium-button py-3 px-7 w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(product.id);
                          }}
                        >
                          Shop
                        </button>
                      </div>
                      <div>
                        <button 
                          className="p-3 rounded-full border border-[#eadfce] bg-white text-[#231913] hover:bg-[#fff8e8] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                          aria-label="Quick view"
                        >
                          <Search className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {!loading && currentProducts.length === 0 && availableCategories.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found in this category.</p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Product Quick View Drawer */}
      <ProductQuickView 
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={quickViewProduct}
      />
    </>
  );
}
