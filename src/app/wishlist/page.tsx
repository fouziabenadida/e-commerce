import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Wishlist
        </h1>
        <p className="mt-2 text-muted-foreground">
          Products you&apos;re saving for later
        </p>
      </header>
      <WishlistContent />
    </div>
  );
}