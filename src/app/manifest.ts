import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nicolás Monroy Pabón · Portfolio",
    short_name: "NCLS.DEV",
    description:
      "Diseñador Gráfico y Full Stack Developer híbrido. Arquitectura de Software B2B, Inteligencia Artificial e Identidad de Marca.",
    start_url: "/NICOLAS-HYBRID-PORTFOLIO/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/NICOLAS-HYBRID-PORTFOLIO/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
