import { JsonLd, SITE_URL } from "@/components/site/chrome";
import { ALL_MUNICIPIOS, CONTACT, SERVICES } from "@/components/world/content";
import { EditorialHome, type Entry } from "@/components/editorial/home";
import bitacora from "@/content/bitacora.json";
import "@/components/editorial/editorial.css";

const businessLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nicolás Monroy · Diseño, edición, web y programación",
  url: SITE_URL,
  image: `${SITE_URL}/assets/astronauta.webp`,
  email: CONTACT.email,
  telephone: "+57 315 013 5016",
  founder: { "@id": `${SITE_URL}/#nicolas` },
  address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
  sameAs: ["https://www.behance.net/nicolasmonroy3", "https://www.instagram.com/nicolas_pabon7/", "https://www.linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/"],
  knowsLanguage: ["es", "en"],
  areaServed: [
    { "@type": "AdministrativeArea", name: "Huila, Colombia" },
    ...ALL_MUNICIPIOS.map((m) => ({ "@type": "City", name: `${m}, Huila` })),
    { "@type": "Country", name: "Colombia" },
    { "@type": "Place", name: "Latinoamérica" },
    { "@type": "Place", name: "Remoto — todo el mundo" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/servicios/${s.slug}/` } })),
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={businessLd} />
      <main id="main-content">
        <EditorialHome entries={bitacora as Entry[]} />
      </main>
    </>
  );
}
