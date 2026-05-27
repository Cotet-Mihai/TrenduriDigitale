export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  date: string;
  readTime: number;
  image: string;
  views?: number;
  featured?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { name: "AI & Tehnologie", slug: "ai-tehnologie", count: 24, icon: "cpu", description: "Ultimele noutăți despre inteligență artificială, machine learning și inovații tech." },
  { name: "Marketing Digital", slug: "marketing-digital", count: 18, icon: "trending-up", description: "Strategii, tactici și tendințe din lumea marketingului online." },
  { name: "Social Media", slug: "social-media", count: 15, icon: "share-2", description: "Cum să crești și să monetizezi audiența pe rețelele sociale." },
  { name: "E-commerce", slug: "e-commerce", count: 12, icon: "shopping-cart", description: "Ghiduri și strategii pentru afaceri online de succes." },
  { name: "Dezvoltare Personală", slug: "dezvoltare-personala", count: 10, icon: "user", description: "Productivitate, mindset și abilități pentru era digitală." },
  { name: "Business", slug: "business", count: 9, icon: "briefcase", description: "Antreprenoriat, startupuri și strategii de creștere." },
  { name: "Tehnologie", slug: "tehnologie", count: 14, icon: "monitor", description: "Gadgeturi, software și hardware de ultimă oră." },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "inteligenta-artificiala-2024",
    title: "Inteligența Artificială în 2024: Inovații care schimbă regulile jocului",
    excerpt: "Descoperă cum AI-ul transformă industrii, optimizează procese și creează noi oportunități de business.",
    content: `
## Introducere

Inteligența artificială nu mai este doar un concept din filmele SF. În 2024, AI-ul a devenit o realitate palpabilă care transformă fiecare sector al economiei globale.

## Cum transformă AI industriile

### Sănătate și medicină

Algoritmii de machine learning analizează milioane de imagini medicale cu o precizie ce depășește capacitățile umane. Diagnosticele precoce ale cancerului, predicția bolilor și personalizarea tratamentelor sunt acum posibile datorită AI.

### Educație

Platformele educaționale inteligente adaptează conținutul la nevoile individuale ale fiecărui student. Chatboții educaționali oferă asistență 24/7, iar sistemele de evaluare automată eliberează profesorii pentru activități mai creative.

### Retail și E-commerce

Recomandările personalizate, managementul inteligent al stocurilor și prețurile dinamice au revoluționat experiența de cumpărare. Companiile care adoptă AI raportează creșteri de 30-40% în conversii.

## Oportunități pentru business-uri

1. Automatizarea proceselor repetitive – Reducerea costurilor operaționale cu până la 60%
2. Analiza predictivă – Anticiparea comportamentului clienților și tendințelor pieței
3. Customer service automatizat – Chatboți care rezolvă 80% din interogările clienților fără intervenție umană
4. Personalizare la scară – Experiențe unice pentru fiecare client

## Provocări și considerente etice

Adoptarea AI vine și cu responsabilități. Transparența algoritmilor, protecția datelor personale și impactul asupra forței de muncă sunt aspecte care necesită atenție sporită din partea companiilor și reglementatorilor.

## Concluzie

2024 este anul în care AI devine accesibil pentru business-uri de toate dimensiunile. Companiile care ignoră această revoluție riscă să rămână în urmă față de competitori mai agili și mai inovativi.
    `,
    category: "AI & Tehnologie",
    author: { name: "Mihai Dumitru", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    date: "15 Mai 2024",
    readTime: 8,
    views: 12400,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: "2",
    slug: "marketingul-in-era-digitala",
    title: "Marketingul în era digitală: Strategii care chiar funcționează",
    excerpt: "De la conținut relevant la campanii personalizate, vezi ce funcționează în 2024.",
    content: `
## Marketingul digital în 2024

Peisajul marketingului digital se schimbă rapid. Ce funcționa acum 2 ani poate fi complet ineficient astăzi.

## Strategii dovedite

### Content Marketing de calitate

Conținutul de lungă formă (2000+ cuvinte) continuă să domine rezultatele SEO. Articolele detaliate, ghidurile comprehensive și studiile de caz generate din date reale atrag și rețin audiența.

### Email Marketing personalizat

Cu un ROI mediu de 42:1, email marketing-ul rămâne cel mai eficient canal digital. Segmentarea avansată și automatizarea permit trimiterea mesajului potrivit, persoanei potrivite, la momentul potrivit.

### Video Marketing

Conținutul video generează de 3x mai mult engagement decât conținutul static. Short-form video (Reels, TikTok, YouTube Shorts) a explodat în popularitate și oferă reach organic excelent.

## Tactici specifice pentru 2024

- SEO semantic – Optimizare pentru intenția de căutare, nu doar cuvinte cheie
- Social proof – Recenzii autentice și user-generated content
- Micro-influenceri – Audiențe mici dar extrem de engaged
- Retargeting inteligent – Reclame personalizate bazate pe comportamentul utilizatorilor
    `,
    category: "Marketing Digital",
    author: { name: "Andrei Popescu", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
    date: "12 Mai 2024",
    readTime: 6,
    views: 8900,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    slug: "gadgeturi-smart-2024",
    title: "Gadgeturi smart care îți fac viața mai simplă în 2024",
    excerpt: "Dispozitive inovatoare care combină tehnologia cu funcționalitatea de zi cu zi.",
    content: `
## Top gadgeturi smart în 2024

Tehnologia wearable și smart home a atins un nivel de maturitate impresionant. Iată ce merită atenția ta.

## Ceasuri smart și fitness trackers

Generația nouă de smartwatch-uri oferă ECG, monitorizare a nivelului de oxigen din sânge și chiar detectarea căderilor. Apple Watch Series 10 și Galaxy Watch 7 conduc piața.

## Smart home devices

- Termostate inteligente – Economisesc până la 23% din factura la energie
- Becuri smart – Control vocal, programe automate, scene de lumină
- Camere de securitate AI – Recunosc fețe și trimit alerte personalizate

## Headphones și audio

Noise-cancelling-ul adaptiv a revoluționat experiența audio. Sony WH-1000XM5 și AirPods Pro 2 rămân standardele industriei.
    `,
    category: "Tehnologie",
    author: { name: "Ioana Marinescu", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    date: "9 Mai 2024",
    readTime: 5,
    views: 7200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    slug: "crestere-organica-instagram",
    title: "Cum să crești organic pe Instagram în 2024",
    excerpt: "Strategii testate pentru a construi o comunitate reală și implicată.",
    content: `
## Creștere organică pe Instagram în 2024

Algoritmul Instagram s-a schimbat dramatic în 2024, favorizând conținutul autentic și interacțiunile reale.

## Ce funcționează acum

### Reels-uri consistente

Instagram prioritizează Reels în feed și Explore. Postează cel puțin 3-4 Reels pe săptămână pentru reach maxim.

### Engagement autentic

Răspunde la TOATE comentariile în primele 2 ore după postare. Algoritmul consideră viteza de engagement drept semnal de calitate.

### Carousels educaționale

Postările cu mai multe imagini (carousels) au cel mai mare timp de vizionare, ceea ce îmbunătățește reach-ul organic.
    `,
    category: "Social Media",
    author: { name: "Mihai Dumitru", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    date: "7 Mai 2024",
    readTime: 7,
    views: 9800,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    slug: "automatizarea-proceselor-afaceri",
    title: "Automatizarea proceselor: Cheia eficienței în afaceri",
    excerpt: "Află cum automatizarea poate reduce costurile și crește productivitatea.",
    content: `
## Automatizarea în business

Companiile care automatizează procesele repetitive raportează economii medii de 40% din costurile operaționale.

## Procese ideale pentru automatizare

- Facturare și contabilitate
- Email marketing și follow-up
- Raportare și analytics
- Customer support (nivel 1)
- Social media posting

## Tools recomandate

Zapier și Make – Automatizarea fluxurilor de lucru între aplicații fără cod.
HubSpot – CRM cu automatizare marketing avansată.
Monday.com – Project management automatizat.
    `,
    category: "Business",
    author: { name: "Alexandra Ivanov", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
    date: "6 Mai 2024",
    readTime: 6,
    views: 5600,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    slug: "realitatea-augmentata-educatie",
    title: "Realitatea augmentată: De la entertainment la educație",
    excerpt: "Exemple practice de utilizare a AR în diverse domenii și beneficii reale.",
    content: `
## AR în viața reală

Realitatea augmentată a depășit faza de gimmick și devine o tehnologie cu aplicații practice serioase.

## Educație și training

IKEA folosește AR pentru a permite clienților să vizualizeze mobila în propriul spațiu. Google Maps AR navigation ghidează pietonii cu indicații suprapuse peste realitate.

## Medical și sănătate

Chirurgii folosesc AR pentru a vedea imagini 3D ale organelor în timpul operațiilor. Studenții la medicină practică proceduri în medii AR înainte de a lucra cu pacienți reali.
    `,
    category: "Tehnologie",
    author: { name: "Vlad Negrescu", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    date: "5 Mai 2024",
    readTime: 5,
    views: 4300,
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    slug: "seo-2024-schimbari",
    title: "SEO în 2024: Ce s-a schimbat și cum te adaptezi",
    excerpt: "Tendințele SEO care contează și pașii pe care trebuie să îi urmezi.",
    content: `
## SEO în era AI

Google's Search Generative Experience (SGE) a schimbat fundamental modul în care utilizatorii interacționează cu rezultatele căutărilor.

## Ce s-a schimbat

### AI Overviews

Google afișează acum răspunsuri generate de AI în fruntea rezultatelor. Acest lucru reduce click-urile organice cu 20-30% pentru interogări informaționale simple.

### E-E-A-T mai important ca niciodată

Expertise, Experience, Authoritativeness, Trustworthiness – Google evaluează tot mai riguros aceste criterii.

## Cum te adaptezi

1. Optimizează pentru featured snippets și "People Also Ask"
2. Construiește autoritate tematică prin conținut comprehensiv
3. Investește în linkbuilding de calitate
4. Prioritizează viteza și experiența utilizatorului
    `,
    category: "Marketing Digital",
    author: { name: "Raluca Enache", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    date: "4 Mai 2024",
    readTime: 8,
    views: 11200,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
  },
  {
    id: "8",
    slug: "chatgpt-pentru-business",
    title: "ChatGPT pentru business: 10 utilizări care îți economisesc ore întregi",
    excerpt: "Descoperă cum să integrezi AI în fluxul de lucru zilnic pentru rezultate remarcabile.",
    content: `
## ChatGPT în mediul de afaceri

Nu mai este un secret: companiile care folosesc ChatGPT strategic economisesc în medie 3-4 ore pe zi per angajat.

## 10 utilizări practice

1. Redactarea și editarea conținutului de marketing
2. Generarea de idei pentru campanii
3. Răspunsuri la emailuri complexe
4. Rezumarea documentelor lungi
5. Crearea de prezentări și rapoarte
6. Analiza feedback-ului clienților
7. Scrierea de cod și debugging
8. Traduceri profesionale
9. Brainstorming strategic
10. Crearea de materiale de training

## Limitări de care trebuie să fii conștient

ChatGPT poate genera informații incorecte (hallucinations). Verifică întotdeauna faptele critice din surse externe.
    `,
    category: "AI & Tehnologie",
    author: { name: "Andrei Popescu", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
    date: "3 Mai 2024",
    readTime: 7,
    views: 15600,
    image: "https://images.unsplash.com/photo-1676557027519-03e6aa6c5e29?w=600&h=400&fit=crop",
  },
  {
    id: "9",
    slug: "tiktok-marketing-romania",
    title: "TikTok Marketing în România: Ghid complet pentru branduri",
    excerpt: "Cum să construiești prezența brandului tău pe TikTok și să ajungi la audiența tânără.",
    content: `
## TikTok în peisajul digital românesc

Cu peste 5 milioane de utilizatori în România, TikTok a devenit o platformă imposibil de ignorat pentru branduri.

## Ce funcționează pe TikTok

### Autenticitate peste producție

Videoclipurile filmate pe telefon, cu lumină naturală, performează adesea mai bine decât producțiile costisitoare. Utilizatorii recompensează autenticitatea.

### Tendințele sunt combustibil

Participarea la trending sounds și challenges poate da reach masiv. Identifică tendințele în primele 24-48 de ore.

### Storytelling în format scurt

Structura ideală: hook în primele 3 secunde, valoare în mijloc, call-to-action la final.

## Strategia de conținut

Postează de 3-5 ori pe săptămână, experimentează cu formate diferite și analizează datele din TikTok Analytics pentru a înțelege ce rezonează cu audiența ta.
    `,
    category: "Social Media",
    author: { name: "Ioana Marinescu", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    date: "2 Mai 2024",
    readTime: 6,
    views: 8700,
    image: "https://images.unsplash.com/photo-1611605698335-8441f0b9fbe4?w=600&h=400&fit=crop",
  },
  {
    id: "10",
    slug: "dropshipping-2024-ghid",
    title: "Dropshipping în 2024: Mai merită sau nu?",
    excerpt: "Analiza onestă a modelului de business dropshipping în contextul actual al e-commerce-ului.",
    content: `
## Dropshipping-ul în 2024: realitate vs. mit

Mulți antreprenori online visează la venituri pasive din dropshipping. Care este realitatea?

## Avantaje reale

- Capital inițial redus (fără stoc)
- Risc financiar scăzut
- Scalabilitate relativ ușoară
- Posibilitatea de a testa produse rapid

## Provocările actuale

Competiția a crescut masiv. Costurile de publicitate pe Meta și Google s-au triplat față de 2020. Marjele de profit s-au redus semnificativ.

## Modelul câștigător în 2024

Private label dropshipping cu furnizori din Europa (timpi de livrare mai mici) și focus pe nișe specifice cu audiențe pasionate. Branduirea este esențială pentru a ieși din competiția pe preț.
    `,
    category: "E-commerce",
    author: { name: "Vlad Negrescu", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    date: "30 Apr 2024",
    readTime: 9,
    views: 10300,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "11",
    slug: "productivitate-era-digitala",
    title: "Productivitate în era digitală: Sisteme care chiar funcționează",
    excerpt: "Tehnici și unelte testate pentru a face mai mult în mai puțin timp.",
    content: `
## Productivitatea în contextul supraîncărcării digitale

Notificările, emailurile și ședințele online ne fragmentează atenția. Iată cum să recâștigi controlul.

## Sisteme dovedite

### Time blocking

Alocă blocuri de timp dedicate tipurilor de muncă: deep work dimineața, ședințe după-amiaza, administrative seara.

### The 2-minute rule

Dacă o sarcină durează mai puțin de 2 minute, fă-o imediat. Nu o pune pe listă.

### Weekly review

O oră pe săptămână să revizuiești ce s-a întâmplat și să planifici săptămâna viitoare. Investiție cu ROI enorm.

## Unelte recomandate

Notion pentru knowledge management, Todoist pentru task management, Calendly pentru programări, Pomodoro timer pentru focus.
    `,
    category: "Dezvoltare Personală",
    author: { name: "Alexandra Ivanov", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
    date: "28 Apr 2024",
    readTime: 6,
    views: 7800,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
  },
  {
    id: "12",
    slug: "startup-finantare-romania",
    title: "Cum să obții finanțare pentru startup-ul tău în România",
    excerpt: "Ghid complet despre sursele de finanțare disponibile și cum să atragi investitori.",
    content: `
## Ecosistemul de finanțare pentru startup-uri în România

România a cunoscut o creștere semnificativă a investițiilor în startup-uri tech în ultimii ani.

## Surse de finanțare

### Fonduri europene

Prin instrumente precum fondurile POCU și PNRR, antreprenorii pot accesa granturi nerambursabile pentru digitalizare și inovație.

### Business Angels

Rețelele de business angels din România (ROTSA, BAR) investesc sume între 50.000-500.000 EUR în startup-uri early-stage.

### Venture Capital

Fonduri precum Growceanu, How to Web, și fonduri internaționale prezente în România investesc în startup-uri cu tracțiune dovedită.

## Pregătirea pitch-ului

Un pitch deck eficient acoperă problema, soluția, piața, modelul de business, tracțiunea, echipa și cererea de finanțare.
    `,
    category: "Business",
    author: { name: "Raluca Enache", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    date: "25 Apr 2024",
    readTime: 10,
    views: 6200,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
  },
];

export const featuredPost = blogPosts[0];
export const recommendedPosts = blogPosts.slice(1, 4);
export const latestPosts = blogPosts.slice(4, 7);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return blogPosts.filter((post) => post.category === cat.name);
}

export function getRelatedPosts(currentSlug: string, category: string): BlogPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, 3);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
