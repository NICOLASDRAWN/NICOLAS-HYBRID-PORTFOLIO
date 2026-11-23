import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const SITE_URL = "https://ncls.lat";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nicolás Monroy | Diseñador web, branding y desarrollo en Bogotá, Colombia",
    template: "%s · Nicolas Monroy Pabon",
  },
  description:
    "Diseñador web y desarrollador en Bogotá: páginas web, branding, UI/UX, motion graphics, fotografía, edición de video, contenido para redes y automatización con IA para marcas de Colombia y Latinoamérica.",
  applicationName: "Nicolas Monroy · Portfolio",
  authors: [{ name: "Nicolas Monroy Pabon", url: SITE_URL }],
  creator: "Nicolas Monroy Pabon",
  publisher: "Nicolas Monroy Pabon",
  keywords: [
      "Nicolás Monroy",
      "Nicolás Monroy Pabón",
      "diseñador web Bogotá",
      "diseño de páginas web Colombia",
      "desarrollador web freelance",
      "diseño de marca",
      "branding Bogotá",
      "identidad visual",
      "diseño de logos",
      "diseño UI/UX",
      "diseño de apps",
      "motion graphics",
      "animación de logos",
      "edición de video",
      "reels para Instagram",
      "fotografía de producto",
      "fotografía gastronómica",
      "fotografía de eventos",
      "contenido para redes sociales",
      "community manager",
      "campañas publicitarias",
      "trade marketing",
      "dirección de arte",
      "automatización con IA",
      "automatización de Excel",
      "desarrollo de software a medida",
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "landing page",
      "SEO",
      "Bogotá",
      "Neiva",
      "Huila",
      "Colombia",
      "Latinoamérica",
      "freelance remoto"
  ],
  category: "technology",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-CO": SITE_URL,
      "en": `${SITE_URL}/en/`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Nicolas Monroy Pabon · Portfolio",
    title: "Nicolas Monroy Pabon | Portafolio Profesional",
    description:
      "Diseño web, branding, UI/UX, video y automatización desde Bogotá para toda Colombia y proyectos internacionales. Portafolio de Nicolás Monroy Pabón.",
    images: [
      {
        url: "/assets/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Ideas en movimiento — Portafolio de Nicolás Monroy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolas Monroy Pabon | Portafolio Profesional",
    description:
      "Diseño web, branding, UI/UX, video y automatización desde Bogotá para toda Colombia y proyectos internacionales. Portafolio de Nicolás Monroy Pabón.",
    images: ["/assets/og-cover.png"],
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
    icon: "/favicon.ico",
  },
  verification: {
    // Agregar códigos aquí si se activan Google Search Console, Bing Webmaster, etc.
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101110" },
    { media: "(prefers-color-scheme: light)", color: "#101110" },
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
  // JSON-LD Multi-Entity Schema Graph (GEO & Search Engine Optimization)
  // Permite que ChatGPT, Claude, Perplexity, Gemini y Google comprendan la entidad completa
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#nicolas`,
        name: "Nicolás Monroy Pabón",
        alternateName: ["Nicolás Monroy", "Nicolas Pabon", "NCLS"],
        url: SITE_URL,
        image: `${SITE_URL}/assets/astronauta.webp`,
        jobTitle: "Diseñador gráfico, desarrollador web y creative technologist",
        description: "Diseñador y desarrollador en Bogotá. Diseño web, branding, UI/UX, motion graphics, fotografía, video, contenido para redes y automatización con IA.",
        email: "mailto:nicolasmonroypabon@gmail.com",
        telephone: "+57 315 013 5016",
        address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressRegion: "Bogotá D.C.", addressCountry: "CO" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "UNIMINUTO" },
        hasOccupation: { "@type": "Occupation", name: "Diseñador web y desarrollador", occupationLocation: { "@type": "City", name: "Bogotá" } },
        knowsLanguage: ["es", "en"],
        knowsAbout: ["Diseño web", "Desarrollo web", "Branding", "Identidad visual", "Diseño UI/UX", "Motion graphics", "Edición de video", "Fotografía", "Contenido para redes sociales", "Campañas publicitarias", "Trade marketing", "Dirección de arte", "Automatización con IA", "Next.js", "React", "TypeScript", "Python"],
        sameAs: ["https://www.behance.net/nicolasmonroy3", "https://nicolaspabonm.myportfolio.com/", "https://www.instagram.com/nicolas_pabon7/", "https://www.linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/", "https://github.com/NICOLASDRAWN"],
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#web`, url: SITE_URL, name: "Nicolás Monroy · Ideas en movimiento", inLanguage: "es-CO", publisher: { "@id": `${SITE_URL}/#nicolas` } },
    ],
  };

  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${anton.variable} ${instrument.variable} scroll-smooth antialiased`}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F9XZ0YEWTS" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F9XZ0YEWTS');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M3CTP538');`}
        </Script>
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body bg-bg text-ink selection:bg-accent selection:text-bg">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3CTP538"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Skip to main content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:outline-none"
        >
          Saltar al contenido principal
        </a>

        {children}
      </body>
    </html>
  );
}
