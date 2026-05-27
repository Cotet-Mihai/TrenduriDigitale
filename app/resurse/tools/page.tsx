import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata = { title: "Tools & Softwares – DigitalTrendz" };

const toolCategories = [
  {
    category: "SEO & Analytics",
    tools: [
      { name: "Google Search Console", description: "Monitorizare performanță SEO și indexare gratuită de la Google.", badge: "Gratuit" },
      { name: "Ahrefs", description: "Suită completă de SEO: keyword research, backlink analysis, site audit.", badge: "Plătit" },
      { name: "Semrush", description: "Platformă all-in-one pentru SEO, PPC și social media.", badge: "Freemium" },
      { name: "Google Analytics 4", description: "Analitică web avansată, tracking conversii și audiențe.", badge: "Gratuit" },
    ],
  },
  {
    category: "Content & Design",
    tools: [
      { name: "Canva", description: "Design grafic accesibil — social media, prezentări, materiale marketing.", badge: "Freemium" },
      { name: "Midjourney", description: "Generare imagini AI de înaltă calitate pentru orice proiect creativ.", badge: "Plătit" },
      { name: "Notion", description: "Knowledge management, docs și project management all-in-one.", badge: "Freemium" },
      { name: "Grammarly", description: "Verificare gramaticală și stilistică avansată pentru conținut în engleză.", badge: "Freemium" },
    ],
  },
  {
    category: "Email & Automatizare",
    tools: [
      { name: "Mailchimp", description: "Email marketing accesibil cu automatizări și landing pages.", badge: "Freemium" },
      { name: "ActiveCampaign", description: "CRM + email automation avansat pentru echipe de marketing.", badge: "Plătit" },
      { name: "Zapier", description: "Automatizarea fluxurilor de lucru între 5000+ aplicații fără cod.", badge: "Freemium" },
      { name: "Make (Integromat)", description: "Automatizare vizuală mai puternică decât Zapier, prețuri mai bune.", badge: "Freemium" },
    ],
  },
  {
    category: "Social Media",
    tools: [
      { name: "Buffer", description: "Programare postări și analytics pentru toate platformele sociale.", badge: "Freemium" },
      { name: "Hootsuite", description: "Management social media enterprise cu team collaboration.", badge: "Plătit" },
      { name: "Later", description: "Planificator vizual specializat pentru Instagram și TikTok.", badge: "Freemium" },
      { name: "Metricool", description: "Analytics și programare social media cu rapoarte detaliate.", badge: "Freemium" },
    ],
  },
];

const badgeColors: Record<string, string> = {
  "Gratuit": "bg-green-50 text-green-700",
  "Freemium": "bg-blue-50 text-blue-700",
  "Plătit": "bg-orange-50 text-orange-700",
};

export default function ToolsPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/resurse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Resurse
        </Link>
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Tools & Softwares</h1>
          <p className="text-muted-foreground">Cele mai utile unelte pentru marketing, design, productivitate și analitică — curate de echipa noastră.</p>
        </div>

        <div className="space-y-10">
          {toolCategories.map((section) => (
            <div key={section.category}>
              <h2 className="font-heading text-2xl mb-4">{section.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.tools.map((tool) => (
                  <div key={tool.name} className="group flex items-start gap-4 p-4 rounded-xl border border-border hover:border-foreground/20 hover:shadow-sm transition-all bg-card cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 font-bold text-sm">
                      {tool.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm group-hover:text-blue-600 transition-colors">{tool.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColors[tool.badge]}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 mt-0.5 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
