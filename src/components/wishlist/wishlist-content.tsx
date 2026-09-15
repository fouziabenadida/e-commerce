"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartActions } from "@/hooks/use-cart-actions";

export function WishlistContent() {
  const items = useWishlistStore((s) => s.items);
  const { addToCart, removeFromWishlist } = useCartActions();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Heart className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Save products you love and they'll appear here for easy access later.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">
            Explore products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative flex flex-col overflow-hidden rounded-xl border"
        >
          <Link
            href={`/product/${item.slug}`}
            className="relative aspect-square block bg-muted"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </Link>

          <button
            type="button"
            onClick={() => removeFromWishlist(item.id)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-red-500"
            aria-label={`Remove ${item.name} from wishlist`}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {item.stock === 0 && (
            <Badge variant="secondary" className="absolute left-3 top-3">
              Out of stock
            </Badge>
          )}

          <div className="flex flex-1 flex-col gap-2 p-4">
            <Link
              href={`/product/${item.slug}`}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
            <Button
              size="sm"
              className="mt-auto w-full"
              disabled={item.stock === 0}
              onClick={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  slug: item.slug,
                  stock: item.stock,
                })
              }
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}