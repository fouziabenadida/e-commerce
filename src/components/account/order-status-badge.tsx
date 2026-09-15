import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  PAID: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  SHIPPED: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/30",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? statusStyles.PENDING;
  return (
    <Badge variant="outline" className={style}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}