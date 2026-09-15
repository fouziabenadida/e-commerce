"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartActions } from "@/hooks/use-cart-actions";
import { isInWishlist } from "@/store/wishlist-store";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    rating: number;
    reviewCount: number;
    image: string;
  };
}

export function ProductPurchasePanel({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems } = useCartActions();
  const [quantity, setQuantity] = React.useState(1);
  const [wished, setWished] = React.useState(false);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    setWished(isInWishlist(wishlistItems, product.id));
  }, [wishlistItems, product.id]);

  const isSale = (product.compareAtPrice ?? 0) > product.price;
  const outOfStock = product.stock === 0;

  function handleAdd() {
    setAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      stock: product.stock,
    }, quantity);
    // Small delay so the button state feels responsive
    window.setTimeout(() => setAdding(false), 600);
  }

  function handleBuyNow() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      stock: product.stock,
    }, quantity);
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        {isSale && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice!)}
          </span>
        )}
        <span className="text-3xl font-bold tracking-tight">
          {formatPrice(product.price)}
        </span>
        {isSale && (
          <Badge className="bg-red-600 text-white">
            Save{" "}
            {formatPrice(product.compareAtPrice! - product.price)}
          </Badge>
        )}
      </div>

      {/* Stock status */}
      <p
        className={cn(
          "flex items-center gap-1.5 text-sm",
          outOfStock ? "text-red-500" : "text-green-600"
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", outOfStock ? "bg-red-500" : "bg-green-500")} />
        {outOfStock
          ? "Out of stock"
          : product.stock <= 5
            ? `Only ${product.stock} left in stock`
            : "In stock"}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={outOfStock || quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() =>
              setQuantity((q) => Math.min(product.stock, q + 1))
            }
            disabled={outOfStock || quantity >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAdd}
          disabled={outOfStock}
        >
          {adding ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <ShoppingBag className="mr-2 h-4 w-4" />
          )}
          {adding ? "Added!" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() =>
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
              stock: product.stock,
            })
          }
          className={cn(wished && "text-red-500")}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("mr-2 h-4 w-4", wished && "fill-red-500")} />
          Wishlist
        </Button>
      </div>

      <Button size="lg" variant="outline" className="w-full" onClick={handleBuyNow} disabled={outOfStock}>
        Buy it now
      </Button>

      {/* Trust */}
      <div className="space-y-3 rounded-lg border bg-muted/40 p-4 text-sm">
        <p className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          Free shipping on orders over $75
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}