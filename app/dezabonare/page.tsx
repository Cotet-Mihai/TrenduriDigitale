import UnsubscribeForm from "@/components/unsubscribe-form";

export const metadata = {
  title: "Dezabonare newsletter",
  robots: { index: false, follow: false },
};

// Linked from every newsletter email. Unsubscribing needs a click (not just opening the link),
// so email security scanners that prefetch links don't unsubscribe people by accident.
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        <h1 className="font-heading text-3xl mb-3">Dezabonare de la newsletter</h1>
        {token ? (
          <UnsubscribeForm token={token} />
        ) : (
          <p className="text-muted-foreground">
            Linkul nu e complet. Folosește linkul „Dezabonează-te” din emailul primit sau scrie-ne la
            redactia@trenduridigitale.ro.
          </p>
        )}
      </div>
    </main>
  );
}
