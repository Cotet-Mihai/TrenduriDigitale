"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Send,
  CheckCircle,
  Mail,
  ChevronDown,
  Home,
  BookOpen,
  LayoutGrid,
  Info,
  MessageSquare,
  Flame,
  Clock,
} from "lucide-react";
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
import { subscribeEmail } from "@/lib/actions";
import type { Category } from "@/lib/types";

function SubscribeModal() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await subscribeEmail(email);
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
  const [articoleOpen, setArticoleOpen] = useState(false);
  const [categoriiOpen, setCategoriiOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const articoleItems = [
    { label: "Toate articolele", href: "/articole", icon: BookOpen },
    { label: "Cele mai citite", href: "/articole/populare", icon: Flame },
    { label: "Recente", href: "/articole/recente", icon: Clock },
  ];

  const mobileDrawer = mounted
    ? createPortal(
        <>
          {/* Backdrop — covers everything below the header */}
          <div
            className={`fixed left-0 right-0 bottom-0 z-[199] bg-black/40 transition-opacity duration-300`}
            style={{
              top: "80px",
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? "auto" : "none",
            }}
            onClick={closeMobile}
          />

          {/* Clip container — fixed below header, hides panel when translated up */}
          <div
            className="fixed left-0 right-0 bottom-0 z-[200] overflow-hidden pointer-events-none"
            style={{ top: "80px" }}
          >
            {/* Sliding panel */}
            <div
              className="w-full pointer-events-auto overflow-y-auto transition-transform duration-300 ease-in-out"
              style={{
                backgroundColor: "white",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                maxHeight: "calc(100vh - 80px)",
                transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
              }}
            >
              <nav className="flex flex-col items-center px-6 pt-6 pb-4 gap-1">

                <Link
                  href="/"
                  onClick={closeMobile}
                  className="w-full text-center py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-gray-100"
                  style={{ color: "#111" }}
                >
                  Acasă
                </Link>

                {/* Articole */}
                <div className="w-full">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-gray-100"
                    style={{ color: "#111" }}
                    onClick={() => setArticoleOpen((v) => !v)}
                  >
                    Articole
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        color: "#9ca3af",
                        transform: articoleOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-200 ease-in-out"
                    style={{ maxHeight: articoleOpen ? "200px" : "0px" }}
                  >
                    <div className="flex flex-col items-center gap-0.5 py-1">
                      {articoleItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="w-full text-center py-2.5 rounded-lg text-sm transition-colors hover:bg-gray-100"
                          style={{ color: "#6b7280" }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Categorii */}
                <div className="w-full">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-gray-100"
                    style={{ color: "#111" }}
                    onClick={() => setCategoriiOpen((v) => !v)}
                  >
                    Categorii
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        color: "#9ca3af",
                        transform: categoriiOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-200 ease-in-out"
                    style={{ maxHeight: categoriiOpen ? "400px" : "0px" }}
                  >
                    <div className="flex flex-col items-center gap-0.5 py-1">
                      <Link
                        href="/categorii"
                        onClick={closeMobile}
                        className="w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                        style={{ color: "#6b7280" }}
                      >
                        Toate categoriile
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categorii/${cat.slug}`}
                          onClick={closeMobile}
                          className="w-full text-center py-2.5 rounded-lg text-sm transition-colors hover:bg-gray-100"
                          style={{ color: "#6b7280" }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full" style={{ margin: "8px 0", borderTop: "1px solid #f3f4f6" }} />

                <Link
                  href="/despre"
                  onClick={closeMobile}
                  className="w-full text-center py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-gray-100"
                  style={{ color: "#111" }}
                >
                  Despre
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="w-full text-center py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-gray-100"
                  style={{ color: "#111" }}
                >
                  Contact
                </Link>
              </nav>

              {/* Subscribe CTA */}
              <div className="px-6 pb-6 pt-2">
                <Dialog onOpenChange={(open) => { if (open) closeMobile(); }}>
                  <DialogTrigger
                    render={
                      <Button
                        className="w-full gap-2 h-12 text-sm font-medium rounded-xl"
                        style={{ backgroundColor: "#111", color: "#fff" }}
                      />
                    }
                  >
                    <Mail className="w-4 h-4" />
                    Abonează-te la newsletter
                  </DialogTrigger>
                  <SubscribeModal />
                </Dialog>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <>
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

            {/* Desktop nav — unchanged */}
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
                            <NavigationMenuLink
                              render={<Link href={`/categorii/${cat.slug}`} />}
                            >
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

              {/* Animated hamburger */}
              <button
                className="md:hidden relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
              >
                <Menu
                  className={`absolute w-5 h-5 transition-all duration-200 ${
                    mobileOpen
                      ? "rotate-90 opacity-0 scale-75"
                      : "rotate-0 opacity-100 scale-100"
                  }`}
                />
                <X
                  className={`absolute w-5 h-5 transition-all duration-200 ${
                    mobileOpen
                      ? "rotate-0 opacity-100 scale-100"
                      : "-rotate-90 opacity-0 scale-75"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileDrawer}
    </>
  );
}
