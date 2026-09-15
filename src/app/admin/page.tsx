import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const [orderCount, revenue, productCount, lowStockCount, pendingOrders, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lt: 10 } } }),
      prisma.order.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  const stats = [
    { label: "Revenue", value: formatPrice(revenue._sum.total ?? 0), icon: DollarSign },
    { label: "Orders", value: String(orderCount), icon: ShoppingBag },
    { label: "Products", value: String(productCount), icon: Package },
    {
      label: "Low stock",
      value: String(lowStockCount),
      icon: AlertTriangle,
      warn: lowStockCount > 0,
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border p-6"
            >
              <Icon
                className={`h-5 w-5 ${stat.warn ? "text-amber-500" : "text-muted-foreground"}`}
              />
              <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {pendingOrders.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-amber-700">
            <AlertTriangle className="h-5 w-5" />
            {pendingOrders.length} order{pendingOrders.length > 1 ? "s" : ""} awaiting processing
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Order</th>
                  <th className="py-2 pr-4 font-medium">Customer</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Total</th>
                  <th className="py-2 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="py-2 pr-4">{order.user.name ?? order.user.email}</td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-2 pr-4 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="font-medium text-primary hover:underline"
                      >
                        Process
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Button asChild variant="link" className="px-0">
            <Link href="/admin/orders">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Customer</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-xs">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="py-2 pr-4">{order.user.name ?? order.user.email}</td>
                  <td className="py-2 pr-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-2 pr-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}