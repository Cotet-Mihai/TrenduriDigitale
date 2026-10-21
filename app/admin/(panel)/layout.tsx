import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { getAdminUser } from "@/lib/supabase-server";
import { getUnreadMessageCount } from "@/lib/admin-queries";
import { logout } from "@/lib/admin-actions";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const unread = await getUnreadMessageCount();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            {/* White logo with built-in padding: invert + crop like the site navbar. */}
            <span className="flex items-center h-12 overflow-hidden">
              <Image
                src="/logo-text.png"
                alt="TrenduriDigitale"
                width={500}
                height={250}
                style={{ filter: "invert(1)", height: "96px", width: "auto" }}
                priority
              />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-1 mr-auto ml-2 sm:ml-6">
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Articole
            </Link>
            <Link href="/admin/mesaje" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Mesaje
              {unread > 0 && (
                <span className="ml-0.5 min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold inline-flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden lg:block text-sm text-muted-foreground mr-2 truncate max-w-[220px]">
              {user.email}
            </span>
            <Link href="/" target="_blank" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <ExternalLink />
              <span className="hidden sm:inline">Vezi site-ul</span>
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut />
                <span className="hidden sm:inline">Ieșire</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </>
  );
}
