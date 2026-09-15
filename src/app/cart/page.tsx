import { CartContent } from "@/components/cart/cart-content";

export const metadata = {
  title: "Shopping Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review your items before checkout
        </p>
      </header>
      <CartContent />
    </div>
  );
}