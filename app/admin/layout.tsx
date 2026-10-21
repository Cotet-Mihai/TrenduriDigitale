import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s – Admin TrenduriDigitale" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col bg-muted/40">{children}</div>;
}
