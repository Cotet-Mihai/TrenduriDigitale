import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Target, Users, BookOpen } from "lucide-react";

import NewsletterSection from "@/components/newsletter-section";
import { getSiteStats } from "@/lib/queries";

export const metadata = {
    title: "Despre noi",
    description: "Aflați povestea din spatele TrenduriDigitale — blogul românesc de tech cu sinceritate, fără clickbait și fără artificii.",
    alternates: { canonical: "https://trenduridigitale.ro/despre" },
};

const values = [
    {
        icon: <Target className="w-5 h-5" />,
        title: "Relevanță",
        description: "Publicăm doar conținut care aduce valoare reală — nu trafic gol, nu clickbait.",
    },
    {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Profunzime",
        description: "Fiecare articol este cercetat, verificat și scris pentru a oferi înțelegere, nu doar informații superficiale.",
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: "Comunitate",
        description: "Construim o comunitate de profesioniști și entuziaști digitali care cresc împreună.",
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: "Actualitate",
        description: "Suntem întotdeauna cu un pas înainte — tendințele de mâine, acoperite azi.",
    },
];

export default async function DesprePage() {
    const stats = await getSiteStats();

    const statCards = [
        { number: stats.totalViews.toLocaleString("ro-RO"), label: "Vizualizări totale" },
        { number: String(stats.totalPosts), label: "Articole publicate" },
        { number: String(stats.totalAuthors), label: stats.totalAuthors === 1 ? "Autor" : "Autori" },
        { number: String(stats.totalCategories), label: "Categorii acoperite" },
    ];

    return (
        <main className="flex-1">
            {/* Hero */}
            <section className="bg-muted/30 border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo.png"
                            alt="TrenduriDigitale"
                            width={80}
                            height={80}
                            className="dark:invert"
                            style={{ filter: "invert(1)" }}
                        />
                    </div>
                    <h1 className="font-heading text-4xl sm:text-5xl mb-5 leading-tight">
                        Despre Tehnologie, cu bune și cu rele.
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        Pe TrenduriDigitale vorbim despre smartphone-uri, tablete, gadgeturi, hardware, internet, Social Media și AI.
                    </p>
                </div>
            </section>

            {/* Mission + Numbers */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-heading text-3xl mb-4">De ce TrenduriDigitale?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Pe lângă noutățile din IT&amp;C, extrem de bine filtrate, partea editorială pe care o considerăm nucleul dur al publicației este compusă din articole de opinie. Ne place să punem lupa pe lucrurile care contează, să întrebăm „de ce", „cum" și „pentru cine", nu doar „cât costă" și „câte megapixeli are".
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Dacă și tu simți că lumea tech a fost deturnată de prea mult marketing, atunci ai ajuns în locul potrivit.
                        </p>
                        <Link
                            href="/articole"
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                        >
                            Explorează articolele noastre <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {statCards.map((stat) => (
                            <div key={stat.label} className="p-6 rounded-2xl border border-border bg-card text-center">
                                <p className="font-heading text-4xl mb-1">{stat.number}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="border-t border-border/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="font-heading text-3xl mb-8 text-center">Valorile noastre</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((val) => (
                            <div key={val.title} className="p-5 rounded-2xl border border-border bg-card">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                    {val.icon}
                                </div>
                                <h3 className="font-heading text-lg mb-1">{val.title}</h3>
                                <p className="text-sm text-muted-foreground">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <NewsletterSection />
        </main>
    );
}
