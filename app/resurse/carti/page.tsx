import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

export const metadata = { title: "Cărți recomandate – DigitalTrendz" };

const carti = [
  {
    title: "Influence: The Psychology of Persuasion",
    author: "Robert Cialdini",
    category: "Marketing & Psihologie",
    description: "Cartea de referință pentru oricine lucrează în vânzări sau marketing. Cele 6 principii ale persuasiunii rămân relevante și în era digitală.",
    rating: 5,
    year: "1984 (actualizată 2021)",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Startup & Business",
    description: "Filosofia contrariană a co-fondatorului PayPal despre cum să construiești companii care creează ceva nou, nu să copiezi.",
    rating: 5,
    year: "2014",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=120&h=160&fit=crop",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Startup & Metodologie",
    description: "Metodologia care a schimbat modul în care se construiesc produse: Build-Measure-Learn și importanța validării rapide.",
    rating: 5,
    year: "2011",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=120&h=160&fit=crop",
  },
  {
    title: "Contagious: Why Things Catch On",
    author: "Jonah Berger",
    category: "Marketing & Viral",
    description: "De ce unele idei, produse și comportamente devin virale? Berger identifică 6 principii STEPPS care explică contagiozitatea.",
    rating: 4,
    year: "2013",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=160&fit=crop",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivitate",
    description: "Abilitatea de a te concentra profund — fără distrageri — este cea mai valoroasă competență în economia cunoașterii.",
    rating: 5,
    year: "2016",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120&h=160&fit=crop",
  },
  {
    title: "Hooked: How to Build Habit-Forming Products",
    author: "Nir Eyal",
    category: "Product & UX",
    description: "Modelul Hook explică psihologia din spatele produselor adictive și cum să construiești loialitate autentică.",
    rating: 4,
    year: "2014",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=160&fit=crop",
  },
  {
    title: "This Is Marketing",
    author: "Seth Godin",
    category: "Marketing",
    description: "Marketingul nu mai înseamnă să faci zgomot — înseamnă să servești o audiență specifică cu ceva ce contează cu adevărat.",
    rating: 4,
    year: "2018",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=160&fit=crop",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Dezvoltare Personală",
    description: "Sistemul practic pentru a construi obiceiuri bune și a scăpa de cele proaste. Aplicabil pentru orice antreprenor sau profesionist.",
    rating: 5,
    year: "2018",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=120&h=160&fit=crop",
  },
];

export default function CartiPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/resurse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Resurse
        </Link>
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Cărți recomandate</h1>
          <p className="text-muted-foreground">Selecția editorilor — cărțile care au schimbat perspectivele din industria digitală.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {carti.map((carte) => (
            <div key={carte.title} className="group flex gap-4 p-5 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card cursor-pointer">
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img src={carte.image} alt={carte.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{carte.category}</span>
                <h3 className="font-heading text-base leading-snug mt-0.5 mb-0.5 group-hover:text-blue-600 transition-colors">
                  {carte.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{carte.author} · {carte.year}</p>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < carte.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{carte.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
