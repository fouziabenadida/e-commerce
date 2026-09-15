"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function CartSync() {
  const { status } = useSession();
  const replaceCart = useCartStore((s) => s.replaceItems);
  const replaceWishlist = useWishlistStore((s) => s.replaceItems);
  const synced = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !synced.current) {
      synced.current = true;

      fetch("/api/cart")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.items) replaceCart(data.items);
        })
        .catch(() => {});

      fetch("/api/wishlist")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.items) replaceWishlist(data.items);
        })
        .catch(() => {});
    }

    if (status === "unauthenticated") {
      synced.current = false;
    }
  }, [status, replaceCart, replaceWishlist]);

  return null;
}