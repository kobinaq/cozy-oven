"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/public/cozy3.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { customerProductService } from "../services/customerProductService";
import { Product } from "../services/productService";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { getCartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const abortController = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await customerProductService.searchProducts(searchQuery);
        if (response.success && !abortController.signal.aborted) {
          setSearchResults(response.data);
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

  const cartCount = isMounted ? getCartCount() : 0;
  const visibleNavLinks =
    isMounted && isAuthenticated
      ? [...navLinks.slice(0, 2), { label: "Orders", href: "/account/orders" }, ...navLinks.slice(2)]
      : navLinks;

  const handleCartClick = () => {
    if (cartCount > 0) setCartDrawerOpen(true);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMenuOpen(false);
  };

  const handleAuthClick = () => {
    setAuthModalOpen(true);
    setProfileMenuOpen(false);
  };

  const handleSearchResultClick = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/product/${productId}`);
  };

  return (
    <>
      <div className="delivery-ribbon py-2">
        <div className="delivery-ribbon-track">
          <span>Freshly baked banana bread delivered Tuesdays & Thursdays</span>
          <span>Order for yourself, family, office treats, or a thoughtful gift box</span>
          <span>Freshly baked banana bread delivered Tuesdays & Thursdays</span>
          <span>Order for yourself, family, office treats, or a thoughtful gift box</span>
        </div>
      </div>

      <nav className="sticky top-0 z-40 w-full px-3 py-3 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-[rgba(48,23,15,0.08)] bg-[#FFF8EC]/85 px-4 py-3 shadow-[0_12px_40px_rgba(48,23,15,0.10)] backdrop-blur-xl md:px-5">
          <Link href="/" className="flex min-w-max items-center gap-3" aria-label="Cozy Oven home">
            <Image src={logo} width={48} height={48} alt="Cozy Oven" className="rounded-full" />
            <span className="hidden leading-tight sm:block">
              <strong className="block text-sm font-black text-[#30170F]">Cozy Oven</strong>
              <small className="block text-xs text-[#80634F]">Premium banana bread</small>
            </span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-black text-[#5B3322] transition-colors hover:text-[#C97D35]"
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-0.5 rounded-full bg-[#C97D35] transition-all duration-300 group-hover:w-full ${
                    pathname === link.href ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-full bg-[#FFFDF7] p-2 text-[#30170F] shadow-[inset_0_0_0_1px_rgba(48,23,15,0.09)] transition hover:text-[#C97D35]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 z-50 mt-3 w-[calc(100vw-8rem)] overflow-hidden rounded-[28px] border border-[rgba(48,23,15,0.1)] bg-[#FFFDF7]/95 shadow-[0_26px_80px_rgba(48,23,15,0.16)] backdrop-blur-lg sm:w-96 md:w-80"
                >
                  <div className="border-b border-[rgba(48,23,15,0.1)] p-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="editorial-input px-4 py-3 text-sm"
                      autoFocus
                    />
                  </div>

                  {searchLoading && <div className="p-4 text-center text-sm text-[#80634F]">Searching...</div>}
                  {!searchLoading && searchQuery && searchResults?.length === 0 && (
                    <div className="p-4 text-center text-sm text-[#80634F]">No products found</div>
                  )}

                  {!searchLoading && searchResults?.length > 0 && (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchResultClick(product.id)}
                          className="flex w-full items-center gap-3 border-b border-[rgba(48,23,15,0.08)] p-3 text-left hover:bg-[#F7EAD6]/55 last:border-b-0"
                        >
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-[#F7EAD6]">
                            {product.thumbnail && (
                              <Image src={product.thumbnail} alt={product.productName} fill className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-black text-[#30170F]">{product.productName}</h4>
                            <p className="text-xs text-[#80634F]">
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

            {isMounted && (
              <button
                onClick={handleCartClick}
                className="relative rounded-full bg-[#FFFDF7] p-2 text-[#30170F] shadow-[inset_0_0_0_1px_rgba(48,23,15,0.09)] transition hover:text-[#C97D35]"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F3C667] text-xs font-black text-[#30170F]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {isMounted && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="rounded-full bg-[#FFFDF7] p-2 text-[#30170F] shadow-[inset_0_0_0_1px_rgba(48,23,15,0.09)] transition hover:text-[#C97D35]"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-[26px] border border-[rgba(48,23,15,0.1)] bg-[#FFFDF7]/95 text-sm shadow-[0_26px_80px_rgba(48,23,15,0.16)] backdrop-blur-lg">
                    {isAuthenticated ? (
                      <>
                        <div className="border-b border-[rgba(48,23,15,0.1)] px-4 py-3">
                          <p className="font-black text-[#30170F]">{user?.fullName}</p>
                          <p className="truncate text-xs text-[#80634F]">{user?.email}</p>
                        </div>
                        <Link href="/account/orders" onClick={() => setProfileMenuOpen(false)} className="block px-4 py-2 text-[#5B3322] hover:bg-[#F7EAD6]/55">
                          My Orders
                        </Link>
                        <Link href="/account/details" onClick={() => setProfileMenuOpen(false)} className="block px-4 py-2 text-[#5B3322] hover:bg-[#F7EAD6]/55">
                          Account Settings
                        </Link>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-700 hover:bg-red-50">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button onClick={handleAuthClick} className="w-full px-4 py-3 text-left font-black text-[#30170F] hover:bg-[#F7EAD6]/55">
                        Sign In / Sign Up
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full bg-[#FFFDF7] p-2 text-[#30170F] shadow-[inset_0_0_0_1px_rgba(48,23,15,0.09)] transition hover:text-[#C97D35] md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMounted && menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#30170F]/45 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 rounded-t-[34px] bg-[#FFF8EC] p-8 pt-12 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full flex-col items-center gap-6">
                {visibleNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className="text-2xl font-black text-[#30170F] transition-colors hover:text-[#C97D35]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-6 flex w-full flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      <div className="rounded-2xl bg-[#FFFDF7] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(48,23,15,0.09)]">
                        <p className="font-black text-[#30170F]">{user?.fullName}</p>
                        <p className="text-xs text-[#80634F]">{user?.email}</p>
                      </div>
                      <motion.button onClick={() => { router.push("/account/orders"); setMenuOpen(false); }} className="rounded-full bg-[#FFFDF7] py-3 text-lg font-black transition hover:bg-[#F7EAD6]">
                        My Orders
                      </motion.button>
                      <motion.button onClick={() => { router.push("/account/details"); setMenuOpen(false); }} className="rounded-full bg-[#FFFDF7] py-3 text-lg font-black transition hover:bg-[#F7EAD6]">
                        Account Settings
                      </motion.button>
                      <motion.button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-full bg-red-50 py-3 text-lg font-black text-red-700 transition hover:bg-red-100">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <motion.button onClick={handleAuthClick} className="rounded-full bg-[#30170F] py-3 text-lg font-black text-[#FFF8EC] transition hover:bg-[#1F100B]">
                      Sign In / Sign Up
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMounted && (
        <>
          <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
      )}
    </>
  );
}
