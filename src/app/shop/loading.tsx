import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-3 h-5 w-72" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-96 rounded-xl lg:block" />
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}