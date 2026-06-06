"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu, X, Send, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { Category } from "@/lib/types";

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

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const articoleItems = [
    { label: "Toate articolele", href: "/articole" },
    { label: "Cele mai citite", href: "/articole/populare" },
    { label: "Recente", href: "/articole/recente" },
  ];


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

          {/* Desktop nav */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>

                <NavigationMenuItem>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    Acasă
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Articole</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-1">
                      {articoleItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink render={<Link href={item.href} />}>
                            {item.label}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categorii</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-52 p-1">
                      {categories.map((cat) => (
                        <li key={cat.slug}>
                          <NavigationMenuLink render={<Link href={`/categorii/${cat.slug}`} />}>
                            {cat.name}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/despre" className={navigationMenuTriggerStyle()}>
                    Despre
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" className={navigationMenuTriggerStyle()}>
                    Contact
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right actions */}
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
            {[
              { label: "Acasă", href: "/" },
              { label: "Articole", href: "/articole" },
              { label: "Categorii", href: "/categorii" },
              { label: "Despre", href: "/despre" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
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
