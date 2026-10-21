"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendContactMessage } from "@/lib/actions";

const SUBJECTS = [
  "Întrebare generală",
  "Colaborare editorială",
  "Publicitate & parteneriate",
  "Raportare eroare",
  "Altele",
];

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await sendContactMessage(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="font-heading text-2xl mb-2">Mesaj trimis!</h2>
        <p className="text-muted-foreground max-w-sm">
          Mulțumim pentru mesaj. Îți vom răspunde în cel mult 48 de ore lucrătoare.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData(EMPTY); }}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium mb-1.5 block">Numele tău *</label>
          <Input id="contact-name" name="name" value={formData.name} onChange={handleChange} placeholder="Ion Popescu" maxLength={120} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium mb-1.5 block">Email *</label>
          <Input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ion@exemplu.ro" maxLength={254} autoComplete="email" required />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium mb-1.5 block">Subiect *</label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Selectează un subiect</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium mb-1.5 block">Mesaj *</label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          maxLength={5000}
          rows={6}
          placeholder="Scrie mesajul tău aici..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        Folosim numele, emailul și mesajul doar ca să-ți răspundem. Le păstrăm cel mult 12 luni.{" "}
        <Link href="/politica-confidentialitate#contact" className="underline underline-offset-2 hover:text-foreground">
          Detalii în politica de confidențialitate
        </Link>
        .
      </p>

      <Button
        type="submit"
        disabled={loading}
        className="bg-foreground text-background hover:bg-foreground/90 gap-2 h-10 px-6"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
            Se trimite...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Trimite mesajul
          </>
        )}
      </Button>
    </form>
  );
}
