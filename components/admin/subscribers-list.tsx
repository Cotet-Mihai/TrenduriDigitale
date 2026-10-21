"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Users } from "lucide-react";
import type { Subscriber } from "@/lib/admin-queries";
import { deleteSubscriber } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";

export default function SubscribersList({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (subscribers.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <Users className="size-7 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Niciun abonat încă.</p>
      </div>
    );
  }

  return (
    <>
      {error && <p role="alert" className="mx-4 mt-3 text-sm text-destructive">{error}</p>}
      <ul className="divide-y divide-border/60 mt-2">
        {subscribers.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex-1 truncate text-sm">{s.email}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(s.subscribedAt).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Șterge ${s.email}`}
              title="Șterge abonatul"
              disabled={pending && busyId === s.id}
              onClick={() => {
                if (!window.confirm(`Ștergi ${s.email} din newsletter?`)) return;
                setBusyId(s.id);
                setError(null);
                startTransition(async () => {
                  const result = await deleteSubscriber(s.id);
                  if (result.error) setError(result.error);
                  setBusyId(null);
                  router.refresh();
                });
              }}
            >
              {pending && busyId === s.id ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
