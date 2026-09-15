"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ReviewActionResult =
  | { success: true }
  | { success: false; error: string };

export async function addReview(
  productId: string,
  rating: number,
  comment: string
): Promise<ReviewActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to leave a review." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a rating between 1 and 5." };
  }

  if (comment.trim().length > 500) {
    return { success: false, error: "Review must be under 500 characters." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });
  if (!product) {
    return { success: false, error: "Product not found." };
  }

  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
    update: { rating, comment: comment.trim() },
    create: {
      userId: session.user.id,
      productId,
      rating,
      comment: comment.trim(),
    },
  });

  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: { rating: average, reviewCount: reviews.length },
  });

  revalidatePath(`/product/${product.slug}`);
  return { success: true };
}

export async function deleteReview(
  reviewId: string,
  productId: string
): Promise<ReviewActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.userId !== session.user.id) {
    return { success: false, error: "You can only delete your own reviews." };
  }

  await prisma.review.delete({ where: { id: reviewId } });

  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { rating: average, reviewCount: reviews.length },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });
  if (product) revalidatePath(`/product/${product.slug}`);

  return { success: true };
}