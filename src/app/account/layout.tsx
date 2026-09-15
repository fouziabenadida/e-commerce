import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountSidebar } from "@/components/account/account-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
        <AccountSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}