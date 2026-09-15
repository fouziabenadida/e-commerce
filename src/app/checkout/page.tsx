import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-muted-foreground">Complete your purchase</p>
      </header>
      <CheckoutForm />
    </div>
  );
}