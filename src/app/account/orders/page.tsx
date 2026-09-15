import Link from "next/link";
import { Package, PackageX } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { parseProductImages } from "@/lib/products";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export const metadata = {
  title: "Order History",
};

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Order history</h1>
      <p className="mt-1 text-muted-foreground">
        Track all the orders you&apos;ve placed
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <PackageX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            When you place an order it will show up here.
          </p>
          <Link
            href="/shop"
            className="mt-5 text-sm font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const count = order.items.reduce((s, i) => s + i.quantity, 0);
            const firstItem = order.items[0]?.product;
            const images = firstItem ? parseProductImages(firstItem.images) : [];

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-xl border p-5 transition-colors hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 font-mono text-sm font-semibold">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      #{order.id.slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed {formatDate(order.createdAt)} · {count} item
                      {count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  {(images.length > 0
                    ? images.slice(0, 4)
                    : [""]
                  ).map((img, i) => (
                    <div
                      key={i}
                      className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border bg-muted"
                    >
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}