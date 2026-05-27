"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu, X, ChevronDown, Send, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const navItems = [
  { label: "Acasă", href: "/" },
  {
    label: "Articole",
    href: "/articole",
    children: [
      { label: "Toate articolele", href: "/articole" },
      { label: "Cele mai citite", href: "/articole/populare" },
      { label: "Recente", href: "/articole/recente" },
    ],
  },
  {
    label: "Categorii",
    href: "/categorii",
    children: [
      { label: "AI & Tehnologie", href: "/categorii/ai-tehnologie" },
      { label: "Marketing Digital", href: "/categorii/marketing-digital" },
      { label: "Social Media", href: "/categorii/social-media" },
      { label: "E-commerce", href: "/categorii/e-commerce" },
      { label: "Dezvoltare Personală", href: "/categorii/dezvoltare-personala" },
    ],
  },
  {
    label: "Resurse",
    href: "/resurse",
    children: [
      { label: "Ghiduri", href: "/resurse/ghiduri" },
      { label: "Studii de caz", href: "/resurse/studii-de-caz" },
      { label: "Tools & Softwares", href: "/resurse/tools" },
    ],
  },
  { label: "Despre", href: "/despre" },
  { label: "Contact", href: "/contact" },
];

function SubscribeModal() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-md p-0 overflow-hidden">
      {submitted ? (
        <div className="flex flex-col items-center text-center px-8 py-12">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-heading text-2xl mb-2">Te-ai abonat!</h2>
          <p className="text-sm text-muted-foreground">
            Verifică-ți inboxul pentru a confirma abonarea. Bine ai venit în comunitate!
          </p>
        </div>
      ) : (
        <>
          {/* Header banner */}
          <div className="bg-foreground text-background px-8 pt-8 pb-6">
            <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-background" />
            </div>
            <DialogTitle className="text-background text-xl font-heading mb-1">
              Abonează-te la newsletter
            </DialogTitle>
            <DialogDescription className="text-background/60 text-sm">
              Primești săptămânal cele mai bune articole despre tehnologie, marketing și inovație digitală — direct în inbox.
            </DialogDescription>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Numele tău
              </label>
              <Input
                placeholder="Ion Popescu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Adresa de email *
              </label>
              <Input
                type="email"
                placeholder="ion@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Nu trimitem spam. Te poți dezabona oricând cu un singur click.
            </p>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 h-10"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Abonează-mă acum
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </DialogContent>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center h-20 overflow-hidden">
            <Image
              src="/logo-text.png"
              alt="TrenduriDigitale"
              width={500}
              height={125}
              style={{ filter: "invert(1)", height: "120px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent">
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors">
              <Search className="w-4 h-4 text-foreground/70" />
            </button>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="hidden md:flex bg-foreground text-background hover:bg-foreground/90 text-sm gap-1.5 h-9 px-4" />
                }
              >
                <Mail className="w-3.5 h-3.5" /> Abonează-te
              </DialogTrigger>
              <SubscribeModal />
            </Dialog>
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button className="w-full bg-foreground text-background gap-1.5" />
                  }
                >
                  <Mail className="w-3.5 h-3.5" /> Abonează-te
                </DialogTrigger>
                <SubscribeModal />
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
