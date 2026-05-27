"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
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
          onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
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
          <label className="text-sm font-medium mb-1.5 block">Numele tău *</label>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Ion Popescu" required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email *</label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ion@exemplu.ro" required />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Subiect *</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Selectează un subiect</option>
          <option value="intrebare">Întrebare generală</option>
          <option value="colaborare">Colaborare editorială</option>
          <option value="publicitate">Publicitate & parteneriate</option>
          <option value="eroare">Raportare eroare</option>
          <option value="altele">Altele</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Mesaj *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Scrie mesajul tău aici..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>

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
