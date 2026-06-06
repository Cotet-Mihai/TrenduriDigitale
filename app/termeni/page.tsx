export const metadata = { title: "Termeni și condiții – TrenduriDigitale" };

export default function TermeniPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-4xl mb-2">Termeni și condiții</h1>
        <p className="text-muted-foreground mb-10">Ultima actualizare: 1 Mai 2024</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">1. Acceptarea termenilor</h2>
            <p className="text-muted-foreground">Prin accesarea și utilizarea site-ului digitaltrendz.ro, ești de acord cu acești Termeni și Condiții. Dacă nu ești de acord, te rugăm să nu utilizezi site-ul.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">2. Proprietate intelectuală</h2>
            <p className="text-muted-foreground">Tot conținutul publicat pe TrenduriDigitale (articole, imagini, grafice, logo-uri) este proprietatea TrenduriDigitale sau a autorilor respectivi și este protejat de legile drepturilor de autor. Reproducerea parțială sau totală fără acordul nostru scris este interzisă.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">3. Utilizarea conținutului</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Poți cita fragmente scurte cu atribuire clară și link către sursa originală</li>
              <li>Nu poți republica articole integrale fără permisiune scrisă</li>
              <li>Nu poți utiliza conținutul nostru în scop comercial fără acord</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">4. Disclaimer</h2>
            <p className="text-muted-foreground">Conținutul publicat pe TrenduriDigitale are scop informativ și educațional. Nu constituie consultanță financiară, juridică sau de altă natură. Deciziile luate pe baza informațiilor de pe site sunt responsabilitatea exclusivă a utilizatorului.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">5. Link-uri externe</h2>
            <p className="text-muted-foreground">Site-ul poate conține link-uri către resurse externe. Nu suntem responsabili pentru conținutul sau practicile site-urilor terțe la care facem referire.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">6. Modificări</h2>
            <p className="text-muted-foreground">Ne rezervăm dreptul de a modifica acești termeni în orice moment. Continuarea utilizării site-ului după publicarea modificărilor reprezintă acceptarea noilor termeni.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">7. Contact</h2>
            <p className="text-muted-foreground">Întrebări privind acești termeni: <a href="mailto:legal@digitaltrendz.ro" className="text-blue-600 hover:underline">legal@digitaltrendz.ro</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
