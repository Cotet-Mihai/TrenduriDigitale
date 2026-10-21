"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Inbox, Loader2, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/lib/admin-queries";
import { deleteMessage, setMessageRead } from "@/lib/admin-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ro-RO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(id: string, action: () => Promise<{ error?: string }>) {
    setBusyId(id);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      setBusyId(null);
      router.refresh();
    });
  }

  function toggle(message: ContactMessage) {
    const opening = openId !== message.id;
    setOpenId(opening ? message.id : null);
    if (opening && !message.read) run(message.id, () => setMessageRead(message.id, true));
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card py-16 text-center text-muted-foreground shadow-sm">
        <Inbox className="size-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Niciun mesaj încă.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
      <ul className="rounded-2xl border border-border/60 bg-card shadow-sm divide-y divide-border/60 overflow-hidden">
        {messages.map((m) => {
          const open = openId === m.id;
          const busy = pending && busyId === m.id;
          const replyHref = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "mesajul tău de pe TrenduriDigitale"}`)}`;
          return (
            <li key={m.id} className={cn(!m.read && "bg-blue-50/40")}>
              <button
                type="button"
                onClick={() => toggle(m)}
                aria-expanded={open}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                {m.read ? (
                  <MailOpen className="size-4 mt-1 shrink-0 text-muted-foreground" />
                ) : (
                  <Mail className="size-4 mt-1 shrink-0 text-blue-600" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={cn("truncate", m.read ? "font-medium" : "font-semibold")}>{m.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {m.subject && <span className="text-foreground/80">{m.subject} · </span>}
                    {m.message}
                  </p>
                </div>
                <ChevronDown className={cn("size-4 mt-1 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
              </button>

              {open && (
                <div className="px-4 pb-4 pl-11 space-y-3">
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={replyHref} className={buttonVariants({ size: "sm" })}>
                      <Reply /> Răspunde pe email
                    </a>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => run(m.id, () => setMessageRead(m.id, !m.read))}>
                      {m.read ? "Marchează necitit" : "Marchează citit"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm("Ștergi definitiv acest mesaj?")) run(m.id, () => deleteMessage(m.id));
                      }}
                    >
                      {busy ? <Loader2 className="animate-spin" /> : <Trash2 />} Șterge
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
