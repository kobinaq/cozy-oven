"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  price: string;
  image?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  sizes?: string[];
  details?: string;
  isAvailable?: boolean;
  category?: string;
  productImages?: string[];
}

export interface PackageSelection {
  label: string;
  quantity: number;
  groupLabel?: string;
  groupId?: string;
  type?: "fixed" | "selection";
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  packageSelections?: PackageSelection[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, packageSelections?: PackageSelection[]) => void;
  removeFromCart: (productId: string, size?: string, packageSelections?: PackageSelection[]) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, packageSelections?: PackageSelection[]) => void;
  clearCart: () => void;
  moveAllToWishlist: () => CartItem[];
  getCartCount: () => number;
  getCartTotal: () => number;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const packageSelectionKey = (selections?: PackageSelection[]) =>
  JSON.stringify(
    [...(selections || [])]
      .filter((selection) => selection.label && selection.quantity > 0)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((selection) => [selection.label, selection.quantity])
  );

export function CartProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load from localStorage initially
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Clear toast message after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    size?: string,
    packageSelections?: PackageSelection[]
  ) => {
    setCart((prevCart) => {
      const nextSelectionKey = packageSelectionKey(packageSelections);
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          packageSelectionKey(item.packageSelections) === nextSelectionKey
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        setToastMessage("Item quantity updated in cart!");
        return updatedCart;
      }

      setToastMessage("Item added to cart!");
      return [...prevCart, { ...product, quantity, selectedSize: size, packageSelections }];
    });
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const removeFromCart = (productId: string, size?: string, packageSelections?: PackageSelection[]) => {
    const targetSelectionKey = packageSelectionKey(packageSelections);
    setCart((prevCart) => 
      prevCart.filter(
        (item) =>
          !(
            item.id === productId &&
            (!size || item.selectedSize === size) &&
            packageSelectionKey(item.packageSelections) === targetSelectionKey
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    packageSelections?: PackageSelection[]
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, packageSelections);
      return;
    }

    const targetSelectionKey = packageSelectionKey(packageSelections);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId &&
        (!size || item.selectedSize === size) &&
        packageSelectionKey(item.packageSelections) === targetSelectionKey
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const moveAllToWishlist = (): CartItem[] => {
    const currentCart = [...cart];
    setCart([]);
    return currentCart;
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace("GHS ", ""));
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        moveAllToWishlist,
        getCartCount,
        getCartTotal,
        toastMessage,
        clearToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
