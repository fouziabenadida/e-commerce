import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseProductImages } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: { select: { slug: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <h2 className="text-xl font-semibold">Edit product</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update details for {product.name}
      </p>

      <div className="mt-6">
        <ProductForm
          categories={categories}
          isEdit={true}
          initialValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            images: parseProductImages(product.images),
            stock: product.stock,
            categorySlug: product.category.slug,
            featured: product.featured,
            published: product.published,
          }}
        />
      </div>
    </div>
  );
}