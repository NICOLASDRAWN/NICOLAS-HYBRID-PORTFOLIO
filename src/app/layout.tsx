import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";


const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const SITE_URL = "https://ncls.lat";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nicolas Monroy Pabon | Portafolio Profesional",
    template: "%s · Nicolas Monroy Pabon",
  },
  description:
    "Sitio web oficial de Nicolas Monroy Pabon. Portafolio profesional, proyectos y contacto.",
  applicationName: "Nicolas Monroy · Portfolio",
  authors: [{ name: "Nicolas Monroy Pabon", url: SITE_URL }],
  creator: "Nicolas Monroy Pabon",
  publisher: "Nicolas Monroy Pabon",
  keywords: [
    "Nicolás Monroy",
    "Diseñador Gráfico",
    "Full Stack Developer",
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
    "Branding",
    "Identidad Visual",
    "Diseño Gráfico",
    "UI/UX",
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
    siteName: "Nicolas Monroy Pabon · Portfolio",
    title: "Nicolas Monroy Pabon | Portafolio Profesional",
    description:
      "Sitio web oficial de Nicolas Monroy Pabon. Portafolio profesional, proyectos y contacto.",
    images: [
      {
        url: "/assets/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Nicolas Monroy Pabon — Portfolio Diseño + Desarrollo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolas Monroy Pabon | Portafolio Profesional",
    description:
      "Sitio web oficial de Nicolas Monroy Pabon. Portafolio profesional, proyectos y contacto.",
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
  // JSON-LD Multi-Entity Schema Graph (GEO & Search Engine Optimization)
  // Permite que ChatGPT, Claude, Perplexity, Gemini y Google comprendan la entidad completa
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Nicolas Monroy Pabon",
        alternateName: ["nicolasdrawn", "nicolasdev", "NCLS.DEV"],
        url: SITE_URL,
        email: "mailto:nicolasmonroypabon@gmail.com",
        telephone: "+573150135016",
        jobTitle: ["Desarrollador / Profesional", "Diseñador Gráfico", "Full Stack Developer", "AI Specialist"],
        description:
          "Sitio web oficial de Nicolas Monroy Pabon. Portafolio profesional, proyectos y contacto.",
        worksFor: {
          "@type": "Organization",
          name: "MIP International Trading SAS",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá",
          addressRegion: "Cundinamarca",
          addressCountry: "CO",
        },
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Comunicación Social",
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
          "OpenAI API",
          "ERP Systems",
          "B2B Platforms",
          "Graphic Design",
          "Brand Identity",
          "Adobe Illustrator",
          "Adobe Photoshop",
          "Adobe InDesign",
          "After Effects",
          "UI/UX Engineering",
          "Wayfinding & Signage",
        ],
        knowsLanguage: ["Spanish", "English"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Nicolás Monroy Pabón · Portfolio",
        description:
          "Portafolio oficial de Nicolás Monroy Pabón — Diseñador Gráfico & Full Stack Developer.",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
        inLanguage: "es-CO",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Nicolás Monroy Pabón · Diseñador Gráfico & Full Stack Developer",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#person`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "ItemList",
        name: "Proyectos Destacados de Ingeniería y Diseño",
        itemListElement: [
          {
            "@type": "SoftwareApplication",
            position: 1,
            name: "ProveedHub AI Platform",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web, Windows, macOS",
            description:
              "Validación automática de documentos legales mediante Gemini API y Computer Vision.",
          },
          {
            "@type": "SoftwareApplication",
            position: 2,
            name: "ERP Supply Chain",
            applicationCategory: "BusinessApplication",
            description:
              "Sistema de gestión de compras internacionales y comercio exterior con firma digital Certicámara.",
          },
          {
            "@type": "SoftwareApplication",
            position: 3,
            name: "Conquista la Ciudad",
            applicationCategory: "GameApplication",
            operatingSystem: "Android",
            description:
              "Aplicación móvil nativa con Kotlin y Google Maps SDK para gamificación territorial urbana.",
          },
          {
            "@type": "CreativeWork",
            position: 4,
            name: "Langers para Mobil",
            description:
              "Identidad de marca corporativa y diseño gráfico para operaciones de distribución de hidrocarburos.",
          },
          {
            "@type": "CreativeWork",
            position: 5,
            name: "San Juan Plaza",
            description:
              "Identidad visual y sistema de señalética comercial interior y exterior.",
          },
          {
            "@type": "CreativeWork",
            position: 6,
            name: "Manual de Marca",
            description:
              "Guía integral de identidad visual, tipografía, paleta cromática y aplicaciones.",
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="es"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} scroll-smooth antialiased dark`}
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
        <link rel="preconnect" href="https://i.postimg.cc" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.postimg.cc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body bg-bg text-ink selection:bg-acid selection:text-bg">
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-acid focus:text-bg focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:outline-none"
        >
          Saltar al contenido principal
        </a>

        {/* UNIQUE HUD OVERLAY - MOBILE ONLY */}
        <div className="lg:hidden fixed inset-0 z-[120] pointer-events-none p-4 font-mono text-[8px] text-acid/85 tracking-widest uppercase flex flex-col justify-between mix-blend-screen" aria-hidden="true">
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
