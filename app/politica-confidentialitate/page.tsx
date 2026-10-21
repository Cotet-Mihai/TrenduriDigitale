import Link from "next/link";

export const metadata = {
  title: "Politica de confidențialitate",
  description: "Ce date personale colectează trenduridigitale.ro, de ce, cât timp le păstrăm și ce drepturi ai.",
  alternates: { canonical: "https://trenduridigitale.ro/politica-confidentialitate" },
};

const CONTACT_EMAIL = "redactia@trenduridigitale.ro";

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
      {CONTACT_EMAIL}
    </a>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-heading text-xl text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-2 rounded-xl border border-border/60 bg-card p-4">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="font-medium text-foreground">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function PoliticaConfidentialitatePage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-4xl mb-2">Politica de confidențialitate</h1>
        <p className="text-muted-foreground mb-10">Ultima actualizare: 21 octombrie 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          <Section title="1. Cine răspunde de datele tale">
            <p>
              Site-ul trenduridigitale.ro este un blog personal. Operatorul datelor tale personale este{" "}
              <strong className="text-foreground">Radu Eftimie</strong>, persoană fizică, autorul blogului. Pentru orice
              întrebare sau cerere legată de datele tale scrie la <Mail />.
            </p>
            <p>
              Pe scurt: colectăm cât mai puțin, nu vindem și nu dăm datele nimănui, nu facem reclame și nu folosim
              cookie-uri pe site-ul public.
            </p>
          </Section>

          <Section id="newsletter" title="2. Newsletter">
            <Facts
              rows={[
                ["Ce date", "Adresa de email și data abonării."],
                ["De ce", "Ca să-ți trimitem articolele noi pe email."],
                ["Temei legal", "Consimțământul tău (art. 6 alin. 1 lit. a GDPR), dat când apeși „Abonează-te”."],
                ["Cât timp", "Până te dezabonezi. După dezabonare, adresa se șterge în cel mult 5 zile lucrătoare."],
                [
                  "Dezabonare",
                  <>
                    Oricând, scriind la <Mail /> cu subiectul „Dezabonare newsletter”. Fiecare email trimis va avea și
                    instrucțiunile de dezabonare. Retragerea consimțământului nu afectează trimiterile făcute înainte.
                  </>,
                ],
              ]}
            />
          </Section>

          <Section id="contact" title="3. Formularul de contact">
            <Facts
              rows={[
                ["Ce date", "Numele, adresa de email, subiectul și mesajul pe care le scrii."],
                ["De ce", "Ca să-ți putem răspunde."],
                [
                  "Temei legal",
                  "Interesul legitim de a răspunde mesajelor primite (art. 6 alin. 1 lit. f GDPR). Te poți opune oricând.",
                ],
                ["Cât timp", "Cel mult 12 luni de la primire; apoi mesajele se șterg automat."],
              ]}
            />
            <p>Poți scrie și direct la <Mail />; în acest caz emailul se păstrează la fel, cel mult 12 luni.</p>
          </Section>

          <Section id="statistica" title="4. Statistica vizitelor (doar cu acordul tău)">
            <p>
              Dacă apeși „Accept” în fereastra de la prima vizită, folosim <strong className="text-foreground">Vercel
              Web Analytics</strong> ca să vedem ce articole sunt citite. Dacă apeși „Refuz”, nu se încarcă nimic.
            </p>
            <Facts
              rows={[
                [
                  "Ce date",
                  "Pentru fiecare pagină vizitată: momentul, adresa paginii, site-ul de pe care ai venit, țara/orașul (aproximativ), sistemul de operare, browserul și tipul dispozitivului.",
                ],
                [
                  "Cum",
                  "Fără cookie-uri. Vercel recunoaște o vizită printr-un cod calculat din cererea browserului, care se șterge după 24 de ore. Noi vedem doar totaluri, nu persoane.",
                ],
                ["Temei legal", "Consimțământul tău (art. 6 alin. 1 lit. a GDPR și art. 4 alin. 5 din Legea 506/2004)."],
                [
                  "Retragere",
                  "Oricând, din „Setări cookie”, în subsolul fiecărei pagini. Statistica se oprește imediat.",
                ],
              ]}
            />
          </Section>

          <Section id="cookie-uri" title="5. Ce salvăm în browserul tău">
            <p>
              Pe site-ul public nu folosim cookie-uri. Salvăm în browser (în <em>local storage</em>) un singur lucru:
              alegerea ta din fereastra de statistică („accept” sau „refuz”), ca să nu te mai întrebăm la fiecare pagină.
              Rămâne până o schimbi din „Setări cookie” sau până ștergi datele site-ului din browser. E strict necesar
              pentru a-ți respecta alegerea, deci nu cere acord.
            </p>
          </Section>

          <Section title="6. Cine mai are acces la date">
            <p>Datele sunt prelucrate, în numele nostru și doar pentru scopurile de mai sus, de doi furnizori:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong className="text-foreground">Vercel Inc.</strong> (SUA) — găzduirea site-ului și statistica vizitelor;
              </li>
              <li>
                <strong className="text-foreground">Supabase Inc.</strong> (SUA) — baza de date în care se păstrează
                adresele de la newsletter și mesajele de contact.
              </li>
            </ul>
            <p>
              Pentru că sunt firme din afara Spațiului Economic European, transferul se face pe baza garanțiilor din
              GDPR: Cadrul UE-SUA privind protecția datelor sau clauzele contractuale standard aprobate de Comisia
              Europeană (art. 45-46 GDPR). Nu vindem și nu dăm datele altcuiva.
            </p>
          </Section>

          <Section title="7. Drepturile tale">
            <p>Conform GDPR (art. 15-22), poți cere oricând:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>acces la datele tale și o copie a lor;</li>
              <li>corectarea datelor greșite;</li>
              <li>ștergerea datelor;</li>
              <li>restricționarea prelucrării;</li>
              <li>portabilitatea datelor (le primești într-un format ușor de folosit);</li>
              <li>opoziția la prelucrarea bazată pe interes legitim (formularul de contact);</li>
              <li>retragerea consimțământului (newsletter, statistică), fără să afecteze ce s-a făcut înainte.</li>
            </ul>
            <p>Scrie la <Mail />. Îți răspundem în cel mult o lună.</p>
            <p>
              Dacă ești nemulțumit, ai dreptul să depui o plângere la{" "}
              <strong className="text-foreground">
                Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
              </strong>
              ,{" "}
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                www.dataprotection.ro
              </a>
              .
            </p>
          </Section>

          <Section title="8. Alte informații">
            <ul className="list-disc list-inside space-y-1">
              <li>Nu luăm decizii automate și nu facem profiluri despre cititori.</li>
              <li>
                Datele sunt cerute doar dacă vrei să te abonezi sau să ne scrii. Fără adresa de email nu putem trimite
                newsletterul sau răspunde.
              </li>
              <li>
                Când politica se schimbă, actualizăm data de sus. Pentru schimbări importante îi anunțăm pe abonați
                prin email.
              </li>
            </ul>
            <p>
              Vezi și <Link href="/termeni" className="text-blue-600 hover:underline">Termenii și condițiile</Link>.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
