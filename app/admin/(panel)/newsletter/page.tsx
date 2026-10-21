import Link from "next/link";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { getNewsletterOverview } from "@/lib/admin-queries";
import { isNewsletterConfigured } from "@/lib/newsletter";
import SubscribersList from "@/components/admin/subscribers-list";

export const metadata = { title: "Newsletter" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminNewsletterPage() {
  const { subscribers, sent } = await getNewsletterOverview();
  const configured = isNewsletterConfigured();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Newsletter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subscribers.length} {subscribers.length === 1 ? "abonat" : "abonați"} · fiecare articol nou se trimite automat
          abonaților la prima publicare
        </p>
      </div>

      {configured ? (
        <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <p>Trimiterea e activă (Resend). Când publici un articol nou, abonații îl primesc pe email în câteva secunde.</p>
        </div>
      ) : (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="font-medium">Trimiterea nu e configurată încă — articolele publicate acum nu se trimit.</p>
            <p>
              Ca să o activezi: în Resend verifici domeniul <strong>trenduridigitale.ro</strong>, apoi în Vercel → Settings →
              Environment Variables adaugi <code className="font-mono">RESEND_API_KEY</code> și faci redeploy. Opțional,{" "}
              <code className="font-mono">NEWSLETTER_FROM</code> pentru alt expeditor. Articolele publicate înainte nu se
              trimit retroactiv.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <h2 className="text-sm font-semibold px-4 pt-4">Abonați</h2>
        <SubscribersList subscribers={subscribers} />
      </section>

      <section className="rounded-2xl border border-border/60 bg-card shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-3">Articole trimise</h2>
        {sent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Niciun articol trimis încă.</p>
        ) : (
          <ul className="space-y-2">
            {sent.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 text-sm">
                <Send className="size-4 shrink-0 text-muted-foreground" />
                <Link href={`/blog/${p.slug}`} target="_blank" className="flex-1 truncate hover:underline">
                  {p.title}
                </Link>
                <span className="text-xs text-muted-foreground shrink-0">{formatDate(p.sentAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
