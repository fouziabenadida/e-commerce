import { prisma } from "@/lib/prisma";
import type { ProductPreview } from "@/components/products/product-card";
import type { Prisma } from "@prisma/client";

const productInclude = {
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductInclude;

type PrismaProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function toProductPreview(product: PrismaProduct): ProductPreview {
  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [];
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images,
    stock: product.stock,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
  };
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { featured: true, published: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductPreview);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductPreview);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return product ? toProductPreview(product) : null;
}

export async function getCategories() {
  return prisma.category.findMany({
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
}

export function parseProductImages(json: string): string[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}