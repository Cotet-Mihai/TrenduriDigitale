import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-server";
import LoginForm from "@/components/admin/login-form";

export const metadata = { title: "Autentificare" };

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center h-14 overflow-hidden mb-6">
          <Image
            src="/logo-text.png"
            alt="TrenduriDigitale"
            width={500}
            height={250}
            style={{ filter: "invert(1)", height: "96px", width: "auto" }}
            priority
          />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h1 className="font-heading text-2xl mb-1">Panou de administrare</h1>
          <p className="text-sm text-muted-foreground mb-6">Autentifică-te ca să scrii și să editezi articole.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
