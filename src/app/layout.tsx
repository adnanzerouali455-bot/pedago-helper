import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo, Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import "./brand-system.css";
import "./landing.css";
import "./workspace-theme.css";

const headingFont = Fraunces({ subsets: ["latin"], variable: "--font-landing-heading", display: "swap" });
const bodyFont = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-landing-body", display: "swap" });
const arabicFont = Cairo({ subsets: ["arabic", "latin"], variable: "--font-landing-arabic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://pedago-helper.vercel.app"),
  title: "Pedago Helper | المساعد البيداغوجي",
  description: "Pedago Helper aide les enseignants marocains à préparer leurs جذاذات et les élèves à explorer les SVT. منصة لإعداد الدروس وتعلّم علوم الحياة والأرض.",
  openGraph: {
    title: "Pedago Helper | المساعد البيداغوجي",
    description: "Deux espaces complémentaires pour préparer les leçons et apprendre les SVT au Maroc. فضاء للأستاذ وفضاء للتلميذ.",
    url: "https://pedago-helper.vercel.app/",
    siteName: "Pedago Helper",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="fr" className={`${headingFont.variable} ${bodyFont.variable} ${arabicFont.variable}`}><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
