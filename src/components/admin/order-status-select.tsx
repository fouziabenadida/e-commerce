"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus, type OrderStatusValue } from "@/app/actions/admin";
import { toast } from "sonner";

const statuses: OrderStatusValue[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(value: OrderStatusValue) {
    startTransition(async () => {
      await updateOrderStatus(orderId, value);
      toast.success(`Order marked as ${value.toLowerCase()}`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      <Select value={status} onValueChange={handleChange} disabled={pending}>
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}