"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unsubscribeNewsletter } from "@/lib/actions";

export default function UnsubscribeForm({ token }: { token: string }) {
  const [result, setResult] = useState<"done" | "not_found" | null>(null);
  const [pending, startTransition] = useTransition();

  if (result === "done") {
    return (
      <div className="space-y-3">
        <CheckCircle className="size-10 text-green-600 mx-auto" />
        <p className="text-muted-foreground">
          Te-ai dezabonat. Adresa ta a fost ștearsă din lista newsletterului și nu vei mai primi emailuri.
        </p>
        <Link href="/" className="text-sm text-blue-600 hover:underline">Înapoi la articole</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {result === "not_found" ? (
        <p className="text-muted-foreground">
          Adresa nu mai e în listă — probabil te-ai dezabonat deja. Dacă primești în continuare emailuri, scrie-ne
          la redactia@trenduridigitale.ro.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Confirmă și îți ștergem adresa din lista newsletterului. Nu mai primești niciun email de la noi.
        </p>
      )}
      {result !== "not_found" && (
        <Button
          size="lg"
          className="px-6"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const { ok } = await unsubscribeNewsletter(token);
              setResult(ok ? "done" : "not_found");
            })
          }
        >
          {pending && <Loader2 className="animate-spin" />}
          Confirm dezabonarea
        </Button>
      )}
    </div>
  );
}
