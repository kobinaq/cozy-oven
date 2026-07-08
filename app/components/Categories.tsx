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
  const { products: allProducts, loading, error, hasFetched, refetch } = useCustomerProducts({ limit: 100 });

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
        className="flex flex-col items-center justify-center min-h-screen font-[Euclid-Circular-B] mt-12"
      >
        <motion.div 
          className="w-full max-w-8xl px-4 md:py-8 "
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Only show category tabs if there are categories with products */}
          {availableCategories.length > 0 && (
            <div className="flex md:gap-8 gap-4 mb-8 overflow-x-auto pb-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`md:text-3xl text-xl font-bold transition-colors relative whitespace-nowrap ${
                    effectiveActiveCategory === category
                      ? "text-[#bd6325]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {category}
                  {effectiveActiveCategory === category && (
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#bd6325] rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                )}

                </button> 
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && availableCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#bd6325] border-r-transparent"></div>
              <p className="mt-4 text-gray-700 font-medium">Warming up the bakery...</p>
              <p className="mt-1 text-sm text-gray-500">Products will appear automatically in a moment.</p>
            </div>
          )}

          {!loading && error && !hasFetched && availableCategories.length === 0 && (
            <div className="mx-auto max-w-md rounded-lg border border-orange-200 bg-orange-50 p-6 text-center">
              <p className="font-semibold text-gray-900">Products are taking a little longer to load.</p>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-full bg-[#bd6325] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a9551f]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Cards Horizontal Scroll */}
          {(!loading || availableCategories.length > 0) && availableCategories.length > 0 && (
            <div className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <motion.div
                key={activeCategory}
                className="flex gap-6 min-w-max"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    className="relative overflow-hidden rounded-4xl text-white h-[400px] sm:h-[450px] md:h-[500px] w-[300px] shrink-0 group snap-start"
                    onClick={() => handleCardClick(product.id)}
                  >
                  <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-110 z-0">
                    <CyclingImage images={product.images} defaultImage={product.thumbnail} />
                  </div>
                  <div className={`absolute inset-0 z-10 ${((product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter(opt => opt.isAvailable !== false)?.length ?? 0) === 0) ? "bg-black/60" : "bg-black/30"}`} />
                  
                  {/* Sold Out Badge - shown when product has variants and all are unavailable */}
                  {(product.selectOptions?.length ?? 0) > 0 && (product.selectOptions?.filter(opt => opt.isAvailable !== false)?.length ?? 0) === 0 && (
                    <div className="absolute top-4 right-4 z-30 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Sold Out
                    </div>
                  )}

                  <div className="relative z-20 p-8 h-full flex flex-col">
                    <div className="mb-auto">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                        {product.productName}
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base md:text-lg font-extralight line-clamp-3">
                        {product.productDetails}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Button that slides up */}
                      <div className="flex-1 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <button 
                          className="font-medium py-3 px-7 rounded-full bg-black shadow-sm w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(product.id);
                          }}
                        >
                          Shop
                        </button>
                      </div>
                      {/* Search icon that slides in from right */}
                      <div className="opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        <button 
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                          aria-label="Quick view"
                        >
                          <Search className="w-5 h-5 text-white" />
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
