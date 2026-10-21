import { getContactMessages } from "@/lib/admin-queries";
import MessagesList from "@/components/admin/messages-list";

export const metadata = { title: "Mesaje" };

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl">Mesaje</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {messages.length} {messages.length === 1 ? "mesaj" : "mesaje"} din formularul de contact · {unread} necitite ·
          se șterg automat după 12 luni
        </p>
      </div>
      <MessagesList messages={messages} />
    </main>
  );
}
