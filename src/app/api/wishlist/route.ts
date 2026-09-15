import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { WishlistItem as StoreWishlistItem } from "@/store/wishlist-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  const items: StoreWishlistItem[] = wishlist.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: JSON.parse(item.product.images)[0] ?? "",
    slug: item.product.slug,
    stock: item.product.stock,
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { productId: string };
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: body.productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
    } else {
      await prisma.wishlistItem.create({
        data: { userId: session.user.id, productId: body.productId },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}