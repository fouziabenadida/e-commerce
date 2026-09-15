import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CartItem as StoreCartItem } from "@/store/cart-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  const items: StoreCartItem[] = cartItems.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: JSON.parse(item.product.images)[0] ?? "",
    slug: item.product.slug,
    stock: item.product.stock,
    quantity: item.quantity,
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { items: StoreCartItem[] };
    const items = body.items ?? [];

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { userId: session.user.id } });
      if (items.length > 0) {
        await tx.cartItem.createMany({
          data: items.map((item) => ({
            userId: session.user.id,
            productId: item.id,
            quantity: item.quantity,
          })),
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}