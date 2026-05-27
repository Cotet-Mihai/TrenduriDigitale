import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export const metadata = { title: "Ghiduri – DigitalTrendz" };

const ghiduri = [
  {
    title: "Ghid SEO complet pentru începători",
    description: "Tot ce trebuie să știi pentru a-ți optimiza site-ul și a apărea în primele rezultate Google.",
    duration: "30 min citire",
    level: "Începător",
    topics: ["Cercetarea cuvintelor cheie", "On-page SEO", "Link building", "Tehnic SEO"],
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=250&fit=crop",
  },
  {
    title: "Marketing pe Social Media în 2024",
    description: "Strategii complete pentru Instagram, TikTok, LinkedIn și Facebook – platforma cu platforma.",
    duration: "45 min citire",
    level: "Intermediar",
    topics: ["Calendarul editorial", "Content strategy", "Paid ads", "Analytics"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
  },
  {
    title: "Cum să lansezi un newsletter de succes",
    description: "De la alegerea platformei la prima campanie — ghid pas cu pas pentru email marketing.",
    duration: "25 min citire",
    level: "Începător",
    topics: ["Alegerea platformei", "Construirea listei", "Designul emailului", "Automatizări"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  },
  {
    title: "Google Ads pentru afaceri locale",
    description: "Cum să rulezi campanii plătite eficiente cu bugete mici și rezultate maxime.",
    duration: "35 min citire",
    level: "Intermediar",
    topics: ["Structura campaniei", "Targeting", "Bidding strategies", "Conversii"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  },
  {
    title: "Ghid complet de content marketing",
    description: "Creează conținut care atrage, educă și convertește — framework-ul complet.",
    duration: "50 min citire",
    level: "Avansat",
    topics: ["Strategia de conținut", "Blog", "Video", "Podcast", "Distribution"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop",
  },
  {
    title: "Automatizarea marketingului cu AI",
    description: "Cum să folosești instrumentele AI pentru a scala eforturile de marketing fără costuri mari.",
    duration: "40 min citire",
    level: "Avansat",
    topics: ["ChatGPT pentru marketing", "Midjourney", "Automatizări", "ROI"],
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop",
  },
];

const levelColors: Record<string, string> = {
  "Începător": "bg-green-50 text-green-700",
  "Intermediar": "bg-yellow-50 text-yellow-700",
  "Avansat": "bg-red-50 text-red-700",
};

export default function GhiduriPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/resurse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Resurse
        </Link>
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Ghiduri</h1>
          <p className="text-muted-foreground">Ghiduri pas-cu-pas pentru a stăpâni instrumentele și strategiile digitale esențiale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ghiduri.map((ghid) => (
            <div key={ghid.title} className="group block rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card overflow-hidden cursor-pointer">
              <div className="relative h-40 overflow-hidden">
                <img src={ghid.image} alt={ghid.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${levelColors[ghid.level]}`}>
                    {ghid.level}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {ghid.duration}
                  </span>
                </div>
                <h2 className="font-heading text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {ghid.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ghid.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ghid.topics.map((t) => (
                    <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                  Citește ghidul <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
