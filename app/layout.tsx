import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { getCategories } from "@/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const BASE_URL = "https://trenduridigitale.ro";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "TrenduriDigitale – Tech cu sinceritate",
    template: "%s – TrenduriDigitale",
  },
  description: "Știri, opinii și analize despre smartphone-uri, gadgeturi, AI și inovație digitală. Fără artificii, fără clickbait.",
  keywords: ["tehnologie", "gadgeturi", "smartphone", "inteligenta artificiala", "inovatie digitala", "trenduri digitale"],
  authors: [{ name: "TrenduriDigitale", url: BASE_URL }],
  creator: "TrenduriDigitale",
  publisher: "TrenduriDigitale",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: BASE_URL,
    siteName: "TrenduriDigitale",
    title: "TrenduriDigitale – Tech cu sinceritate",
    description: "Știri, opinii și analize despre smartphone-uri, gadgeturi, AI și inovație digitală.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "TrenduriDigitale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrenduriDigitale – Tech cu sinceritate",
    description: "Știri, opinii și analize despre smartphone-uri, gadgeturi, AI și inovație digitală.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TrenduriDigitale",
  url: BASE_URL,
  logo: `${BASE_URL}/logo-text.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "redactia@trenduridigitale.ro",
    contactType: "editorial",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html
      lang="ro"
      className={`${inter.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar categories={categories} />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
