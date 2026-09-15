"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function CartButton() {
  const count = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Button asChild variant="ghost" size="icon" aria-label="Shopping cart">
      <Link href="/cart" className="relative">
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}

export function WishlistButton() {
  const count = useWishlistStore((s) => s.items.length);

  return (
    <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
      <Link href="/wishlist" className="relative">
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}