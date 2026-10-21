import Link from "next/link";
import { cn } from "@/lib/utils";

// GDPR art. 13: tell people what happens to their email at the moment they give it.
export default function NewsletterConsentNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground leading-relaxed", className)}>
      Folosim adresa doar ca să-ți trimitem newsletterul. Te poți dezabona oricând, scriind la
      redactia@trenduridigitale.ro.{" "}
      <Link href="/politica-confidentialitate#newsletter" className="underline underline-offset-2 hover:text-foreground">
        Detalii
      </Link>
    </p>
  );
}

export function newsletterErrorMessage(error: string): string {
  return error === "already_subscribed"
    ? "Adresa e deja abonată."
    : error === "invalid_email"
      ? "Adresa de email nu pare corectă."
      : "Abonarea nu a reușit. Încearcă din nou.";
}
