"use client";

import { usePathname } from "next/navigation";

// Public-site chrome (navbar, footer, cookie banner) is hidden inside the admin panel,
// except on the article preview, which must look like the real page.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") && pathname !== "/admin/previzualizare") return null;
  return <>{children}</>;
}
