"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartStore, type CartProduct } from "@/store/cart-store";
import { useWishlistStore, type WishlistItem } from "@/store/wishlist-store";

export function useCartActions() {
  const { status } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const items = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);

  const isAuthenticated = status === "authenticated";

  const persistCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: useCartStore.getState().items }),
      });
    } catch {
      // ignore sync errors silently
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(
    (product: CartProduct, quantity = 1) => {
      addItem(product, quantity);
      void persistCart();
      toast.success(`${product.name} added to cart`);
    },
    [addItem, persistCart]
  );

  const changeQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
      void persistCart();
    },
    [updateQuantity, persistCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeItem(productId);
      void persistCart();
      toast.info("Item removed from cart");
    },
    [removeItem, persistCart]
  );

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      const inList = wishlistItems.some((i) => i.id === item.id);
      toggleItem(item);
      if (isAuthenticated) {
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id }),
        }).catch(() => {});
      }
      toast.success(inList ? "Removed from wishlist" : "Added to wishlist");
    },
    [toggleItem, wishlistItems, isAuthenticated]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      removeWishlist(productId);
      if (isAuthenticated) {
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        }).catch(() => {});
      }
      toast.info("Removed from wishlist");
    },
    [removeWishlist, isAuthenticated]
  );

  return {
    items,
    wishlistItems,
    addToCart,
    changeQuantity,
    removeFromCart,
    toggleWishlist,
    removeFromWishlist,
  };
}