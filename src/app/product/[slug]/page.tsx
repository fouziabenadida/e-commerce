import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, parseProductImages } from "@/lib/products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { ProductCard } from "@/components/products/product-card";
import { ProductCarousel } from "@/components/products/product-carousel";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, images: true },
  });
  const images = product ? parseProductImages(product.images) : [];

  return {
    title: product?.name ?? "Product",
    description: product?.description?.slice(0, 160) ?? "Product details.",
    openGraph: images[0]
      ? {
          title: product?.name,
          description: product?.description?.slice(0, 160),
          images: [images[0]],
        }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: {
        published: true,
        category: { slug: product.categorySlug },
        NOT: { id: product.id },
      },
      include: { category: { select: { name: true, slug: true } } },
      take: 6,
    }),
  ]);

  const relatedPreviews = related.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    price: r.price,
    compareAtPrice: r.compareAtPrice,
    rating: r.rating,
    reviewCount: r.reviewCount,
    images: parseProductImages(r.images),
    stock: r.stock,
    categoryName: r.category.name,
    categorySlug: r.category.slug,
  }));

  const isSale = (product.compareAtPrice ?? 0) > product.price;
  const outOfStock = product.stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${product.categorySlug}`}>
              {product.categoryName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <ProductGallery images={product.images} alt={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {isSale && (
                <Badge variant="destructive">
                  {Math.round(
                    ((product.compareAtPrice! - product.price) /
                      product.compareAtPrice!) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
              {outOfStock && <Badge variant="secondary">Out of stock</Badge>}
              <Link
                href={`/category/${product.categorySlug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {product.categoryName}
              </Link>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "h-4 w-4 fill-amber-400 text-amber-400"
                        : "h-4 w-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} · {product.reviewCount}{" "}
                {product.reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          <Separator />

          <ProductPurchasePanel
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              stock: product.stock,
              rating: product.rating,
              reviewCount: product.reviewCount,
              image: product.images[0] ?? "",
            }}
          />

          <Separator />

          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <Separator />

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free shipping on orders over $75
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              30-day hassle-free returns
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Customer Reviews
          </h2>
          <ReviewsList productId={product.id} reviews={reviews} />
        </div>
        <div className="lg:pt-14">
          <ReviewForm productId={product.id} />
        </div>
      </section>

      {/* Related products */}
      {relatedPreviews.length > 0 && (
        <section className="mt-20">
          <ProductCarousel
            title={
              <h2 className="text-2xl font-bold tracking-tight">
                You might also like
              </h2>
            }
          >
            {relatedPreviews.map((related) => (
              <ProductCard
                key={related.id}
                product={related}
                className="w-[240px] shrink-0 sm:w-[280px]"
              />
            ))}
          </ProductCarousel>
        </section>
      )}
    </div>
  );
}