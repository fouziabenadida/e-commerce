"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  stock: number;
  categorySlug: string;
  featured: boolean;
  published: boolean;
};

export async function saveProduct(input: ProductInput, productId?: string) {
  await requireAdmin();

  if (!input.name.trim() || !input.slug.trim() || input.price <= 0) {
    return { ok: false as const, error: "Name, slug, and a positive price are required." };
  }
  if (!input.images.length) {
    return { ok: false as const, error: "Add at least one image URL." };
  }

  const category = await prisma.category.findUnique({
    where: { slug: input.categorySlug },
  });
  if (!category) {
    return { ok: false as const, error: "Selected category does not exist." };
  }

  const data = {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    description: input.description.trim(),
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    images: JSON.stringify(input.images),
    stock: input.stock,
    categoryId: category.id,
    featured: input.featured,
    published: input.published,
  };

  // Slug uniqueness (excluding self when editing)
  const existing = await prisma.product.findFirst({
    where: {
      slug: data.slug,
      ...(productId ? { id: { not: productId } } : {}),
    },
  });
  if (existing) {
    return { ok: false as const, error: "A product with this slug already exists." };
  }

  if (productId) {
    const current = await prisma.product.findUnique({ where: { id: productId } });
    if (!current) return { ok: false as const, error: "Product not found." };
    await prisma.product.update({
      where: { id: productId },
      data: { ...data, categoryId: category.id },
    });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/", "layout");
}

export type OrderStatusValue =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusValue
) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
}