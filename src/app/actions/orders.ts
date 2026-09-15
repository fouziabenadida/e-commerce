"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeConfig } from "@/lib/constants";

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: string;
}

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You need to be signed in to place an order." };
  }

  if (
    !input.items.length ||
    input.shippingAddress.trim().length < 10 ||
    !input.paymentMethod
  ) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true, name: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems: {
    productId: string;
    quantity: number;
    price: number;
  }[] = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { ok: false, error: "A product in your cart no longer exists." };
    }
    const quantity = Math.min(item.quantity, product.stock);
    if (quantity <= 0) {
      return { ok: false, error: `${product.name} is out of stock.` };
    }
    subtotal += product.price * quantity;
    orderItems.push({ productId: product.id, quantity, price: product.price });
  }

  if (subtotal <= 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const shipping =
    subtotal >= storeConfig.freeShippingThreshold ? 0 : storeConfig.shipping;
  const total = subtotal + shipping;

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const created = await tx.order.create({
      data: {
        userId: session.user.id,
        shippingAddress: input.shippingAddress,
        total,
        items: { create: orderItems },
      },
      select: { id: true },
    });

    await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

    return created;
  });

  return { ok: true, orderId: order.id };
}