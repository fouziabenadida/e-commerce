import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Product",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Add product</span>
      </nav>

      <h2 className="text-xl font-semibold">Add product</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new product in your catalog
      </p>

      <div className="mt-6">
        <ProductForm
          categories={categories}
          isEdit={false}
          initialValues={{
            name: "",
            slug: "",
            description: "",
            price: 0,
            compareAtPrice: null,
            images: [],
            stock: 0,
            categorySlug: categories[0]?.slug ?? "",
            featured: false,
            published: true,
          }}
        />
      </div>
    </div>
  );
}