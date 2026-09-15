import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { parseProductImages } from "@/lib/products";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { storeConfig } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findFirst({
    where: { id, userId: session?.user?.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true, images: true } },
        },
      },
    },
  });

  if (!order) notFound();

  const itemTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = order.total - itemTotal;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.id.slice(-8)}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-muted-foreground">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === "PENDING" && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium">Order received</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order is being processed. This is a demo store — no
              shipment will actually occur.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="rounded-xl border">
          <h2 className="border-b px-6 py-4 text-lg font-semibold">
            Items
          </h2>
          <ul className="divide-y">
            {order.items.map((item) => {
              const images = parseProductImages(item.product.images);
              return (
                <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                  {images[0] ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Shipment</h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {order.shippingAddress}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Standard delivery
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatPrice(itemTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between">
                <dt className="text-base font-semibold">Total</dt>
                <dd className="text-xl font-bold">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            {shipping > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Free shipping on orders over {formatPrice(storeConfig.freeShippingThreshold)}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}