import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const SITE_URL = "https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nicolás Monroy Pabón · Full Stack Developer & AI Specialist",
    template: "%s · Nicolás Monroy Pabón",
  },
  description:
    "Full Stack Developer híbrido basado en Bogotá. Construyo ERPs empresariales, plataformas B2B y productos con IA generativa (Claude, Gemini, OpenAI) en entornos de producción real. Disponible para oportunidades remotas.",
  applicationName: "Nicolás Monroy · Portfolio",
  authors: [{ name: "Nicolás Monroy Pabón", url: SITE_URL }],
  creator: "Nicolás Monroy Pabón",
  publisher: "Nicolás Monroy Pabón",
  keywords: [
    "Nicolás Monroy",
    "Full Stack Developer",
    "AI Specialist",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "Kotlin",
    "IA generativa",
    "Claude API",
    "Gemini API",
    "Bogotá",
    "Colombia",
    "Remote developer",
    "ERP",
    "B2B",
  ],
  category: "technology",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-CO": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Nicolás Monroy Pabón · Portfolio",
    title: "Nicolás Monroy Pabón · Full Stack Developer & AI Specialist",
    description:
      "Construyo ERPs, plataformas B2B y productos con IA generativa en producción real. Disponible para oportunidades remotas.",
    images: [
      {
        url: "/NICOLAS-HYBRID-PORTFOLIO/assets/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Nicolás Monroy Pabón — Portfolio Full Stack · AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolás Monroy Pabón · Full Stack Developer & AI Specialist",
    description:
      "Full Stack híbrido · IA aplicada en producción real · Disponible remoto.",
    images: ["/NICOLAS-HYBRID-PORTFOLIO/assets/og-cover.png"],
    creator: "@nicolasdrawn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/NICOLAS-HYBRID-PORTFOLIO/favicon.ico",
  },
  verification: {
    // Agregar códigos aquí si se activan Google Search Console, Bing Webmaster, etc.
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#F2EFE8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Person schema — ayuda a que ChatGPT, Claude, Gemini y buscadores
  // entiendan quién es Nicolás y qué hace cuando se le pregunta por él.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nicolás Monroy Pabón",
    alternateName: "nicolasdrawn",
    url: SITE_URL,
    email: "mailto:nicolasmonroypabon@gmail.com",
    jobTitle: "Full Stack Developer & AI Specialist",
    worksFor: {
      "@type": "Organization",
      name: "MIP International Trading SAS",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogotá",
      addressCountry: "CO",
    },
    sameAs: [
      "https://github.com/NICOLASDRAWN",
      "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    ],
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "Kotlin / Jetpack Compose",
      "Generative AI",
      "Claude API",
      "Gemini API",
      "ERP Systems",
      "B2B Platforms",
      "Graphic Design",
      "Brand Communication",
    ],
    knowsLanguage: ["Spanish", "English"],
  };

  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} scroll-smooth antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="font-body bg-bg text-ink selection:bg-acid selection:text-bg">
        {/* UNIQUE HUD OVERLAY - MOBILE ONLY */}
        <div className="lg:hidden fixed inset-0 z-[120] pointer-events-none p-4 font-mono text-[8px] text-acid/25 tracking-widest uppercase flex flex-col justify-between mix-blend-screen opacity-60">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span>[ SIGNAL_STR: 98% ]</span>
                    <span>[ BATT: NOMINAL ]</span>
                </div>
                <div className="text-right">
                    <span>SCANNER_V1</span><br/>
                    <span>LATENCY: 12ms</span>
                </div>
            </div>
            
            <div className="flex justify-between items-end pb-20"> {/* pb-20 to stay above bottom dock */}
                <div>
                    <span>COORDS: BOG/CO</span><br/>
                    <span>TEMP: 32°C</span>
                </div>
                <div className="text-right">
                    <span>SYS_CORE: DEPLOYED</span><br/>
                    <span>REV: 2026.04.18</span>
                </div>
            </div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
