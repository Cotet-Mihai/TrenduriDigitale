export const metadata = { title: "Politica de confidențialitate – TrenduriDigitale" };

export default function PoliticaConfidentialitatePage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-4xl mb-2">Politica de confidențialitate</h1>
        <p className="text-muted-foreground mb-10">Ultima actualizare: 9 Iunie 2025</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">1. Introducere</h2>
            <p>TrenduriDigitale ("noi", "ne") operează site-ul trenduridigitale.ro. Această politică explică cum colectăm, utilizăm și protejăm datele tale personale când vizitezi site-ul nostru.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">2. Ce date colectăm</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Adresa de email (când te abonezi la newsletter)</li>
              <li>Date de navigare anonime (prin Google Analytics)</li>
              <li>Informații din formularul de contact (nume, email, mesaj)</li>
              <li>Cookie-uri funcționale și de performanță</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">3. Newsletter — stocarea adresei de email</h2>
            <p className="text-muted-foreground mb-3">
              Când te abonezi la newsletterul TrenduriDigitale (prin formularul de pe site sau din meniu), adresa ta de email este salvată în baza noastră de date securizată, găzduită pe servere în Uniunea Europeană.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Datele salvate: adresa de email și data abonării.</li>
              <li>Scopul colectării: trimiterea de articole și resurse prin newsletter, exclusiv cu consimțământul tău explicit.</li>
              <li>Temeiul legal: consimțământ (Art. 6 alin. 1 lit. a GDPR).</li>
              <li>Perioada de stocare: până la dezabonare sau la cererea de ștergere.</li>
              <li>Nu transmitem adresa ta de email către terțe părți și nu o folosim în alte scopuri.</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Te poți dezabona oricând trimițând un email la <a href="mailto:redactia@trenduridigitale.ro" className="text-blue-600 hover:underline">redactia@trenduridigitale.ro</a> cu subiectul „Dezabonare newsletter". Datele tale vor fi șterse în cel mult 5 zile lucrătoare.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">4. Cum folosim datele</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Trimiterea newsletterului (cu consimțământul tău explicit)</li>
              <li>Îmbunătățirea experienței pe site pe baza datelor anonime de trafic</li>
              <li>Răspuns la mesajele primite prin formularul de contact</li>
              <li>Nu vindem niciodată datele tale unor terțe părți</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">5. Cookie-uri</h2>
            <p className="text-muted-foreground">Utilizăm cookie-uri esențiale (necesare funcționării site-ului) și cookie-uri de analiză (Google Analytics, anonimizat). Poți dezactiva cookie-urile de analiză din setările browserului.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">6. Drepturile tale (GDPR)</h2>
            <p className="text-muted-foreground mb-2">Conform GDPR, ai dreptul la:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Acces la datele tale personale</li>
              <li>Rectificarea datelor incorecte</li>
              <li>Ștergerea datelor ("dreptul de a fi uitat")</li>
              <li>Portabilitatea datelor</li>
              <li>Retragerea consimțământului în orice moment</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-foreground mb-3">7. Contact</h2>
            <p className="text-muted-foreground">Pentru orice solicitare legată de datele personale, ne poți contacta la: <a href="mailto:redactia@trenduridigitale.ro" className="text-blue-600 hover:underline">redactia@trenduridigitale.ro</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
