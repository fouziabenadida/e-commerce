"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { useCartStore, getCartTotal, getCartCount } from "@/store/cart-store";
import { useCartActions } from "@/hooks/use-cart-actions";
import { storeConfig } from "@/lib/constants";

export function CartContent() {
  const items = useCartStore((s) => s.items);
  const { changeQuantity, removeFromCart } = useCartActions();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Looks like you haven't added anything yet. Explore our catalog and
          find something you love.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">
            Start shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const subtotal = getCartTotal(items);
  const count = getCartCount(items);
  const shipping = subtotal >= storeConfig.freeShippingThreshold ? 0 : storeConfig.shipping;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(
    0,
    storeConfig.freeShippingThreshold - subtotal
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* Items */}
      <div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border p-4"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => changeQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span
                      className="w-10 text-center text-sm font-medium"
                      aria-live="polite"
                    >
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => changeQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Order summary</h2>

        {remainingForFreeShipping > 0 && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              Add {formatPrice(remainingForFreeShipping)} more for free shipping
            </p>
          </div>
        )}

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({count} items)</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </dd>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <dt className="text-base font-semibold">Total</dt>
            <dd className="text-xl font-bold">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Taxes calculated at checkout. Demo checkout — no real payments.
        </p>
      </div>
    </div>
  );
}