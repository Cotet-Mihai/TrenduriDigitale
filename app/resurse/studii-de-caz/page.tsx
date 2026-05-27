import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, ShoppingBag } from "lucide-react";

export const metadata = { title: "Studii de caz – DigitalTrendz" };

const studii = [
  {
    company: "Startup SaaS",
    tag: "SEO + Content",
    title: "De la 500 la 15.000 vizitatori organici în 8 luni",
    description: "Cum o strategie de content marketing bazată pe cuvinte cheie long-tail a transformat trafficul organic al unui startup B2B din România.",
    metric: "+2.900%",
    metricLabel: "trafic organic",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-green-50 text-green-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=350&fit=crop",
  },
  {
    company: "Brand Fashion",
    tag: "Social Media",
    title: "0 la 50.000 urmăritori pe Instagram în 6 luni fără ads",
    description: "Strategia de Reels și colaborări cu micro-influenceri care a explodat audiența unui brand de fashion românesc.",
    metric: "50K",
    metricLabel: "urmăritori câștigați",
    icon: <Users className="w-5 h-5" />,
    color: "bg-pink-50 text-pink-600",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=350&fit=crop",
  },
  {
    company: "E-shop",
    tag: "Email Marketing",
    title: "45% open rate și 12% CTR — campania de email care a bătut toate recordurile",
    description: "Segmentare avansată și personalizare dinamică au transformat o bază de date amorțită într-un motor de vânzări.",
    metric: "45%",
    metricLabel: "open rate",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=350&fit=crop",
  },
  {
    company: "Agenție imobiliară",
    tag: "Google Ads",
    title: "Cost per lead redus cu 68% prin optimizarea campaniilor Google Ads",
    description: "Restructurarea completă a campaniilor PPC și implementarea Smart Bidding au dus la rezultate spectaculoase.",
    metric: "-68%",
    metricLabel: "cost per lead",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=350&fit=crop",
  },
];

export default function StudiiDeCazPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/resurse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Resurse
        </Link>
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Studii de caz</h1>
          <p className="text-muted-foreground">Analize detaliate ale campaniilor și strategiilor care au generat rezultate reale, măsurabile.</p>
        </div>

        <div className="space-y-8">
          {studii.map((studiu) => (
            <div key={studiu.title} className="group rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card overflow-hidden cursor-pointer">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-64 h-48 md:h-auto shrink-0 overflow-hidden">
                  <img src={studiu.image} alt={studiu.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${studiu.color}`}>
                      {studiu.icon} {studiu.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{studiu.company}</span>
                  </div>
                  <h2 className="font-heading text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {studiu.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{studiu.description}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-extrabold text-foreground">{studiu.metric}</span>
                    <span className="text-sm text-muted-foreground ml-1">{studiu.metricLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
