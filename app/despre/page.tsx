import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import NewsletterSection from "@/components/newsletter-section";
import { getAuthors, getSiteStats } from "@/lib/queries";

const BASE_URL = "https://trenduridigitale.ro";

export const metadata = {
    title: "Despre",
    description: "Trenduri Digitale este proiectul independent al lui Radu Eftimie: opinii și analize oneste despre tehnologie, cu bune și cu rele.",
    alternates: { canonical: "https://trenduridigitale.ro/despre" },
};

export default async function DesprePage() {
    const [stats, authors] = await Promise.all([getSiteStats(), getAuthors()]);
    const author = authors[0];

    // Articles reference this Person by @id, so search engines and AI answer
    // engines can attribute every article to a real, described author.
    const personJsonLd = author && {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${BASE_URL}/despre#autor`,
        name: author.name,
        url: `${BASE_URL}/despre#autor`,
        ...(author.avatar && { image: author.avatar.startsWith("http") ? author.avatar : `${BASE_URL}${author.avatar}` }),
        ...(author.bio && { description: author.bio }),
        jobTitle: "Fondator și redactor",
        worksFor: { "@type": "Organization", name: "TrenduriDigitale", url: BASE_URL },
    };

    const statCards = [
        { number: stats.totalViews.toLocaleString("ro-RO"), label: "Vizualizări totale" },
        { number: String(stats.totalPosts), label: "Articole publicate" },
        { number: String(stats.totalAuthors), label: stats.totalAuthors === 1 ? "Autor" : "Autori" },
        { number: String(stats.totalCategories), label: "Categorii acoperite" },
    ];

    return (
        <main className="flex-1">
            {personJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
                />
            )}
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
                        Despre Tehnologie, cu bune și cu rele
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        Pe Trenduri Digitale vorbesc despre tehnologie, cu bune și cu rele.
                    </p>
                </div>
            </section>

            {/* Mission + Numbers */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-heading text-3xl mb-4">De ce Trenduri Digitale?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Te salut! Sunt Radu Eftimie, am peste 25 de ani experiență în presă, sunt specializat în Tehnologia Informației și Comunicații, iar Trenduri Digitale este proiectul meu independent. De ce Independent? Pentru că, într-o lume IT&amp;C sufocată de informație am ales să filtrez un pic lucrurile, ca să putem deosebi fondul de formă.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Pun accent pe articole de opinie și analize oneste, dar probabil subiective (!), pun lupa pe ceea ce contează cu adevărat: impactul tehnologiei, „de ce-ul” din spatele inovațiilor și utilitatea lor reală, comparată, întotdeauna, cu ce oferă piața de profil de azi.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Cum fac asta? Nu-mi câștig existența așa, deci cred că lucrurile ar trebui să fie clare, pot critica orice cred că merită efortul, pentru că o fac pe banii mei.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Dacă te-ai săturat de marketing agresiv și vrei opinii tehnice fondate și direct la subiect, uneori formulate dur, bine ai venit!
                        </p>
                        <Link
                            href="/articole"
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                        >
                            Explorează articolele <ArrowRight className="w-4 h-4" />
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

            {/* Author */}
            {author && (
                <section id="autor" className="border-t border-border/40 scroll-mt-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h2 className="font-heading text-3xl mb-8 text-center">Cine scrie</h2>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl border border-border bg-card">
                            {author.avatar && (
                                <Image
                                    src={author.avatar}
                                    alt={author.name}
                                    width={112}
                                    height={112}
                                    className="size-28 rounded-full object-cover shrink-0"
                                />
                            )}
                            <div className="text-center sm:text-left">
                                <p className="font-heading text-2xl">{author.name}</p>
                                <p className="text-sm text-blue-600 font-medium mb-3">Fondator și redactor</p>
                                {author.bio && <p className="text-muted-foreground leading-relaxed">{author.bio}</p>}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <NewsletterSection />
        </main>
    );
}
