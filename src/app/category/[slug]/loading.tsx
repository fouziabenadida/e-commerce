import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/ui/product-card-skeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-6 h-12 w-72" />
      <Skeleton className="mt-3 h-5 w-96" />
      <div className="mt-10">
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}