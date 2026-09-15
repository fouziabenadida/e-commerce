import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { parseProductImages } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="mr-1 h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed py-20 text-center">
          <Package className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No products yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const images = parseProductImages(product.images);
                return (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          {images[0] ? (
                            <Image src={images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <Package className="m-3 h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[240px] truncate font-medium">
                            <Link href={`/admin/products/${product.id}/edit`} className="hover:underline">
                              {product.name}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category.name}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={product.stock < 10 ? "font-medium text-amber-600" : ""}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      {product.published ? (
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="mr-2 inline-flex rounded-md px-2 py-1 text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}