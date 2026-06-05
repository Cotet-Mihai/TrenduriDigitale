# Supabase Database Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Supabase database schema, RLS policies, indexes, RPC function, and seed the existing 12 articles + 5 categories so the blog has a live database backend.

**Architecture:** Normalized relational schema (authors → categories → posts) with RLS protecting all tables. Views are incremented via a `SECURITY DEFINER` SQL function called from the frontend via `supabase.rpc()`. No frontend data-fetching changes in this plan — only the DB layer and Supabase client bootstrap.

**Tech Stack:** Supabase (PostgreSQL), @supabase/supabase-js, Next.js App Router, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-05-supabase-database-design.md`

---

### Task 1: Install Supabase client and configure environment variables

**Files:**
- Modify: `package.json` (via pnpm install)
- Create: `.env.local`
- Create: `lib/supabase.ts`

- [ ] **Step 1: Install @supabase/supabase-js**

```bash
pnpm add @supabase/supabase-js
```

Expected output: `dependencies: + @supabase/supabase-js x.x.x`

- [ ] **Step 2: Create .env.local with Supabase credentials**

Create `.env.local` at the repo root:

```
NEXT_PUBLIC_SUPABASE_URL=https://sbwxamcznkchnhpealbv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_U0-FUr1k8Ce_Jyk_mC1FsA_PwJoDIAx
```

> `.env.local` is already in `.gitignore` for Next.js projects — do not commit it.

- [ ] **Step 3: Create the Supabase browser client**

Create `lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 4: Verify the client loads without errors**

```bash
pnpm build
```

Expected: build succeeds, no TypeScript errors related to `lib/supabase.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase.ts package.json pnpm-lock.yaml
git commit -m "feat: install supabase-js and bootstrap client"
```

---

### Task 2: Create database schema

**Files:** SQL executed via Supabase MCP `execute_sql`

- [ ] **Step 1: Create the `authors` table**

Execute via MCP `execute_sql`:

```sql
CREATE TABLE authors (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);
```

- [ ] **Step 2: Create the `categories` table**

```sql
CREATE TABLE categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  icon        text,
  description text,
  created_at  timestamptz DEFAULT now()
);
```

- [ ] **Step 3: Create the `posts` table**

```sql
CREATE TABLE posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text        NOT NULL UNIQUE,
  title        text        NOT NULL,
  excerpt      text,
  content      text,
  category_id  uuid        REFERENCES categories(id),
  author_id    uuid        REFERENCES authors(id),
  published_at timestamptz,
  read_time    integer,
  image_url    text,
  views        integer     DEFAULT 0,
  featured     boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

- [ ] **Step 4: Create the `newsletter_subscribers` table**

```sql
CREATE TABLE newsletter_subscribers (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text        NOT NULL UNIQUE,
  subscribed_at  timestamptz DEFAULT now(),
  active         boolean     DEFAULT true
);
```

- [ ] **Step 5: Verify tables exist**

Execute via MCP `execute_sql`:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected: returns `authors`, `categories`, `newsletter_subscribers`, `posts`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: create supabase database schema"
```

> Nothing to stage in the repo itself — this is a checkpoint commit to mark the schema is live.
> If you have a `supabase/` directory with migrations, commit those instead.

---

### Task 3: Create the updated_at trigger on posts

**Files:** SQL executed via MCP `execute_sql`

- [ ] **Step 1: Create the trigger function**

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

- [ ] **Step 2: Attach trigger to posts**

```sql
CREATE TRIGGER posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

- [ ] **Step 3: Verify trigger exists**

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

Expected: one row — `posts_updated_at`, `UPDATE`, `posts`.

---

### Task 4: Create increment_post_views RPC function

**Files:** SQL executed via MCP `execute_sql`

- [ ] **Step 1: Create the function**

```sql
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE posts
  SET views = views + 1
  WHERE slug = post_slug
    AND published_at IS NOT NULL;
$$;
```

> `SET search_path = public` is required for `SECURITY DEFINER` functions to prevent search_path injection attacks. `published_at IS NOT NULL` ensures draft posts cannot have their views incremented.

- [ ] **Step 2: Verify function exists**

```sql
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'increment_post_views';
```

Expected: one row — `increment_post_views`, `DEFINER`.

---

### Task 5: Create indexes

**Files:** SQL executed via MCP `execute_sql`

- [ ] **Step 1: Create indexes on posts**

```sql
CREATE INDEX idx_posts_category_id  ON posts(category_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_featured     ON posts(featured);
```

- [ ] **Step 2: Verify indexes**

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'posts'
ORDER BY indexname;
```

Expected: at minimum `idx_posts_category_id`, `idx_posts_featured`, `idx_posts_published_at`, `posts_pkey`, `posts_slug_key`.

---

### Task 6: Enable RLS and create access policies

**Files:** SQL executed via MCP `execute_sql`

- [ ] **Step 1: Enable RLS on all tables**

```sql
ALTER TABLE posts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: posts policies**

```sql
-- anon: can only read published posts
CREATE POLICY "anon_select_published_posts"
ON posts FOR SELECT
TO anon
USING (published_at IS NOT NULL);

-- authenticated (admin): full access
CREATE POLICY "authenticated_all_posts"
ON posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

- [ ] **Step 3: categories policies**

```sql
CREATE POLICY "anon_select_categories"
ON categories FOR SELECT
TO anon
USING (true);

CREATE POLICY "authenticated_all_categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

- [ ] **Step 4: authors policies**

```sql
CREATE POLICY "anon_select_authors"
ON authors FOR SELECT
TO anon
USING (true);

CREATE POLICY "authenticated_all_authors"
ON authors FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

- [ ] **Step 5: newsletter_subscribers policies**

```sql
-- anon: can subscribe (INSERT only)
CREATE POLICY "anon_insert_subscribers"
ON newsletter_subscribers FOR INSERT
TO anon
WITH CHECK (true);

-- authenticated: full access (read subscriber list, deactivate, etc.)
CREATE POLICY "authenticated_all_subscribers"
ON newsletter_subscribers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

- [ ] **Step 6: Verify RLS is enabled**

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected: `rowsecurity = true` for all 4 tables.

- [ ] **Step 7: Verify policies**

```sql
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Expected: 8 policies total (2 per table).

---

### Task 7: Seed initial data

**Files:** SQL executed via MCP `execute_sql`

Seed in FK order: authors → categories → posts. Newsletter subscribers start empty.

- [ ] **Step 1: Insert author**

```sql
INSERT INTO authors (id, name, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Radu Eftimie',
  '/logo.png'
);
```

> Using a fixed UUID makes the subsequent posts INSERT deterministic.

- [ ] **Step 2: Insert categories**

```sql
INSERT INTO categories (id, name, slug, icon, description) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Mobil & Gadgeturi',                    'mobil-gadgeturi',                    'smartphone', 'Review-uri, comparații și noutăți despre telefoane, tablete și gadgeturi tech.'),
  ('10000000-0000-0000-0000-000000000002', 'Hardware & PC',                         'hardware-pc',                         'cpu',        'Componente, build-uri, periferice și tot ce ține de lumea calculatoarelor.'),
  ('10000000-0000-0000-0000-000000000003', 'Inteligență Artificială & Internet',    'inteligenta-artificiala-internet',    'brain',      'Cele mai recente evoluții în AI, machine learning și lumea digitală conectată.'),
  ('10000000-0000-0000-0000-000000000004', 'Opinii & Editoriale',                   'opinii-editoriale',                   'pen-line',   'Analize, perspective și opinii despre industria tech și tendințele digitale.'),
  ('10000000-0000-0000-0000-000000000005', 'Tips & Tricks',                         'tips-tricks',                         'lightbulb',  'Sfaturi practice, tutoriale și trucuri pentru a profita la maximum de tehnologie.');
```

- [ ] **Step 3: Insert posts (batch 1 — posts 1–4)**

```sql
INSERT INTO posts (slug, title, excerpt, content, category_id, author_id, published_at, read_time, image_url, views, featured) VALUES
(
  'inteligenta-artificiala-2024',
  'Inteligența Artificială în 2024: Inovații care schimbă regulile jocului',
  'Descoperă cum AI-ul transformă industrii, optimizează procese și creează noi oportunități de business.',
  E'## Introducere\n\nInteligența artificială nu mai este doar un concept din filmele SF. În 2024, AI-ul a devenit o realitate palpabilă care transformă fiecare sector al economiei globale.\n\n## Cum transformă AI industriile\n\n### Sănătate și medicină\n\nAlgoritmii de machine learning analizează milioane de imagini medicale cu o precizie ce depășește capacitățile umane. Diagnosticele precoce ale cancerului, predicția bolilor și personalizarea tratamentelor sunt acum posibile datorită AI.\n\n### Educație\n\nPlatformele educaționale inteligente adaptează conținutul la nevoile individuale ale fiecărui student. Chatboții educaționali oferă asistență 24/7, iar sistemele de evaluare automată eliberează profesorii pentru activități mai creative.\n\n### Retail și E-commerce\n\nRecomandările personalizate, managementul inteligent al stocurilor și prețurile dinamice au revoluționat experiența de cumpărare. Companiile care adoptă AI raportează creșteri de 30-40% în conversii.\n\n## Oportunități pentru business-uri\n\n1. Automatizarea proceselor repetitive – Reducerea costurilor operaționale cu până la 60%\n2. Analiza predictivă – Anticiparea comportamentului clienților și tendințelor pieței\n3. Customer service automatizat – Chatboți care rezolvă 80% din interogările clienților fără intervenție umană\n4. Personalizare la scară – Experiențe unice pentru fiecare client\n\n## Provocări și considerente etice\n\nAdoptarea AI vine și cu responsabilități. Transparența algoritmilor, protecția datelor personale și impactul asupra forței de muncă sunt aspecte care necesită atenție sporită din partea companiilor și reglementatorilor.\n\n## Concluzie\n\n2024 este anul în care AI devine accesibil pentru business-uri de toate dimensiunile. Companiile care ignoră această revoluție riscă să rămână în urmă față de competitori mai agili și mai inovativi.',
  '10000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-15 00:00:00+00',
  8,
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop',
  12400,
  true
),
(
  'marketingul-in-era-digitala',
  'Marketingul în era digitală: Strategii care chiar funcționează',
  'De la conținut relevant la campanii personalizate, vezi ce funcționează în 2024.',
  E'## Marketingul digital în 2024\n\nPeisajul marketingului digital se schimbă rapid. Ce funcționa acum 2 ani poate fi complet ineficient astăzi.\n\n## Strategii dovedite\n\n### Content Marketing de calitate\n\nConținutul de lungă formă (2000+ cuvinte) continuă să domine rezultatele SEO. Articolele detaliate, ghidurile comprehensive și studiile de caz generate din date reale atrag și rețin audiența.\n\n### Email Marketing personalizat\n\nCu un ROI mediu de 42:1, email marketing-ul rămâne cel mai eficient canal digital. Segmentarea avansată și automatizarea permit trimiterea mesajului potrivit, persoanei potrivite, la momentul potrivit.\n\n### Video Marketing\n\nConținutul video generează de 3x mai mult engagement decât conținutul static. Short-form video (Reels, TikTok, YouTube Shorts) a explodat în popularitate și oferă reach organic excelent.\n\n## Tactici specifice pentru 2024\n\n- SEO semantic – Optimizare pentru intenția de căutare, nu doar cuvinte cheie\n- Social proof – Recenzii autentice și user-generated content\n- Micro-influenceri – Audiențe mici dar extrem de engaged\n- Retargeting inteligent – Reclame personalizate bazate pe comportamentul utilizatorilor',
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-12 00:00:00+00',
  6,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  8900,
  false
),
(
  'gadgeturi-smart-2024',
  'Gadgeturi smart care îți fac viața mai simplă în 2024',
  'Dispozitive inovatoare care combină tehnologia cu funcționalitatea de zi cu zi.',
  E'## Top gadgeturi smart în 2024\n\nTehnologia wearable și smart home a atins un nivel de maturitate impresionant. Iată ce merită atenția ta.\n\n## Ceasuri smart și fitness trackers\n\nGenerația nouă de smartwatch-uri oferă ECG, monitorizare a nivelului de oxigen din sânge și chiar detectarea căderilor. Apple Watch Series 10 și Galaxy Watch 7 conduc piața.\n\n## Smart home devices\n\n- Termostate inteligente – Economisesc până la 23% din factura la energie\n- Becuri smart – Control vocal, programe automate, scene de lumină\n- Camere de securitate AI – Recunosc fețe și trimit alerte personalizate\n\n## Headphones și audio\n\nNoise-cancelling-ul adaptiv a revoluționat experiența audio. Sony WH-1000XM5 și AirPods Pro 2 rămân standardele industriei.',
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-09 00:00:00+00',
  5,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
  7200,
  false
),
(
  'crestere-organica-instagram',
  'Cum să crești organic pe Instagram în 2024',
  'Strategii testate pentru a construi o comunitate reală și implicată.',
  E'## Creștere organică pe Instagram în 2024\n\nAlgoritmul Instagram s-a schimbat dramatic în 2024, favorizând conținutul autentic și interacțiunile reale.\n\n## Ce funcționează acum\n\n### Reels-uri consistente\n\nInstagram prioritizează Reels în feed și Explore. Postează cel puțin 3-4 Reels pe săptămână pentru reach maxim.\n\n### Engagement autentic\n\nRăspunde la TOATE comentariile în primele 2 ore după postare. Algoritmul consideră viteza de engagement drept semnal de calitate.\n\n### Carousels educaționale\n\nPostările cu mai multe imagini (carousels) au cel mai mare timp de vizionare, ceea ce îmbunătățește reach-ul organic.',
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-07 00:00:00+00',
  7,
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
  9800,
  false
);
```

- [ ] **Step 4: Insert posts (batch 2 — posts 5–8)**

```sql
INSERT INTO posts (slug, title, excerpt, content, category_id, author_id, published_at, read_time, image_url, views, featured) VALUES
(
  'automatizarea-proceselor-afaceri',
  'Automatizarea proceselor: Cheia eficienței în afaceri',
  'Află cum automatizarea poate reduce costurile și crește productivitatea.',
  E'## Automatizarea în business\n\nCompaniile care automatizează procesele repetitive raportează economii medii de 40% din costurile operaționale.\n\n## Procese ideale pentru automatizare\n\n- Facturare și contabilitate\n- Email marketing și follow-up\n- Raportare și analytics\n- Customer support (nivel 1)\n- Social media posting\n\n## Tools recomandate\n\nZapier și Make – Automatizarea fluxurilor de lucru între aplicații fără cod.\nHubSpot – CRM cu automatizare marketing avansată.\nMonday.com – Project management automatizat.',
  '10000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-06 00:00:00+00',
  6,
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
  5600,
  false
),
(
  'realitatea-augmentata-educatie',
  'Realitatea augmentată: De la entertainment la educație',
  'Exemple practice de utilizare a AR în diverse domenii și beneficii reale.',
  E'## AR în viața reală\n\nRealitatea augmentată a depășit faza de gimmick și devine o tehnologie cu aplicații practice serioase.\n\n## Educație și training\n\nIKEA folosește AR pentru a permite clienților să vizualizeze mobila în propriul spațiu. Google Maps AR navigation ghidează pietonii cu indicații suprapuse peste realitate.\n\n## Medical și sănătate\n\nChirurgii folosesc AR pentru a vedea imagini 3D ale organelor în timpul operațiilor. Studenții la medicină practică proceduri în medii AR înainte de a lucra cu pacienți reali.',
  '10000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-05 00:00:00+00',
  5,
  'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&h=400&fit=crop',
  4300,
  false
),
(
  'seo-2024-schimbari',
  'SEO în 2024: Ce s-a schimbat și cum te adaptezi',
  'Tendințele SEO care contează și pașii pe care trebuie să îi urmezi.',
  E'## SEO în era AI\n\nGoogle''s Search Generative Experience (SGE) a schimbat fundamental modul în care utilizatorii interacționează cu rezultatele căutărilor.\n\n## Ce s-a schimbat\n\n### AI Overviews\n\nGoogle afișează acum răspunsuri generate de AI în fruntea rezultatelor. Acest lucru reduce click-urile organice cu 20-30% pentru interogări informaționale simple.\n\n### E-E-A-T mai important ca niciodată\n\nExpertise, Experience, Authoritativeness, Trustworthiness – Google evaluează tot mai riguros aceste criterii.\n\n## Cum te adaptezi\n\n1. Optimizează pentru featured snippets și "People Also Ask"\n2. Construiește autoritate tematică prin conținut comprehensiv\n3. Investește în linkbuilding de calitate\n4. Prioritizează viteza și experiența utilizatorului',
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-04 00:00:00+00',
  8,
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop',
  11200,
  false
),
(
  'chatgpt-pentru-business',
  'ChatGPT pentru business: 10 utilizări care îți economisesc ore întregi',
  'Descoperă cum să integrezi AI în fluxul de lucru zilnic pentru rezultate remarcabile.',
  E'## ChatGPT în mediul de afaceri\n\nNu mai este un secret: companiile care folosesc ChatGPT strategic economisesc în medie 3-4 ore pe zi per angajat.\n\n## 10 utilizări practice\n\n1. Redactarea și editarea conținutului de marketing\n2. Generarea de idei pentru campanii\n3. Răspunsuri la emailuri complexe\n4. Rezumarea documentelor lungi\n5. Crearea de prezentări și rapoarte\n6. Analiza feedback-ului clienților\n7. Scrierea de cod și debugging\n8. Traduceri profesionale\n9. Brainstorming strategic\n10. Crearea de materiale de training\n\n## Limitări de care trebuie să fii conștient\n\nChatGPT poate genera informații incorecte (hallucinations). Verifică întotdeauna faptele critice din surse externe.',
  '10000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-03 00:00:00+00',
  7,
  'https://images.unsplash.com/photo-1676557027519-03e6aa6c5e29?w=600&h=400&fit=crop',
  15600,
  false
);
```

- [ ] **Step 5: Insert posts (batch 3 — posts 9–12)**

```sql
INSERT INTO posts (slug, title, excerpt, content, category_id, author_id, published_at, read_time, image_url, views, featured) VALUES
(
  'tiktok-marketing-romania',
  'TikTok Marketing în România: Ghid complet pentru branduri',
  'Cum să construiești prezența brandului tău pe TikTok și să ajungi la audiența tânără.',
  E'## TikTok în peisajul digital românesc\n\nCu peste 5 milioane de utilizatori în România, TikTok a devenit o platformă imposibil de ignorat pentru branduri.\n\n## Ce funcționează pe TikTok\n\n### Autenticitate peste producție\n\nVideoclipurile filmate pe telefon, cu lumină naturală, performează adesea mai bine decât producțiile costisitoare. Utilizatorii recompensează autenticitatea.\n\n### Tendințele sunt combustibil\n\nParticiparea la trending sounds și challenges poate da reach masiv. Identifică tendințele în primele 24-48 de ore.\n\n### Storytelling în format scurt\n\nStructura ideală: hook în primele 3 secunde, valoare în mijloc, call-to-action la final.\n\n## Strategia de conținut\n\nPostează de 3-5 ori pe săptămână, experimentează cu formate diferite și analizează datele din TikTok Analytics pentru a înțelege ce rezonează cu audiența ta.',
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '2024-05-02 00:00:00+00',
  6,
  'https://images.unsplash.com/photo-1611605698335-8441f0b9fbe4?w=600&h=400&fit=crop',
  8700,
  false
),
(
  'dropshipping-2024-ghid',
  'Dropshipping în 2024: Mai merită sau nu?',
  'Analiza onestă a modelului de business dropshipping în contextul actual al e-commerce-ului.',
  E'## Dropshipping-ul în 2024: realitate vs. mit\n\nMulți antreprenori online visează la venituri pasive din dropshipping. Care este realitatea?\n\n## Avantaje reale\n\n- Capital inițial redus (fără stoc)\n- Risc financiar scăzut\n- Scalabilitate relativ ușoară\n- Posibilitatea de a testa produse rapid\n\n## Provocările actuale\n\nCompetiția a crescut masiv. Costurile de publicitate pe Meta și Google s-au triplat față de 2020. Marjele de profit s-au redus semnificativ.\n\n## Modelul câștigător în 2024\n\nPrivate label dropshipping cu furnizori din Europa (timpi de livrare mai mici) și focus pe nișe specifice cu audiențe pasionate. Branduirea este esențială pentru a ieși din competiția pe preț.',
  '10000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '2024-04-30 00:00:00+00',
  9,
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  10300,
  false
),
(
  'productivitate-era-digitala',
  'Productivitate în era digitală: Sisteme care chiar funcționează',
  'Tehnici și unelte testate pentru a face mai mult în mai puțin timp.',
  E'## Productivitatea în contextul supraîncărcării digitale\n\nNotificările, emailurile și ședințele online ne fragmentează atenția. Iată cum să recâștigi controlul.\n\n## Sisteme dovedite\n\n### Time blocking\n\nAlocă blocuri de timp dedicate tipurilor de muncă: deep work dimineața, ședințe după-amiaza, administrative seara.\n\n### The 2-minute rule\n\nDacă o sarcină durează mai puțin de 2 minute, fă-o imediat. Nu o pune pe listă.\n\n### Weekly review\n\nO oră pe săptămână să revizuiești ce s-a întâmplat și să planifici săptămâna viitoare. Investiție cu ROI enorm.\n\n## Unelte recomandate\n\nNotion pentru knowledge management, Todoist pentru task management, Calendly pentru programări, Pomodoro timer pentru focus.',
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '2024-04-28 00:00:00+00',
  6,
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
  7800,
  false
),
(
  'startup-finantare-romania',
  'Cum să obții finanțare pentru startup-ul tău în România',
  'Ghid complet despre sursele de finanțare disponibile și cum să atragi investitori.',
  E'## Ecosistemul de finanțare pentru startup-uri în România\n\nRomânia a cunoscut o creștere semnificativă a investițiilor în startup-uri tech în ultimii ani.\n\n## Surse de finanțare\n\n### Fonduri europene\n\nPrin instrumente precum fondurile POCU și PNRR, antreprenorii pot accesa granturi nerambursabile pentru digitalizare și inovație.\n\n### Business Angels\n\nRețelele de business angels din România (ROTSA, BAR) investesc sume între 50.000-500.000 EUR în startup-uri early-stage.\n\n### Venture Capital\n\nFonduri precum Growceanu, How to Web, și fonduri internaționale prezente în România investesc în startup-uri cu tracțiune dovedită.\n\n## Pregătirea pitch-ului\n\nUn pitch deck eficient acoperă problema, soluția, piața, modelul de business, tracțiunea, echipa și cererea de finanțare.',
  '10000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '2024-04-25 00:00:00+00',
  10,
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop',
  6200,
  false
);
```

- [ ] **Step 6: Verify seed data counts**

```sql
SELECT
  (SELECT count(*) FROM authors)               AS authors,
  (SELECT count(*) FROM categories)            AS categories,
  (SELECT count(*) FROM posts)                 AS posts,
  (SELECT count(*) FROM newsletter_subscribers) AS subscribers;
```

Expected: `authors=1, categories=5, posts=12, subscribers=0`

---

### Task 8: End-to-end verification

**Files:** SQL executed via MCP `execute_sql`

- [ ] **Step 1: Test public read (simulates anon role)**

```sql
-- Should return 12 rows (all posts are published)
SELECT slug, title, views, featured
FROM posts
WHERE published_at IS NOT NULL
ORDER BY published_at DESC;
```

- [ ] **Step 2: Test join query (simulates getPostBySlug)**

```sql
SELECT
  p.slug,
  p.title,
  p.views,
  c.name  AS category_name,
  c.slug  AS category_slug,
  a.name  AS author_name
FROM posts p
JOIN categories c ON c.id = p.category_id
JOIN authors    a ON a.id = p.author_id
WHERE p.slug = 'inteligenta-artificiala-2024';
```

Expected: one row with `category_name = 'Inteligență Artificială & Internet'`, `author_name = 'Radu Eftimie'`.

- [ ] **Step 3: Test views increment function**

```sql
-- Before
SELECT slug, views FROM posts WHERE slug = 'chatgpt-pentru-business';

-- Increment
SELECT increment_post_views('chatgpt-pentru-business');

-- After (should be views + 1)
SELECT slug, views FROM posts WHERE slug = 'chatgpt-pentru-business';
```

Expected: views goes from `15600` to `15601`.

- [ ] **Step 4: Test category filter (simulates getPostsByCategory)**

```sql
SELECT p.slug, p.title
FROM posts p
JOIN categories c ON c.id = p.category_id
WHERE c.slug = 'tips-tricks'
ORDER BY p.published_at DESC;
```

Expected: 5 rows (marketingul, crestere-organica-instagram, seo-2024-schimbari, tiktok-marketing-romania, productivitate-era-digitala).

- [ ] **Step 5: Final commit**

```bash
git add docs/
git commit -m "feat: supabase database schema, RLS, seed data complete"
```

---

## What's Next (out of scope for this plan)

1. **Replace `lib/data.ts`** — rewrite helper functions to query Supabase instead of static arrays
2. **Admin panel** — `/admin` route with Supabase Auth (email/password) to add/edit posts
3. **Env vars on Vercel** — `vercel env add NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
