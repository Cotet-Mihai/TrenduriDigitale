import Link from "next/link";
import { ArrowRight, BookOpen, BarChart2, Wrench, Calendar, BookMarked } from "lucide-react";

export const metadata = {
  title: "Resurse – DigitalTrendz",
  description: "Ghiduri, studii de caz, tools și resurse pentru profesioniștii din digital.",
};

const resources = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Ghiduri",
    description: "Ghiduri pas-cu-pas pentru a stăpâni instrumentele și strategiile digitale esențiale.",
    href: "/resurse/ghiduri",
    color: "bg-blue-50 text-blue-600",
    count: "12 ghiduri",
    items: ["Ghid SEO complet pentru începători", "Marketing pe Social Media în 2024", "Cum să lansezi un newsletter de succes"],
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Studii de caz",
    description: "Analize detaliate ale campaniilor și strategiilor care au generat rezultate reale.",
    href: "/resurse/studii-de-caz",
    color: "bg-green-50 text-green-600",
    count: "8 studii",
    items: ["Cum a crescut X cu 300% în 6 luni", "Campanie email cu 45% open rate", "De la 0 la 10k urmăritori organic"],
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Tools & Softwares",
    description: "Cele mai utile unelte pentru marketing, design, productivitate și analitică.",
    href: "/resurse/tools",
    color: "bg-orange-50 text-orange-600",
    count: "30+ tools",
    items: ["Top 10 unelte SEO gratuite", "Stack-ul complet pentru content creators", "AI tools pentru marketing"],
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Evenimente",
    description: "Conferințe, webinarii și meetup-uri din industria digitală din România și Europa.",
    href: "/resurse/evenimente",
    color: "bg-purple-50 text-purple-600",
    count: "5 evenimente viitoare",
    items: ["GPeC Summit 2024", "How to Web Conference", "Digital Marketing Forum"],
  },
  {
    icon: <BookMarked className="w-6 h-6" />,
    title: "Cărți recomandate",
    description: "Selecția editorilor – cărțile care au schimbat perspectivele din industria digitală.",
    href: "/resurse/carti",
    color: "bg-pink-50 text-pink-600",
    count: "20 titluri",
    items: ["Influence – Robert Cialdini", "Zero to One – Peter Thiel", "The Lean Startup – Eric Ries"],
  },
];

export default function ResurcePage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="font-heading text-4xl mb-3">Resurse</h1>
          <p className="text-muted-foreground max-w-2xl">
            Tot ce ai nevoie pentru a crește în lumea digitală — ghiduri practice, studii de caz reale, unelte și recomandări curate de echipa noastră.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <Link
              key={res.href}
              href={res.href}
              className="group block p-6 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${res.color}`}>
                  {res.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {res.count}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{res.description}</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {res.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                Explorează <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
