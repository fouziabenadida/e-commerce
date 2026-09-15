import { prisma } from "@/lib/prisma";
import { toProductPreview } from "@/lib/products";
import type { ProductPreview } from "@/components/products/product-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopSidebar, ShopMobileFilters } from "@/components/shop/shop-sidebar";
import { SortSelect } from "@/components/shop/sort-select";
import { ResultsInfo } from "@/components/shop/results-info";

export const metadata = {
  title: "Shop",
  description: "Browse our full catalog of curated products.",
};

const PAGE_SIZE = 12;

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    featured?: string;
    min?: string;
    max?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const sort = params.sort ?? "newest";

  const where = {
    published: true,
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q } },
            { description: { contains: params.q } },
          ],
        }
      : {}),
    ...(params.category
      ? { category: { slug: params.category } }
      : {}),
    ...(params.featured === "true" ? { featured: true } : {}),
    ...(params.min || params.max
      ? {
          price: {
            ...(params.min ? { gte: parseInt(params.min, 10) } : {}),
            ...(params.max ? { lte: parseInt(params.max, 10) } : {}),
          },
        }
      : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "rating"
          ? { rating: "desc" as const }
          : sort === "name"
            ? { name: "asc" as const }
            : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
      _count: { select: { products: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  const previews: ProductPreview[] = products.map(toProductPreview);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our curated collection
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <ShopSidebar categories={categories} />
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShopMobileFilters categories={categories} />
              <ResultsInfo total={total} page={page} pageSize={PAGE_SIZE} />
            </div>
            <SortSelect sort={sort} />
          </div>

          <ProductGrid products={previews} />

          {previews.length === 0 && (
            <div className="rounded-lg border border-dashed py-20 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <PaginationLinks page={page} totalPages={totalPages} params={params} />
          )}
        </div>
      </div>
    </div>
  );
}

function PaginationLinks({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  const buildHref = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    search.set("page", String(target));
    return `/shop?${search.toString()}`;
  };

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <a
          href={buildHref(page - 1)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Previous
        </a>
      )}
      <span className="px-3 py-2 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <a
          href={buildHref(page + 1)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Next
        </a>
      )}
    </nav>
  );
}