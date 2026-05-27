import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Target, Users, BookOpen } from "lucide-react";
import NewsletterSection from "@/components/newsletter-section";

export const metadata = {
  title: "Despre noi – DigitalTrendz",
  description: "DigitalTrendz – sursa ta de inspirație pentru tot ce e nou în tehnologie, marketing și inovație digitală.",
};

const team = [
  {
    name: "Mihai Dumitru",
    role: "Editor-in-chief",
    bio: "Specialist în AI și tehnologie cu 8 ani de experiență. Anterior la Google și câteva startup-uri din Silicon Valley.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Andrei Popescu",
    role: "Director Marketing",
    bio: "Expert în marketing digital și growth hacking. A gestionat campanii cu bugete de peste 2M EUR.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Ioana Marinescu",
    role: "Redactor Tehnologie",
    bio: "Jurnalistă de tehnologie cu focus pe gadgeturi și consumer tech. Contribuie la publicații internaționale.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Alexandra Ivanov",
    role: "Redactor Business",
    bio: "Consultant de business și antreprenoare. Scrie despre automatizare, startup-uri și finanțarea afacerilor.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Vlad Negrescu",
    role: "Redactor Tech",
    bio: "Developer full-stack care scrie accesibil despre tendințele din lumea web-ului și a aplicațiilor mobile.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "Raluca Enache",
    role: "Redactor SEO & Marketing",
    bio: "Specialistă SEO cu focus pe conținut organic. Ajută brandurile să crească vizibilitatea online.",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
];

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

export default function DesprePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-muted/30 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">DigitalTrendz</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl mb-5 leading-tight">
            Sursa ta de inspirație din lumea digitală
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            DigitalTrendz este publicația online dedicată profesioniștilor și entuziaștilor din digital — tech, marketing, social media, e-commerce și inovație. Publicăm articole de fond, ghiduri practice și studii de caz care chiar ajută.
          </p>
        </div>
      </section>

      {/* Mission + Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading text-3xl mb-4">De ce DigitalTrendz?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Trăim în era informației, dar nu toată informația este egală. Internetul este plin de conținut superficial, articole reciclate și sfaturi fără substanță. Noi am creat DigitalTrendz pentru că credem că poți face lucruri mai bune cu timpul tău.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Echipa noastră de redactori specializați scrie din experiență reală — nu din teorie. Colaborăm cu practicieni, antreprenori și specialiști care au obținut rezultate concrete în industriile despre care scriu.
            </p>
            <Link
              href="/articole"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              Explorează articolele noastre <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: "50K+", label: "Cititori lunari" },
              { number: "120+", label: "Articole publicate" },
              { number: "12", label: "Autori activi" },
              { number: "7", label: "Categorii acoperite" },
            ].map((stat) => (
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

      {/* Team */}
      <section className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-heading text-3xl mb-2">Echipa redacțională</h2>
          <p className="text-muted-foreground mb-8">Oamenii din spatele conținutului.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member) => (
              <div key={member.name} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-blue-600 mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
