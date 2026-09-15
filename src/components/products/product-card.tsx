"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCartActions } from "@/hooks/use-cart-actions";
import { isInWishlist } from "@/store/wishlist-store";

export interface ProductPreview {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
  stock: number;
  categoryName?: string;
  categorySlug?: string;
}

interface ProductCardProps {
  product: ProductPreview;
  className?: string;
}

function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return <Star key={i} className={cn(dim, "fill-amber-400 text-amber-400")} />;
        }
        if (i === full && hasHalf) {
          return (
            <span key={i} className="relative inline-flex">
              <Star className={cn(dim, "text-muted-foreground/30")} />
              <StarHalf className={cn(dim, "absolute inset-0 fill-amber-400 text-amber-400")} />
            </span>
          );
        }
        return <Star key={i} className={cn(dim, "text-muted-foreground/30")} />;
      })}
    </span>
  );
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlistItems } = useCartActions();
  const [wished, setWished] = React.useState(false);

  React.useEffect(() => {
    setWished(isInWishlist(wishlistItems, product.id));
  }, [wishlistItems, product.id]);

  const isSale = (product.compareAtPrice ?? 0) > product.price;
  const discount = isSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;
  const outOfStock = product.stock === 0;

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        <Link href={`/product/${product.slug}`} className="block aspect-square">
          <Image
            src={product.images[0] ?? "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isSale && <Badge className="bg-red-600 text-white">{discount}% OFF</Badge>}
          {outOfStock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>

        {/* Wishlist */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background"
              onClick={() => toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? "",
                slug: product.slug,
                stock: product.stock,
              })}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-red-500 text-red-500")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{wished ? "Remove from wishlist" : "Add to wishlist"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Quick add */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-300 group-hover:translate-y-0">
            <Button
              className="w-full shadow-lg"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] ?? "",
                  slug: product.slug,
                  stock: product.stock,
                })
              }
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {product.categoryName && (
          <Link
            href={`/category/${product.categorySlug}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {product.categoryName}
          </Link>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          {product.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          )}
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {isSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}