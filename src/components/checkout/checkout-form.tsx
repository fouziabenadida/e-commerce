"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { storeConfig } from "@/lib/constants";
import { useCartStore, getCartTotal, getCartCount } from "@/store/cart-store";
import { createOrder } from "@/app/actions/orders";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = getCartTotal(items);
  const shipping =
    subtotal >= storeConfig.freeShippingThreshold ? 0 : storeConfig.shipping;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    const formData = new FormData(e.currentTarget);
    const shippingAddress = [
      formData.get("street"),
      formData.get("city"),
      formData.get("state"),
      formData.get("postalCode"),
      formData.get("country"),
    ]
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean)
      .join(", ");

    setIsSubmitting(true);
    const result = await createOrder({
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      })),
      shippingAddress,
      paymentMethod: "Mock card",
    });
    setIsSubmitting(false);

    if (result.ok) {
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/account/orders/${result.orderId}`);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* Left: forms */}
      <div className="space-y-6">
        <section className="rounded-xl border p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
            Contact
          </h2>
          <div className="mt-4">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="you@example.com" />
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
            Shipping address
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="street">Street address</Label>
              <Input id="street" name="street" required className="mt-1.5" placeholder="123 Main St" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required className="mt-1.5" placeholder="New York" />
            </div>
            <div>
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" name="state" className="mt-1.5" placeholder="NY" />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" name="postalCode" required className="mt-1.5" placeholder="10001" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" required className="mt-1.5" placeholder="United States" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
            Payment
          </h2>
          <div className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Demo checkout — no real payment is processed.
            </p>
          </div>
        </section>
      </div>

      {/* Right: summary */}
      <div className="rounded-xl border p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <ul className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                  {item.name}
                </Link>
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({getCartCount(items)})</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium">
              {shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}
            </dd>
          </div>
          <Separator />
          <div className="flex justify-between">
            <dt className="text-base font-semibold">Total</dt>
            <dd className="text-xl font-bold">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={items.length === 0 || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing order...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Place order
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          This is a demonstration. No payment will be charged.
        </p>
      </div>
    </form>
  );
}