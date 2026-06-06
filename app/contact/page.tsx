import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/contact-form";

export const metadata = {
  title: "Contact – TrenduriDigitale",
  description: "Contactează echipa TrenduriDigitale pentru colaborări, întrebări sau propuneri editoriale.",
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Contact</h1>
          <p className="text-muted-foreground">
            Ai o întrebare, o propunere de colaborare sau vrei să ne trimiți un articol? Scrie-ne.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left – info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Email</p>
                  <p className="text-sm text-muted-foreground">redactia@trenduridigitale.ro</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Timp de răspuns</p>
                  <p className="text-sm text-muted-foreground">Răspundem în 24–48 de ore lucrătoare.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Locație</p>
                  <p className="text-sm text-muted-foreground">București, România</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Echipă remote, disponibil online</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-muted/40 border border-border">
              <p className="font-semibold text-sm mb-2">Propune un articol</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ești expert în domeniu și vrei să contribui? Selectează subiectul "Colaborare editorială" și descrie-ne propunerea ta de articol.
              </p>
            </div>
          </div>

          {/* Right – form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
