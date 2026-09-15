import { ProductCard, type ProductPreview } from "@/components/products/product-card";

export function ProductGrid({ products }: { products: ProductPreview[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}