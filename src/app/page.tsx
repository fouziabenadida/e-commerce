import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryCard } from "@/components/home/category-card";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { ProductCard } from "@/components/products/product-card";
import { ProductCarousel } from "@/components/products/product-carousel";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts, getNewArrivals } from "@/lib/products";

export default async function Home() {
  const [categories, featured, newArrivals] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getNewArrivals(8),
  ]);

  return (
    <div className="flex-1">
      <Hero />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/shop">View all</Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:auto-rows-[190px]">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductCarousel
            title={
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Featured products
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Hand-picked favorites our customers love
                </p>
              </div>
            }
          >
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[240px] shrink-0 sm:w-[280px]"
              />
            ))}
          </ProductCarousel>
        </div>
      </section>

      <PromoBanner />

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ProductCarousel
          title={
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                New arrivals
              </h2>
              <p className="mt-2 text-muted-foreground">
                Just dropped — grab them before they're gone
              </p>
            </div>
          }
        >
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-[240px] shrink-0 sm:w-[280px]"
            />
          ))}
        </ProductCarousel>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/shop">
              Browse all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </div>
  );
}