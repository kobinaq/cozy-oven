"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import giftBox from "@/public/gift.png";
import flightBox from "@/public/flightbox.png";
import coconut from "@/public/coconut.png";
import { Search, Gift, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { customerProductService } from "../services/customerProductService";
import { Product } from "../services/productService";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const abortController = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await customerProductService.searchProducts(searchQuery);
        if (response.success && !abortController.signal.aborted) {
          setSearchResults(response.data);
          setShowResults(true);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults?.length > 0) {
      router.push(`/product/${searchResults[0].id}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleSearchResultClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/product/${productId}`);
  };

  return (
    <section className="premium-shell relative min-h-[calc(100vh-1rem)] overflow-hidden pt-28 pb-14 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="premium-kicker mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Premium banana bread gifts
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] text-[#231913] sm:text-5xl md:text-6xl lg:text-7xl">
            Banana bread, boxed beautifully for every sweet occasion.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#5f5348] sm:text-lg">
            Discover signature loaves, minis, and curated flight boxes made for gifting,
            sharing, and slow weekend treats.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                document.getElementById("flavour-collections")?.scrollIntoView({ behavior: "smooth" })
              }
              className="premium-button px-7 py-4"
            >
              Shop the collection
            </button>
            <button
              onClick={() =>
                document.getElementById("gift-combos")?.scrollIntoView({ behavior: "smooth" })
              }
              className="premium-button-secondary px-7 py-4"
            >
              Build a gift box
            </button>
          </div>

          <div ref={searchRef} className="relative mt-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classic, coconut, minis, or gift boxes..."
                className="w-full rounded-full border border-[#eadfce] bg-white/85 px-6 py-4 pr-14 text-[#231913] shadow-sm outline-none placeholder:text-[#8a7b6b] focus:ring-2 focus:ring-[#c79a4b]/40"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#231913] p-3 transition-colors hover:bg-[#3a291f]"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </form>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 z-50 mt-2 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#eadfce] bg-white/95 shadow-xl backdrop-blur-lg"
              >
                {searchLoading && (
                  <div className="p-4 text-center text-sm text-[#8a7b6b]">Searching...</div>
                )}

                {!searchLoading && searchQuery && searchResults?.length === 0 && (
                  <div className="p-4 text-center text-sm text-[#8a7b6b]">No products found</div>
                )}

                {!searchLoading && searchResults?.length > 0 && (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSearchResultClick(product.id)}
                        className="flex w-full items-center gap-3 border-b border-[#eadfce] p-3 text-left last:border-b-0 hover:bg-[#fbf7ef]"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-[#f6ead8]">
                          {product.thumbnail && (
                            <Image
                              src={product.thumbnail}
                              alt={product.productName}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-semibold text-[#231913]">
                            {product.productName}
                          </h4>
                          <p className="text-xs text-[#8a7b6b]">
                            GHS {product.price.toFixed(2)} - {product.productCategory}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-left">
            {["Gift-ready boxes", "Paystack checkout", "Pickup or delivery"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#eadfce] bg-white/60 px-3 py-3 text-xs font-semibold text-[#5f5348]"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[420px] lg:min-h-[560px]"
        >
          <div className="absolute right-0 top-4 h-[74%] w-[78%] overflow-hidden rounded-[2rem] border border-[#eadfce] bg-[#fffdf8] shadow-2xl">
            <Image
              src={giftBox}
              alt="Cozy Oven premium gift box"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute bottom-8 left-0 h-56 w-52 overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-xl sm:h-64 sm:w-60">
            <Image src={flightBox} alt="Cozy Oven flight box" fill className="object-cover" />
          </div>
          <div className="premium-card absolute bottom-0 right-4 flex max-w-xs items-center gap-4 rounded-2xl p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f6ead8]">
              <Image src={coconut} alt="Coconut banana bread" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#b56b32]">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.14em]">
                  Gift note ready
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#231913]">
                Premium packaging for birthdays, teams, and thank-you treats.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
