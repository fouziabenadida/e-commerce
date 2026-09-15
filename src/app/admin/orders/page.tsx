import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true, price: true } },
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update order statuses as they move through fulfillment
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(-8)}</td>
                    <td className="px-4 py-3">{order.user.name ?? order.user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(order.createdAt)} ({itemCount} items)
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} status={order.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}