import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink } from "lucide-react";

export const metadata = { title: "Evenimente – DigitalTrendz" };

const evenimente = [
  {
    title: "GPeC Summit 2024",
    date: "15-16 Octombrie 2024",
    location: "București, Sala Palatului",
    type: "Conferință",
    description: "Cel mai mare eveniment de e-commerce din Europa Centrală și de Est. Speakeri internaționali, workshop-uri și networking cu liderii industriei.",
    attendees: "3.000+",
    tags: ["E-commerce", "Retail", "Tehnologie"],
    upcoming: true,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=350&fit=crop",
  },
  {
    title: "How to Web Conference",
    date: "2-3 Octombrie 2024",
    location: "București, Romexpo",
    type: "Conferință",
    description: "Ecosistemul de startup-uri și tehnologie din Europa de Est se reunește pentru 2 zile de inspirație, networking și oportunități de investiție.",
    attendees: "2.500+",
    tags: ["Startup", "Tech", "VC"],
    upcoming: true,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=350&fit=crop",
  },
  {
    title: "Digital Marketing Forum",
    date: "22 Noiembrie 2024",
    location: "Cluj-Napoca, Grand Hotel Napoca",
    type: "Forum",
    description: "Forum dedicat profesioniștilor din marketing digital: SEO, PPC, social media, email marketing și content strategy.",
    attendees: "800+",
    tags: ["Marketing", "SEO", "Social Media"],
    upcoming: true,
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=350&fit=crop",
  },
  {
    title: "WebStock 2024",
    date: "28-29 Martie 2024",
    location: "București, Universitate",
    type: "Conferință",
    description: "Conferința dedicată celor care construiesc web-ul: developeri, designeri și product manageri.",
    attendees: "1.200+",
    tags: ["Web", "Design", "Development"],
    upcoming: false,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=350&fit=crop",
  },
];

export default function EvenimentePage() {
  const upcoming = evenimente.filter((e) => e.upcoming);
  const past = evenimente.filter((e) => !e.upcoming);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/resurse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Resurse
        </Link>
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Evenimente</h1>
          <p className="text-muted-foreground">Conferințe, webinarii și meetup-uri din industria digitală din România și Europa.</p>
        </div>

        <div className="mb-10">
          <h2 className="font-heading text-2xl mb-5">Viitoare</h2>
          <div className="space-y-5">
            {upcoming.map((ev) => (
              <div key={ev.title} className="group rounded-2xl border border-blue-100 bg-blue-50/30 overflow-hidden hover:shadow-md transition-all cursor-pointer">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-56 h-40 md:h-auto shrink-0 overflow-hidden">
                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                        {ev.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="font-heading text-xl mb-2 group-hover:text-blue-600 transition-colors">{ev.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{ev.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{ev.attendees} participanți</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ev.tags.map((t) => (
                        <span key={t} className="text-xs bg-white border border-border px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {past.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl mb-5 text-muted-foreground">Evenimente trecute</h2>
            <div className="space-y-4">
              {past.map((ev) => (
                <div key={ev.title} className="group flex gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-all cursor-pointer opacity-70 hover:opacity-100">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{ev.title}</h3>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
