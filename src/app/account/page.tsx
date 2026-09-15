import Link from "next/link";
import { Package, Clock, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [user, orderCount, recentOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, createdAt: true },
    }),
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, total: true, createdAt: true },
    }),
  ]);

  const lifetimeSpend = await prisma.order.aggregate({
    where: { userId, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    _sum: { total: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Hi, {user?.name?.split(" ")[0] ?? "there"}!
      </h1>
      <p className="mt-1 text-muted-foreground">{user?.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Orders placed</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold">
            <Package className="h-6 w-6 text-muted-foreground" />
            {orderCount}
          </p>
        </div>
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Lifetime spend</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold">
            <Clock className="h-6 w-6 text-muted-foreground" />
            {formatPrice(lifetimeSpend._sum.total ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Member since</p>
          <p className="mt-2 text-xl font-bold">
            {formatDate(user?.createdAt ?? new Date())}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent orders</h2>
          {orderCount > 0 && (
            <Button asChild variant="link" className="px-0">
              <Link href="/account/orders">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed p-10 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
            <Button asChild className="mt-4">
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        #{order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}