import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { ShopProduct } from "../data/mockShopProducts";

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  variant?: string;
}
export const cartLineKey = (productId: string, variant?: string) => `${productId}::${variant || "base"}`;

interface CartContextValue {
  items: CartItem[];
  wishlist: string[];
  count: number;
  total: number;
  addItem: (product: ShopProduct, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQty: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "shopfoodvn_cart";
const WISHLIST_STORAGE_KEY = "shopfoodvn_wishlist";

function readStoredCart(): CartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readStoredWishlist(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);
  const [wishlist, setWishlist] = useState<string[]>(readStoredWishlist);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    fetch("/seller-api/public/catalog")
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!data?.products) return;
        const productsById = new Map(data.products.map((product: any) => [`sql-product-${product.id}`, product]));
        setItems(current => current.map(item => {
          const fresh: any = productsById.get(item.product.id);
          if (!fresh) return item;
          return {
            ...item,
            product: {
              ...item.product,
              shopId: `sql-shop-${fresh.shopId}`,
              shopName: fresh.shopName,
              shopAvatar: fresh.shopLogoUrl || item.product.shopAvatar,
              shopRating: Number(fresh.shopRating || 0),
              restaurantId: Number(fresh.shopId),
            },
          };
        }));
      })
      .catch(() => {});
  }, []);

  const addItem = useCallback((product: ShopProduct, quantity = 1, variant?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.variant === variant);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.variant === variant
            ? { ...i, product, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity, variant }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variant?: string) => {
    setItems((prev) => prev.filter((i) => cartLineKey(i.product.id,i.variant) !== cartLineKey(productId,variant)));
  }, []);

  const updateQty = useCallback((productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => cartLineKey(i.product.id,i.variant) !== cartLineKey(productId,variant)));
    } else {
      setItems((prev) =>
        prev.map((i) => (cartLineKey(i.product.id,i.variant) === cartLineKey(productId,variant) ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, wishlist, count, total, addItem, removeItem, updateQty, clearCart, toggleWishlist, isInWishlist }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
