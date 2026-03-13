import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Yalla Allemagne — Guide pour les Tunisiens",
    template: "%s | Yalla Allemagne"
  },
  description: "Le guide cool et pratique pour les Tunisiens qui veulent partir en Allemagne. Visa, logement, travail, langue — on t'explique tout, étape par étape !",
  keywords: ["tunisie", "allemagne", "visa", "immigration", "expatriation", "logement", "travail", "apprendre allemand", "guide tunisien"],
  authors: [{ name: "Yalla Allemagne" }],
  creator: "Yalla Allemagne",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://yalla-allemagne.com",
    siteName: "Yalla Allemagne",
    title: "Yalla Allemagne — Guide pour les Tunisiens",
    description: "Le guide cool et pratique pour les Tunisiens qui veulent partir en Allemagne avec chatbot IA intégré",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yalla Allemagne — Guide pour les Tunisiens",
    description: "Le guide cool et pratique pour les Tunisiens qui veulent partir en Allemagne",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
