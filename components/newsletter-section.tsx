"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-muted/50 border border-border rounded-2xl px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left */}
            <div className="flex items-start gap-5 flex-1">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">
                  Rămâi la curent cu trendurile digitale
                </h3>
                <p className="text-sm text-muted-foreground">
                  Abonează-te la newsletter și primește cele mai noi articole și resurse direct în inboxul tău.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:w-auto md:min-w-[420px]">
              {submitted ? (
                <div className="text-center py-3">
                  <p className="font-semibold text-green-600">
                    ✓ Te-ai abonat cu succes!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verifică-ți inboxul pentru confirmare.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Emailul tău"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-background"
                    required
                  />
                  <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 shrink-0 px-5">
                    Abonează-te
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
