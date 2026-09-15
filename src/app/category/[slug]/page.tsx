import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toProductPreview } from "@/lib/products";
import type { ProductPreview } from "@/components/products/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { CategoryCard } from "@/components/home/category-card";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return {
    title: category?.name ?? "Category",
    description: category?.description ?? `Browse ${category?.name} products.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: { where: { published: true } } } },
      products: {
        where: { published: true },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  const previews: ProductPreview[] = category.products.map(toProductPreview);

  const otherCategories = await prisma.category.findMany({
    where: { slug: { not: slug } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      _count: { select: { products: { where: { published: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Category header */}
      <div className="relative overflow-hidden rounded-2xl border">
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-20">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            Shop
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-xl text-white/80">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-sm font-medium text-white/70">
            {category._count.products} products
          </p>
        </div>
      </div>

      <div className="mt-10">
        <ProductGrid products={previews} />
        {previews.length === 0 && (
          <div className="rounded-lg border border-dashed py-20 text-center">
            <p className="text-lg font-medium">No products in this category yet</p>
            <Link href="/shop" className="mt-2 inline-block text-sm text-primary underline">
              Browse all products
            </Link>
          </div>
        )}
      </div>

      {/* Other categories */}
      {otherCategories.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Explore other categories
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {otherCategories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}