import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Admin
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Store Management
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <div className="rounded-xl border p-4 lg:sticky lg:top-24">
          <AdminNav />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}